<template>
  <div
    class="border rounded-xl px-3 pb-3 mb-2"
    style="margin-top: -56px; padding-top: 56px"
  >
    <div class="d-flex">
      <span
        :class="
          'd-flex align-items-center align-self-start badge badge-pill pl-1 mr-1 badge-' +
          (issue.closed ? 'danger' : 'success')
        "
      >
        <InfoIcon width="16px" height="16px" class="mr-1" />
        {{ issue.closed ? 'closed' : 'open' }}
      </span>
      <a
        :href="issue.url"
        target="_blank"
        class="text-truncate text-dark"
        :title="issue.title"
      >
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
        {{ issue.createdAt | moment('MMM Do YYYY') }}
        <span class="text-dark">by</span>
        <a :href="issue.author.url" target="_blank" class="text-muted">
          <b>{{
            githubUser && githubUser.login === issue.author.login
              ? 'you'
              : issue.author.login
          }}</b>
        </a>
      </small>
      <span v-if="amount" class="font-weight-bold">
        {{ Number($web3.utils.fromWei(amount.toString(), 'ether')).toFixed(2) }}
        ETH
      </span>
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
    ...mapGetters('github', { githubUser: 'user' }),
    amount() {
      return this.deposits.reduce(
        (amount, deposit) => BigInt(amount) + BigInt(deposit.amount),
        BigInt('0')
      )
    },
  },
  mounted() {
    this.$axios
      .$get(process.env.API_URL + '/graph/issue/' + this.issue.id)
      .then((issue) => {
        this.deposits = issue.deposits
      })
  },
}
</script>
