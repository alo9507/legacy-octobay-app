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
        This issue has not been closed by your pull request and was not released
        to you manually.
      </div>

      <ConnectActionButton
        :action="withdrawFromIssue"
        :disabled="
          withdrawingFromIssue || !issue || !githubUser || !canWithdrawIssue
        "
        size="lg"
        class="mt-4"
      >
        <font-awesome-icon
          v-if="withdrawingFromIssue"
          :icon="['fas', 'circle-notch']"
          spin
        />
        {{ withdrawingFromIssue ? 'Waiting for confirmation...' : 'Claim' }}
      </ConnectActionButton>
    </div>
    <div v-if="userDeposits.length" class="card-body border-top mt-2 pt-2">
      <h5 class="text-center text-muted-light py-2 px-4 mt-2">
        Claim funds sent to your GitHub account.
      </h5>
      <div
        v-for="(deposit, index) in userDeposits"
        :key="index"
        class="d-flex justify-content-between align-items-center mt-2"
      >
        <small class="text-muted">
          <GithubUser :from-address="deposit.from" :force-show-address="true" />
        </small>
        <div class="d-flex flex-column mb-0 ml-auto mr-2 text-right">
          <b>{{ $web3.utils.fromWei(deposit.amount, 'ether') }}</b>
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
      withdrawingFromIssue: false,
      showWithdrawalSuccess: false,
      userDeposits: [],
      withdrawingUserDeposit: 0,
      canWithdrawIssue: null,
    }
  },
  computed: {
    ...mapGetters(['account', 'oracles', 'redirectPrefills']),
    ...mapGetters('github', {
      githubUser: 'user',
      githubAccessToken: 'accessToken',
    }),
  },
  watch: {
    githubUser() {
      this.updateUserDeposits()
    },
    redirectPrefills() {
      if (
        this.redirectPrefills &&
        this.redirectPrefills.type === 'claim-issue'
      ) {
        this.url = this.redirectPrefills.url
      }
    },
    url(newUrl, oldUrl) {
      this.issue = null
      // TODO: use regex here
      if (newUrl.includes('https://github.com')) {
        const urlParts = newUrl.split('/')
        const number = Number(urlParts.pop())
        urlParts.pop()
        const repo = urlParts.pop()
        const owner = urlParts.pop()
        if (newUrl.includes('/issues/') && number) {
          this.loadingIssue = true
          this.canWithdrawIssue = null
          this.loadIssue(owner, repo, number)
            .then((issue) => {
              this.issue = issue
              this.$axios
                .$get(
                  process.env.API_URL +
                    `/github/can-withdraw-from-issue/${this.githubUser.node_id}/${this.issue.id}`
                )
                .then((can) => {
                  this.canWithdrawIssue = can
                })
            })
            .finally(() => (this.loadingIssue = false))
        }
      }
    },
  },
  mounted() {
    this.updateUserDeposits()
    if (this.redirectPrefills && this.redirectPrefills.type === 'claim-issue') {
      this.url = this.redirectPrefills.url
    }
  },
  methods: {
    withdrawFromIssue() {
      this.withdrawingFromIssue = true
      this.$octobay.methods
        .withdrawIssueDeposit(this.oracles[0].ethAddress, this.issue.id)
        .send({
          // useGSN: false,
          from: this.account,
        })
        .then(() => {
          this.$store.commit('removeIssue', this.issue.id)
          this.withdrawingFromIssue = false
          this.showWithdrawalSuccess = true
          this.issue = null
          this.url = ''
          this.canWithdrawIssue = false
        })
        .catch((e) => console.log(e))
    },
    withdrawUserDeposit(id) {
      this.withdrawingUserDeposit = id
      this.$octobay.methods
        .withdrawUserDeposit(id)
        .send({
          // useGSN: false,
          from: this.account,
        })
        .then(() => {
          setTimeout(() => this.updateUserDeposits(), 1000)
          this.$web3.eth
            .getBalance(this.account)
            .then((balance) => this.$store.commit('setBalance', balance))
        })
        .catch((e) => console.log(e))
        .finally(() => (this.withdrawingUserDeposit = 0))
    },
    updateUserDeposits() {
      if (this.githubUser) {
        this.$axios
          .$get(process.env.API_URL + '/graph/user/' + this.githubUser.node_id)
          .then((user) => {
            if (user) {
              this.userDeposits = user.deposits
            }
          })
      }
    },
  },
}
</script>
