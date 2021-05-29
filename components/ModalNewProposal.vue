<template>
  <div class="card shadow-sm d-flex flex-column" @click.stop>
    <div v-if="!success">
      <div class="card-body modal-body flex-fill">
        <h5 class="text-center text-muted-light py-3 px-4 m-0">New Proposal</h5>
        <div>
          <b>Link to Discussion on GitHub</b>
          <input
            v-model="discussionUrl"
            type="text"
            class="form-control form-control-lg form-control-with-embed mb-2"
            placeholder="https://github.com/..."
          />
          <DiscussionEmbed v-if="discussion" :discussion="discussion" />
        </div>
        <div>
          <small>Governance Department</small>
          <select v-model="proposalDepartment" class="custom-select rounded-xl">
            <option :value="null">Select department</option>
            <option
              v-for="department in ownDepartments"
              :key="department.address"
              :value="department"
            >
              {{ department.name }}
            </option>
          </select>
        </div>
        <div v-if="proposalDepartment">
          <small>Quorum</small>
          <input
            v-model="quorum"
            type="number"
            :min="proposalDepartment.minQuorum / 100"
            max="100"
            class="form-control"
          />
        </div>
        <div v-if="proposalDepartment" class="mt-2">
          <div class="d-flex align-items-end">
            <div class="mr-1">
              <small class="d-flex">Start Date</small>
              <input
                v-model="startDate"
                type="date"
                class="form-control mb-2"
                placeholder="Mar 29th 2021"
              />
            </div>
            <div class="ml-1">
              <small class="d-flex">End Date</small>
              <input
                v-model="endDate"
                type="date"
                class="form-control mb-2"
                placeholder="Apr 29th 2021"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="card-body pt-0">
        <button
          class="btn btn-lg btn-primary w-100 shadow-sm"
          :disabled="waitingForTransaction || !proposalDepartment"
          @click="createNewProposal()"
        >
          <font-awesome-icon
            v-if="waitingForTransaction"
            :icon="['fas', 'circle-notch']"
            spin
          />
          Create Proposal
        </button>
      </div>
    </div>
    <div v-else class="alert alert-success mb-0">
      <font-awesome-icon :icon="['fas', 'check']" />
      Proposal created successfully! :)
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import helpers from '@/mixins/helpers'

export default {
  mixins: [helpers],
  data() {
    return {
      success: false,
      proposalDepartment: null,
      discussionUrl: '',
      discussion: null,
      startDate: null,
      endDate: null,
      quorum: null,
      loadingDiscussion: false,
      loadDiscussionTimeout: null,
      waitingForTransaction: false,
    }
  },
  computed: {
    ...mapGetters(['ownDepartments', 'selectedDepartment', 'account']),
  },
  watch: {
    discussionUrl(url) {
      clearTimeout(this.loadDiscussionTimeout)
      this.loadDiscussionTimeout = setTimeout(() => {
        const discussionParts = url.match(
          /^https:\/\/github\.com\/([\w-]+)\/([\w-]+)\/discussions\/(\d+)$/
        )
        if (discussionParts) {
          const owner = discussionParts[1]
          const repo = discussionParts[2]
          const number = discussionParts[3]
          this.loadingDiscussion = true
          this.discussion = null
          this.$github
            .getDiscussionByOwnerRepoNumber(owner, repo, Number(number))
            .then((discussion) => {
              this.discussion = discussion
            })
            .catch(() => {
              this.discussion = null
            })
            .finally(() => (this.loadingDiscussion = false))
        } else {
          this.discussion = null
          this.loadingDiscussion = false
        }
      }, 500)
    },
  },
  mounted() {
    this.proposalDepartment = this.selectedDepartment
  },
  methods: {
    createNewProposal() {
      const projectId = this.discussion.repository.id
      const discussionId = this.discussion.id
      const startDate = new Date(this.startDate).getTime() / 1000
      const endDate = new Date(this.endDate).getTime() / 1000
      const quorum = Number(this.quorum) * 100

      this.waitingForTransaction = true
      this.octobayGovernor.methods
        .createProposal(
          this.proposalDepartment.tokenAddress,
          projectId,
          discussionId,
          startDate,
          endDate,
          quorum
        )
        .send({ from: this.account })
        .then(() => {
          this.success = true
          setTimeout(() => {
            this.$store.dispatch('updateDepartments').then(() => {
              this.discussionUrl = ''
              this.discussion = null
              this.startDate = null
              this.endDate = null
              this.quorum = null
              this.waitingForTransaction = false
              setTimeout(() => {
                this.closeModal()
              }, 1000)
            })
          }, 3000)
        })
    },
  },
}
</script>
