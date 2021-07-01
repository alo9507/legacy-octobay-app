<template>
  <div>
    <div
      v-if="!loading && discussionNode"
      :class="['issue d-flex flex-column', { showDetails }]"
      @click="showDetails = !showDetails"
    >
      <div class="position-relative">
        <!-- header -->
        <div class="d-flex flex-column align-items-top px-3 py-2">
          <div
            :class="['d-flex flex-column', { 'text-truncate': !showDetails }]"
          >
            <small class="text-muted text-truncate">
              <small>octobay/app</small>
            </small>
            <div :class="{ 'text-truncate': !showDetails }">
              <b>{{ discussionNode.title }}</b>
            </div>
            <div
              class="flex-fill rounded-lg position-relative my-1"
              style="background-color: #ddd"
            >
              <div
                class="bg-success rounded-lg position-relative"
                :style="`height: 5px; width: ${(
                  proposal.votes.reduce((a, b) => a + b.percentage, 0) / 100
                ).toFixed(2)}%; z-index: 2`"
              ></div>
              <div
                class="bg-warning rounded-lg position-absolute"
                :style="`height: 5px; width: ${(proposal.quorum / 100).toFixed(
                  2
                )}%; top: 0; z-index: 1`"
              ></div>
            </div>
            <div class="d-flex justify-content-between">
              <small class="text-muted text-center">
                Quorum<br />
                <b>{{ (proposal.quorum / 100).toFixed(2) }} %</b>
              </small>
              <small class="text-muted text-center">
                Current<br />
                <b>
                  {{
                    (
                      proposal.votes.reduce((a, b) => a + b.percentage, 0) / 100
                    ).toFixed(2)
                  }}
                  %
                </b>
              </small>
              <small class="text-muted text-center">
                Days left<br />
                <b>
                  {{
                    (
                      (proposal.endDate - proposal.startDate) /
                      (60 * 60 * 24)
                    ).toFixed(1)
                  }}
                </b>
              </small>
            </div>
          </div>
        </div>
      </div>
      <!-- details -->
      <transition name="fade">
        <div
          v-if="showDetails"
          :class="[
            'd-flex flex-column justify-content-start align-items-center',
          ]"
          style="cursor: default"
          @click.stop
        >
          <!-- details buttons -->
          <div
            class="border-top border-bottom w-100 py-2 text-nowrap d-flex justify-content-between align-items-center px-4"
          >
            <div>
              <!-- vote -->
              <button
                v-tooltip="{ content: 'Vote for proposal', trigger: 'hover' }"
                class="btn btn-sm btn-success"
                :disabled="waitingForVoteTransaction"
                @click="castVote(false)"
              >
                <font-awesome-icon
                  v-if="waitingForVoteTransaction"
                  :icon="['fas', 'circle-notch']"
                  spin
                />
                <font-awesome-icon v-else :icon="['fas', 'thumbs-up']" />
              </button>
              <button
                v-tooltip="{
                  content: 'Vote against proposal',
                  trigger: 'hover',
                }"
                class="btn btn-sm btn-danger"
                :disabled="waitingForVoteTransaction"
                @click="castVote(true)"
              >
                <font-awesome-icon
                  v-if="waitingForVoteTransaction"
                  :icon="['fas', 'circle-notch']"
                  spin
                />
                <font-awesome-icon v-else :icon="['fas', 'thumbs-down']" />
              </button>
            </div>
            <div>
              <!-- votes -->
              <button
                v-tooltip="{ content: 'See all Votes', trigger: 'hover' }"
                :class="[
                  'btn btn-sm btn-light text-muted',
                  { active: action === 'votes' },
                ]"
                @click="changeAction('votes')"
              >
                <font-awesome-icon :icon="['fas', 'vote-yea']" />
              </button>
              <!-- GitHub link -->
              <a
                v-tooltip="{
                  content:
                    'Show Discussion on GitHub<br><span class=\'text-dark\'><small class=\'d-flex justify-content-center my-2\'>Has been altered after submission.<br>Check edit log on GitHub.</small></span><img src=\'/edit-log.png\' class=\'w-100\' />',
                  trigger: 'hover',
                }"
                :href="discussionNode.url"
                target="_blank"
                class="btn btn-sm btn-light text-muted"
              >
                <font-awesome-icon :icon="['fab', 'github']" />
                <font-awesome-icon
                  :icon="['fas', 'external-link-alt']"
                  class="text-muted-light ml-1"
                />
              </a>
            </div>
          </div>
          <!-- details content -->
          <div class="w-100 px-3">
            <transition name="fade" mode="out-in">
              <!-- votes -->
              <div v-if="action === 'votes'" key="holders" class="py-3">
                <div v-if="proposal.votes.length">
                  <div
                    v-for="vote in proposal.votes"
                    :key="vote.id"
                    class="d-flex justify-content-between"
                  >
                    <small>
                      <AddressShort
                        :address="vote.holder.ethAddress"
                        class="text-muted"
                      />
                    </small>
                    <small
                      :class="
                        'text-' + (vote.percentage > 0 ? 'success' : 'danger')
                      "
                      >{{ (vote.percentage / 100).toFixed(2) }} %</small
                    >
                  </div>
                </div>
                <small v-else class="text-muted d-block text-center">
                  No votes for this proposal yet.
                </small>
              </div>
            </transition>
          </div>
        </div>
      </transition>
    </div>
    <div
      v-else-if="loading"
      class="d-flex justify-content-center p-4 m-3 rounded-lg"
    >
      <font-awesome-icon
        :icon="['fas', 'circle-notch']"
        spin
        class="text-muted-light"
      />
    </div>
    <div
      v-else-if="!loading && !discussionNode"
      class="d-flex justify-content-center p-3 rounded-lg"
    >
      <small class="text-muted d-block text-center border rounded-xl px-3 py-1">
        <small
          ><font-awesome-icon :icon="['fas', 'exclamation-triangle']"
        /></small>
        No Discussion found for Proposal.
      </small>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import helpers from '@/mixins/helpers'

export default {
  mixins: [helpers],
  props: {
    proposal: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      discussionNode: null,
      showDetails: false,
      action: null,
      loading: false,
      waitingForVoteTransaction: false,
    }
  },
  computed: {
    ...mapGetters(['account']),
  },
  mounted() {
    this.loading = true
    this.$github
      .getDiscussionById(this.proposal.id)
      .then((discussion) => {
        if (discussion) {
          this.discussionNode = {
            title: discussion.title,
            url: discussion.url,
          }
        }
      })
      .finally(() => (this.loading = false))
  },
  methods: {
    changeAction(action) {
      if (this.action === action) {
        this.action = null
      } else {
        this.action = action
      }
    },
    castVote(against) {
      this.waitingForVoteTransaction = true
      this.octobayGovToken(this.proposal.department.tokenAddress)
        .methods.balanceOfAsPercentAt(
          this.account,
          this.proposal.balanceSnapshotId
        )
        .call()
        .then((percentage) => {
          this.octobayGovernor.methods
            .castVote(
              this.proposal.department.projectId,
              this.proposal.count,
              against ? percentage * -1 : percentage
            )
            .send({ from: this.account })
            .then(() => {
              this.waitingForVoteTransaction = false
              setTimeout(() => {
                this.$store.dispatch('updateDepartments')
              }, 3000)
            })
        })
    },
  },
}
</script>

<style lang="sass" scoped>
.issue
  border-top: solid 1px fff
  cursor: pointer
  position: relative
  &:hover
    background: #f8f8f8
  &.showDetails
    background: #f8f8f8
    box-shadow: inset 0 0 7px rgba(0, 0, 0, 0.2)
    .details
      max-height: 40px
      cursor: default
      &.action
        max-height: 100px
      &.deposits
        max-height: 350px
</style>
