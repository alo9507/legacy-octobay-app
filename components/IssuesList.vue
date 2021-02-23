<template>
  <div>
    <div class="card-body pb-0">
      <div v-if="issuesLazy.length" class="issue-list">
        <Issue v-for="issue in issuesLazy" :key="issue.id" :issue="issue" />
      </div>
      <div v-else class="text-center text-muted my-3">
        Currently no pinned issues.
      </div>
    </div>
    <div v-if="issues.length > showIssuesNum" class="card-body p-0">
      <button
        class="btn btn-lg btn-light text-center btn-block"
        style="border-top-left-radius: 0; border-top-right-radius: 0"
        @click="showIssuesNum += 10"
      >
        more
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      showIssuesNum: 10,
    }
  },
  computed: {
    ...mapGetters(['issues']),
    issuesSorted() {
      return this.issues
        .filter(() => true)
        .sort((a, b) => {
          if (a.boostAmount === b.boostAmount) {
            return a.depositAmount < b.depositAmount
          } else {
            return a.boostAmount < b.boostAmount
          }
        })
    },
    issuesLazy() {
      return this.issuesSorted.slice(0, this.showIssuesNum)
    },
  },
  mounted() {
    this.$store.dispatch('updateIssues')
  },
}
</script>

<style lang="sass" scoped>
.issue-list
  margin: 0 -1.25rem
  > a
    border: solid 1px eee
    color: #333
    &:hover
      border-color: transparent
      background: #0366d6
      color: white
      .text-muted,
      .text-danger
        color: white !important
      .badge-pill
        background: white
        color: #0366d6
</style>
