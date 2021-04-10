<template>
  <div class="card shadow-sm d-flex flex-column" @click.stop>
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
        <b v-if="discussion">{{ discussion.discussion.title }}</b>
      </div>
      <div>
        <small>Governance Department</small>
        <input
          v-if="selectedDepartment"
          type="text"
          class="form-control"
          :value="selectedDepartment.name"
          readonly
        />
      </div>
      <div>
        <small>Quorum</small>
        <input
          v-if="selectedDepartment"
          v-model="quorum"
          type="number"
          :min="selectedDepartment.minQuorum / 100"
          max="100"
          class="form-control"
        />
      </div>
      <div class="mt-2">
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
        @click="createNewProposal()"
      >
        Create Proposal
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      loading: false,
      discussionUrl: null,
      discussion: null,
      startDate: null,
      endDate: null,
      quorum: null,
      loadingDiscussion: false,
      loadDiscussionTimeout: null,
    }
  },
  computed: {
    ...mapGetters(['oracles', 'selectedDepartment', 'account']),
    ...mapGetters('github', { githubUser: 'user' }),
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
          this.$axios
            .$get(
              `${process.env.API_URL}/github/discussion/${owner}/${repo}/${number}`
            )
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
  methods: {
    createNewProposal() {
      const projectId = this.discussion.owner.id
      const discussionId = this.discussion.discussion.id
      const startDate = new Date(this.startDate).getTime() / 1000
      const endDate = new Date(this.endDate).getTime() / 1000
      const quorum = Number(this.quorum) * 100

      this.$octobayGovernor.methods
        .createProposal(
          this.selectedDepartment.tokenAddress,
          projectId,
          discussionId,
          startDate,
          endDate,
          quorum
        )
        .send({ from: this.account })
        .then((result) => {})
    },
  },
}
</script>
