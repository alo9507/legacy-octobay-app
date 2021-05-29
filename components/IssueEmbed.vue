<template>
  <div
    class="border rounded-xl px-2 pb-2 mb-2"
    style="margin-top: -56px; padding-top: 56px"
  >
    <a
      :href="issue.url"
      target="_blank"
      class="text-truncate d-block font-weight-bold text-dark mr-1 mb-1"
      :title="issue.title"
    >
      <svg
        viewBox="0 0 24 24"
        style="width: 16px; height: 16px"
        :class="'text-' + (issue.closed ? 'danger' : 'success')"
      >
        <path
          fill="currentColor"
          d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"
        />
      </svg>
      {{ issue.title }}
    </a>
    <span class="d-flex justify-content-between align-items-start">
      <small class="text-muted mr-2 d-flex align-items-center">
        {{ issue.createdAt | moment('MMM Do YYYY') }}
        by
        <a :href="issue.author.url" target="_blank" class="mx-1 text-muted">
          <b>{{
            githubUser && githubUser.login === issue.author.login
              ? 'you'
              : issue.author.login
          }}</b>
        </a>
        <font-awesome-icon :icon="['far', 'comment-alt']" class="mx-1" />
        {{ issue.comments.totalCount }}
      </small>
      <small
        v-if="amount"
        class="font-weight-bold text-nowrap bg-secondary text-white rounded-xl px-2 py-1"
      >
        {{ Number($web3utils.fromWei(amount.toString(), 'ether')).toFixed(2) }}
        ETH
      </small>
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    issue: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      deposits: [],
    }
  },
  computed: {
    ...mapGetters(['githubUser']),
    amount() {
      return this.deposits.reduce(
        (amount, deposit) => BigInt(amount) + BigInt(deposit.amount),
        BigInt('0')
      )
    },
  },
  mounted() {
    this.$subgraph.getIssue(this.issue.id).then((issue) => {
      if (issue) {
        this.deposits = issue.deposits
      }
    })
  },
}
</script>
