<template>
  <div>
    <div
      v-if="!loading && issueNode"
      :class="['issue d-flex flex-column', { showDetails }]"
      @click="showDetails = !showDetails"
    >
      <div class="position-relative">
        <!-- header -->
        <div class="d-flex align-items-top px-3 py-2">
          <div :class="{ 'text-truncate': !showDetails }">
            <small class="text-muted text-truncate">
              <small>
                <font-awesome-icon
                  :icon="['fas', 'check-double']"
                  class="text-muted-light"
                />
                {{ issueNode.owner }}/{{ issueNode.repository }}
              </small>
            </small>
            <div :class="{ 'text-truncate': !showDetails }">
              <span v-if="issue.boostAmount">
                <svg style="width: 14px; height: 14px" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12M8.8,14L10,12.8V4H14V12.8L15.2,14H8.8Z"
                  />
                </svg>
              </span>
              {{ issueNode.title }}
            </div>
          </div>
          <div class="text-nowrap text-right ml-auto pl-3">
            <div class="mb-0 d-flex align-items-center">
              <div class="text-center d-flex flex-column align-items-end">
                <div>
                  {{ $web3utils.fromWei(issue.depositAmount, 'ether') }}
                  <img src="/eth-logo.png" width="16px" height="16" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- tags -->
        <div
          v-if="issueNode.primaryLanguage"
          :class="['px-3 pb-3', { 'text-truncate': !showDetails }]"
          style="text-overflow: ' ...'"
        >
          <span
            :class="
              'mr-1 badge badge-pill' +
              (brightnessByColor(issueNode.primaryLanguage.color) < 180
                ? ' text-white'
                : '')
            "
            :style="'background-color: ' + issueNode.primaryLanguage.color"
          >
            {{ issueNode.primaryLanguage.name }} </span
          ><span
            v-for="label in issueNode.labels"
            :key="label.color"
            :class="
              'mr-1 badge badge-pill' +
              (brightnessByColor('#' + label.color) < 180 ? ' text-white' : '')
            "
            :style="'background-color: #' + label.color"
          >
            {{ label.name }}
          </span>
        </div>
      </div>
      <!-- details -->
      <transition name="fade">
        <div
          v-if="showDetails"
          :class="[
            'd-flex flex-column justify-content-start align-items-center',
            { action: !!action, deposits: action == 'deposits' },
          ]"
          style="cursor: default"
          @click.stop
        >
          <!-- details buttons -->
          <div
            class="border-top border-bottom w-100 py-2 text-nowrap d-flex justify-content-between align-items-center px-4"
          >
            <!-- fund -->
            <button
              v-tooltip="{ content: 'Fund issue', trigger: 'hover' }"
              class="btn btn-sm btn-light text-muted"
              @click="fundIssue()"
            >
              <font-awesome-icon :icon="['fas', 'plus']" />
            </button>
            <!-- deposits -->
            <button
              v-tooltip="{ content: 'Deposits', trigger: 'hover' }"
              :class="[
                'btn btn-sm btn-light text-muted',
                { active: action === 'deposits' },
              ]"
              @click="changeAction('deposits')"
            >
              <font-awesome-icon :icon="['fas', 'coins']" />
            </button>
            <!-- pull requests -->
            <button
              v-tooltip="{ content: 'Pull Requests', trigger: 'hover' }"
              :class="[
                'btn btn-sm btn-light text-muted',
                { active: action === 'pull-requests' },
              ]"
              @click="changeAction('pull-requests')"
            >
              <span v-html="$octicons['git-pull-request'].toSVG()"></span>
            </button>
            <!-- github -->
            <a
              v-tooltip="{ content: 'Open on GitHub', trigger: 'hover' }"
              class="btn btn-sm btn-light text-muted"
              :href="
                'https://github.com/' +
                issueNode.owner +
                '/' +
                issueNode.repository +
                '/issues/' +
                issueNode.number
              "
              target="_blank"
            >
              <font-awesome-icon :icon="['fab', 'github']" />
              <font-awesome-icon
                :icon="['fas', 'external-link-alt']"
                class="text-muted-light ml-1"
              />
            </a>
            <button
              v-if="canWithdrawIssue"
              v-tooltip="{ content: 'Claim', trigger: 'hover' }"
              class="btn btn-sm btn-primary shadow-sm"
              @click="claimIssue()"
            >
              <font-awesome-icon :icon="['fas', 'hand-holding-usd']" />
            </button>
          </div>
          <!-- details content -->
          <div class="w-100 px-3">
            <transition name="fade" mode="out-in">
              <!-- deposits -->
              <div v-if="action === 'deposits'" key="deposits" class="py-3">
                <div
                  v-for="(deposit, index) in issue.deposits"
                  :key="index"
                  class="d-flex mb-2 justify-content-between align-items-center"
                >
                  <div class="d-flex flex-column">
                    <h5 class="mb-0">
                      {{ Number($web3utils.fromWei(deposit.amount, 'ether')) }}
                      <small>ETH</small>
                    </h5>
                    <small class="text-muted">
                      <GithubUser :from-address="deposit.from" />
                    </small>
                  </div>
                  <button
                    v-if="deposit.from === account"
                    class="btn btn-primary shadow-sm"
                    :disabled="refundingDeposit"
                    @click="refundIssueDeposit(deposit.id)"
                  >
                    <font-awesome-icon
                      v-if="refundingDeposit === deposit.id"
                      :icon="['fas', 'circle-notch']"
                      spin
                    />
                    <span v-else>withdraw</span>
                  </button>
                </div>
              </div>
              <!-- pull requests -->
              <div
                v-if="action === 'pull-requests'"
                key="pull-requests"
                class="py-3"
              >
                <a
                  :href="`https://github.com/${issueNode.owner}/${issueNode.repository}/fork`"
                  class="btn btn-sm btn-dark btn-block"
                >
                  <span v-html="$octicons['repo-forked'].toSVG()"></span>
                  start working
                </a>
                <div v-if="linkedPullRequests.length">
                  <a
                    v-for="pullRequest in sortedLinkedPullRequests"
                    :key="pullRequest.id"
                    :href="pullRequest.url"
                    target="_blank"
                    class="btn btn-light btn-sm btn-block mt-2 d-flex align-items-center border-light"
                  >
                    <svg
                      style="width: 19px; height: 19px"
                      viewBox="0 0 24 24"
                      :class="
                        'text-' +
                        (pullRequest.state == 'MERGED'
                          ? 'merged'
                          : pullRequest.state == 'CLOSED'
                          ? 'danger'
                          : 'success')
                      "
                    >
                      <path
                        fill="currentColor"
                        d="M6,3A3,3 0 0,1 9,6C9,7.31 8.17,8.42 7,8.83V15.17C8.17,15.58 9,16.69 9,18A3,3 0 0,1 6,21A3,3 0 0,1 3,18C3,16.69 3.83,15.58 5,15.17V8.83C3.83,8.42 3,7.31 3,6A3,3 0 0,1 6,3M6,5A1,1 0 0,0 5,6A1,1 0 0,0 6,7A1,1 0 0,0 7,6A1,1 0 0,0 6,5M6,17A1,1 0 0,0 5,18A1,1 0 0,0 6,19A1,1 0 0,0 7,18A1,1 0 0,0 6,17M21,18A3,3 0 0,1 18,21A3,3 0 0,1 15,18C15,16.69 15.83,15.58 17,15.17V7H15V10.25L10.75,6L15,1.75V5H17A2,2 0 0,1 19,7V15.17C20.17,15.58 21,16.69 21,18M18,17A1,1 0 0,0 17,18A1,1 0 0,0 18,19A1,1 0 0,0 19,18A1,1 0 0,0 18,17Z"
                      />
                    </svg>
                    <span class="mr-auto ml-2 pr-2 text-truncate">{{
                      pullRequest.title
                    }}</span>
                    <span
                      v-if="pullRequest.autoMergeRequest"
                      v-tooltip="{
                        trigger: 'hover',
                        content: 'AutoMerge enabled',
                      }"
                      class="badge badge-light mr-2 rounded-xl"
                    >
                      <font-awesome-icon
                        :icon="['fas', 'check']"
                        class="text-success"
                      />
                      <font-awesome-icon
                        :icon="['fas', 'angle-double-right']"
                      />
                    </span>
                    {{ pullRequest.comments.totalCount }}
                    <font-awesome-icon
                      :icon="['far', 'comment-alt']"
                      class="ml-1 mr-2 text-muted"
                    />
                  </a>
                </div>
                <small v-else class="text-muted d-block text-center mt-2">
                  No linked pull requests yet.
                </small>
                <small class="d-block text-center">
                  <a
                    href="https://docs.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword"
                    target="_blank"
                  >
                    What does that mean?
                  </a>
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
      v-else-if="!loading && !issueNode"
      class="d-flex justify-content-center p-3 rounded-lg"
    >
      <small class="text-muted d-block text-center border rounded-xl px-3 py-1">
        <small
          ><font-awesome-icon :icon="['fas', 'exclamation-triangle']"
        /></small>
        Issue not found.
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
    issue: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      issueNode: null,
      showDetails: false,
      action: null,
      refundingDeposit: false,
      isRepoAdmin: false,
      linkedPullRequests: [],
      loading: false,
      canWithdrawIssue: false,
    }
  },
  computed: {
    ...mapGetters(['account', 'githubUser', 'githubAccessToken']),
    sortedLinkedPullRequests() {
      return this.linkedPullRequests
        .filter((pr) => pr)
        .sort((a) => (a.state === 'MERGED' ? -1 : 1))
    },
  },
  watch: {
    showDetails(show) {
      if (show) {
        if (this.githubUser) {
          this.$github
            .isRepoAdmin(
              this.githubUser.login,
              this.issueNode.owner,
              this.issueNode.repository
            )
            .then((isRepoAdmin) => (this.isRepoAdmin = isRepoAdmin))
            .catch(() => (this.isRepoAdmin = false))
        } else {
          this.isRepoAdmin = false
        }

        this.linkedPullRequests = []
        this.$axios
          .$get(
            `${process.env.API_URL}/github/linked-pullrequests/${this.issueNode.id}`
          )
          .then((activePullRequestIds) => {
            activePullRequestIds.forEach((prId) => {
              this.$github.getPullRequestById(prId).then((pr) => {
                this.linkedPullRequests.push(pr)
              })
            })
          })
          .catch(() => (this.linkedPullRequests = []))
      }
    },
  },
  mounted() {
    this.loading = true
    this.$github
      .getIssueById(this.issue.id)
      .then((issue) => {
        if (issue) {
          this.issueNode = {
            id: issue.id,
            number: issue.number,
            title: issue.title,
            owner: issue.repository.owner.login,
            repository: issue.repository.name,
            repositoryOwner: issue.repository.owner.login,
            primaryLanguage: issue.repository.primaryLanguage,
            labels: issue.labels.edges.map((label) => label.node),
            closed: issue.closed,
          }
          if (this.githubUser) {
            this.$axios
              .$get(
                process.env.API_URL +
                  `/github/can-withdraw-from-issue/${this.githubUser.node_id}/${this.issueNode.id}`
              )
              .then((can) => {
                this.canWithdrawIssue = can
              })
          } else {
            this.canWithdrawIssue = false
          }
        }
      })
      .finally(() => (this.loading = false))
  },
  methods: {
    fundIssue() {
      this.$store.commit('setRedirectPrefills', {
        type: 'send-issue',
        username: this.issueNode.owner,
        repository: this.issueNode.repository,
        issue: this.issueNode.number,
        amount: '1.0',
      })
      this.$store.commit('setView', 'send')
    },
    claimIssue() {
      this.$store.commit('setRedirectPrefills', {
        type: 'claim-issue',
        url:
          'https://github.com/' +
          this.issueNode.owner +
          '/' +
          this.issueNode.repository +
          '/issues/' +
          this.issueNode.number,
      })
      this.$store.commit('setView', 'claim')
    },
    changeAction(action) {
      if (this.action === action) {
        this.action = null
      } else {
        this.action = action
      }
    },
    refundIssueDeposit(id) {
      this.refundingDeposit = id
      this.octobay.methods
        .refundIssueDeposit(id)
        .send({ from: this.account })
        .then(() => {
          this.$store.commit('removeDeposit', {
            issueId: this.issue.id,
            depositId: id,
          })
        })
        .catch((e) => console.log(e))
        .finally(() => (this.refundingDeposit = false))
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
