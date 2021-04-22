<template>
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
    <h5 class="text-center text-muted-light py-2 px-4 mt-2">
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
      v-if="issue && !canWithdrawIssue"
      class="alert alert-warning border-0 mb-2 mt-3"
    >
      <small>
        In order to withdraw from this issue, it must have been closed by one of
        your pull requests or explicitly released to you by the maintainer.
      </small>
    </div>

    <ConnectActionButton
      :action="withdrawFromIssue"
      :disabled="
        withdrawingFromIssue || !issue || !githubUser || !canWithdrawIssue
      "
      class="mt-4"
    >
      <font-awesome-icon
        v-if="withdrawingFromIssue"
        :icon="['fas', 'circle-notch']"
        spin
      />
      {{ withdrawingFromIssue ? 'Waiting for confirmation...' : 'Claim' }}
    </ConnectActionButton>

    <div v-if="userDeposits.length" class="border-top mt-3 pt-3">
      <div
        v-for="(deposit, index) in userDeposits"
        :key="index"
        class="d-flex justify-content-between align-items-center"
      >
        <div class="d-flex flex-column">
          <h4 class="mb-0">
            {{ $web3.utils.fromWei(deposit.amount, 'ether') }} ETH
          </h4>
          <small class="text-muted"> From: <a href="#">unknown</a> </small>
          <small class="text-muted" style="margin-top: -3px">
            <AddressShort :address="deposit.from" />
          </small>
        </div>
        <button
          class="btn btn-primary shadow-sm"
          :disabled="withdrawingUserDeposit != 0"
          @click="withdrawUserDeposit(deposit.id)"
        >
          <font-awesome-icon
            v-if="withdrawingUserDeposit === deposit.id"
            :icon="['fas', 'circle-notch']"
            spin
          />
          {{ withdrawingUserDeposit === deposit.id ? '' : 'Withdraw' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import connect from '@/mixins/connect'
import loadFromGithub from '@/mixins/loadFromGithub'

export default {
  mixins: [connect, loadFromGithub],
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
      canWithdrawIssue: false,
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
          this.canWithdrawIssue = false
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
    getAge(createdAt) {
      return (
        (new Date().getTime() - new Date(createdAt).getTime()) /
        (60 * 60 * 24 * 1000)
      )
    },
    calculatePRScore(pr) {
      const userAge = this.getAge(pr.author.createdAt)
      const userFollowers = pr.author.followers.totalCount
      const repoAge = this.getAge(pr.repository.createdAt)
      const repoStars = pr.repository.stargazers.totalCount
      const repoForks = pr.repository.forkCount

      let score = 0

      if (userAge > 365) score += 1
      if (userAge > 365 * 5) score += 2
      if (userAge > 365 * 10) score += 4

      if (userFollowers > 50) score += 1
      if (userFollowers > 250) score += 2
      if (userFollowers > 1000) score += 4

      if (repoAge > 90) score += 1
      if (repoAge > 365) score += 2
      if (repoAge > 365 * 5) score += 4

      if (repoStars > 50) score += 1
      if (repoStars > 250) score += 2
      if (repoStars > 1000) score += 4

      if (repoForks > 10) score += 1
      if (repoForks > 50) score += 2
      if (repoForks > 250) score += 4

      return Math.min(Math.round(Math.round((score / 35) * 100)), 100)
    },
    withdrawFromIssue() {
      this.withdrawingFromIssue = true
      this.$octoBay.methods
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
      this.$octoBay.methods
        .withdrawUserDeposit(id)
        .send({
          // useGSN: false,
          from: this.account,
        })
        .then(() => this.updateUserDeposits())
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
    formatAmount(amount) {
      return Number(
        this.$web3.utils.fromWei(amount.toString(), 'ether')
      ).toFixed(2)
    },
  },
}
</script>
