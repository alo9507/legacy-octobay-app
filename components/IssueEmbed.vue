<template>
  <div class="border rounded-xl px-3 pb-3 mb-2" style="margin-top: -56px; padding-top: 56px;">
    <div class="d-flex">
      <span :class="'d-flex align-items-center align-self-start badge badge-pill pl-1 mr-1 badge-' + (issue.closed ? 'danger' : 'success')">
        <InfoIcon width="16px" height="16px" class="mr-1" />
        {{ issue.closed ? 'closed' : 'open' }}
      </span>
      <a :href="issue.url" target="_blank" class="text-truncate text-dark" :title="issue.title">
        <b>{{ issue.title }}</b>
      </a>
      <small class="text-muted ml-auto pl-1 text-nowrap">
        <font-awesome-icon :icon="['far', 'comment-alt']" />
        {{ issue.comments.totalCount }}
        #{{ issue.number }}
      </small>
    </div>
    <span class="d-flex justify-content-between text-muted mt-1">
      <small>
        created
        {{ issue.createdAt | moment("MMM Do YYYY") }}
        <span class="text-dark">by</span>
        <a :href="issue.author.url" target="_blank" class="text-muted">
          <b>{{ githubUser && githubUser.login === issue.author.login ? 'you' : issue.author.login }}</b>
        </a>
      </small>
      <span class="font-weight-bold" v-if="amount">
        {{ $web3.utils.fromWei(amount.toString(), 'ether') }} ETH
      </span>
    </span>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  props: ['issue'],
  data() {
    return {
      amount: 0
    }
  },
  computed: {
    ...mapGetters("github", { githubUser: 'user' }),
  },
  mounted() {
    this.$octoBay.methods.issueDepositsAmountByIssueId(this.issue.id).call().then(amount => this.amount = amount)
  }
}
</script>
