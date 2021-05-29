<template>
  <div>
    <div class="card-body">
      <div v-if="showWithdrawalSuccess" class="alert alert-success border-0">
        <button
          type="button"
          class="close text-success"
          @click="showWithdrawalSuccess = false"
        >
          <span>&times;</span>
        </button>
        <font-awesome-icon :icon="['far', 'smile']" />
        Withdrawal successful!
      </div>
      <h5 class="text-center text-muted-light py-2 px-4">
        Paste the URL of an issue you worked on.
      </h5>
      <input
        v-model="url"
        type="text"
        class="form-control form-control-lg form-control-with-embed mb-2"
        placeholder="https://github.com/..."
      />
      <font-awesome-icon
        v-if="loadingIssue"
        :icon="['fas', 'circle-notch']"
        spin
        class="text-muted-light"
      />
      <IssueEmbed v-else-if="issue" :issue="issue" />

      <div
        v-if="issue && canWithdrawIssue === false"
        class="alert bg-secondary text-white text-center border-0 mb-2 mt-3"
      >
        This issue has not been closed by a pull request of yours and was not
        released to you manually.
      </div>
      <ConnectActionButton
        :action="withdrawFromIssue"
        :disabled="
          waitingForOracleRequest || !issue || !githubUser || !canWithdrawIssue
        "
        size="lg"
        class="mt-4"
      >
        <font-awesome-icon
          v-if="waitingForOracleRequest"
          :icon="['fas', 'circle-notch']"
          spin
        />
        {{ waitingForOracleRequest ? 'Waiting for confirmation...' : 'Claim' }}
      </ConnectActionButton>
    </div>
    <div
      v-if="githubUser && githubUser.incomingDeposits.length"
      class="card-body border-top mt-2 pt-2"
    >
      <h5 class="text-center text-muted-light py-2 px-4 mt-2">
        Claim funds sent to your GitHub account.
      </h5>
      <div
        v-for="(deposit, index) in githubUser.incomingDeposits"
        :key="index"
        class="d-flex justify-content-between align-items-center mt-2"
      >
        <small class="text-muted">
          <GithubUser :from-address="deposit.from" :force-show-address="true" />
        </small>
        <div class="d-flex flex-column mb-0 ml-auto mr-2 text-right">
          <b>{{ $web3utils.fromWei(deposit.amount, 'ether') }}</b>
          <sup class="pt-2">ETH</sup>
        </div>
        <ConnectActionButton
          :action="() => withdrawUserDeposit(deposit.id)"
          :disabled="withdrawingUserDeposit != 0"
          class="text-nowrap ml-1"
        >
          <font-awesome-icon
            v-if="withdrawingUserDeposit === deposit.id"
            :icon="['fas', 'circle-notch']"
            spin
          />
          {{ withdrawingUserDeposit === deposit.id ? '' : 'Claim' }}
        </ConnectActionButton>
      </div>
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
      url: '',
      loadingIssue: false,
      issue: null,
      score: 0,
      waitingForOracleRequest: false,
      waitingForOracleFulfillment: false,
      showWithdrawalSuccess: false,
      withdrawingUserDeposit: 0,
      canWithdrawIssue: null,
    }
  },
  computed: {
    ...mapGetters(['account', 'redirectPrefills', 'githubUser']),
  },
  watch: {
    redirectPrefills() {
      if (
        this.redirectPrefills &&
        this.redirectPrefills.type === 'claim-issue'
      ) {
        this.url = this.redirectPrefills.url
      }
    },
    url(url) {
      this.issue = null
      const parts = url.match(
        /^https:\/\/github\.com\/([\w-]+)\/([\w-]+)\/issues\/(\d+)$/
      )
      if (parts) {
        const owner = parts[1]
        const repo = parts[2]
        const number = parts[3]
        this.loadingIssue = true
        this.canWithdrawIssue = null
        this.$github
          .getIssueByOwnerRepoNumber(owner, repo, Number(number))
          .then((issue) => {
            this.issue = issue
            if (this.githubUser) {
              this.$axios
                .$get(
                  process.env.API_URL +
                    `/github/can-withdraw-from-issue/${this.githubUser.node_id}/${this.issue.id}`
                )
                .then((can) => {
                  this.canWithdrawIssue = can
                })
            } else {
              this.canWithdrawIssue = false
            }
          })
          .finally(() => (this.loadingIssue = false))
      }
    },
  },
  mounted() {
    this.$store.dispatch('updateGithubUser')
    if (this.redirectPrefills && this.redirectPrefills.type === 'claim-issue') {
      this.url = this.redirectPrefills.url
    }
  },
  methods: {
    withdrawFromIssue() {
      this.oracleRequest(
        this.octobay.methods.withdrawFromIssue,
        [this.issue.id],
        (state) => (this.waitingForOracleRequest = state),
        (state) => (this.waitingForOracleFulfillment = state)
      ).then(() => {
        this.$store.commit('removeIssue', this.issue.id)
        this.showWithdrawalSuccess = true
        this.issue = null
        this.url = ''
        this.canWithdrawIssue = false
      })
    },
    withdrawUserDeposit(id) {
      this.withdrawingUserDeposit = id
      this.octobay.methods
        .withdrawUserDeposit(id)
        .send({ from: this.account })
        .then(() => {
          // delayed subgraph calls to account for indexing delay
          // in other components too, needs better solution
          // https://dgraph.io/docs/graphql/subscriptions
          // wss://api.thegraph.com/subgraphs/name/octobay/octobay-dev
          setTimeout(() => this.$store.dispatch('updateGithubUser'), 1000)
          setTimeout(() => this.$store.dispatch('updateGithubUser'), 5000)
          this.$store.dispatch('updateEthBalance')
        })
        .catch((e) => console.log(e))
        .finally(() => (this.withdrawingUserDeposit = 0))
    },
  },
}
</script>
