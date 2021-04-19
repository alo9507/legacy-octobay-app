<template>
  <div class="card-body">
    <div v-if="showClaimSuccess" class="alert alert-success border-0">
      <button
        type="button"
        class="close text-success"
        @click="showClaimSuccess = false"
      >
        <span>&times;</span>
      </button>
      <font-awesome-icon :icon="['far', 'smile']" />
      Claim successful!
    </div>
    <div v-if="showClaimError" class="alert alert-danger border-0">
      <button
        type="button"
        class="close text-danger"
        @click="showClaimError = false"
      >
        <span>&times;</span>
      </button>
      <font-awesome-icon :icon="['far', 'frown']" />
      Claim failed!<br />
      <small>
        Please make sure your pull request is valid. It must be for a repository
        you don't have administrative rights for and merged not longer than
        {{ maxClaimPrAge }} days ago. If you did, the problem might be on our
        side. Please let us know on
        <a href="https://twitter.com/OctoBayApp" target="_blank">Twitter</a> or
        <a href="https://discord.gg/DhKgHrFeCD" target="_blank">Discord</a>.
      </small>
    </div>
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
    <div v-if="connected">
      <div v-if="registeredAccount === account">
        <small class="text-muted d-flex justify-content-between">
          Pull Request or Issue URL
          <HelpIcon
            v-tooltip="
              'Paste the URL of a an issue or a related merged pull request to withdraw a bounty.'
            "
            width="18px"
            height="18px"
            class="mb-1 help-icon"
          />
        </small>
        <input
          v-model="url"
          type="text"
          class="form-control form-control-lg form-control-with-embed mb-2"
          placeholder="https://github.com/..."
        />
        <font-awesome-icon
          v-if="loadingContribution"
          :icon="['fas', 'circle-notch']"
          spin
          class="text-muted-light"
        />
        <PullRequestEmbed
          v-else-if="contribution && type == 'pr'"
          :contribution="contribution"
        />
        <IssueEmbed
          v-else-if="contribution && type == 'issue'"
          :issue="contribution"
        />

        <div v-if="contribution && type == 'pr'">
          <div
            v-if="
              githubUser &&
              contribution.repository.owner.login === githubUser.login
            "
            class="alert alert-warning border-0 mt-2 mb-2"
          >
            <font-awesome-icon :icon="['fas', 'info-circle']" />
            <small>
              You can only claim pull requests for repositories that are not
              your own.
            </small>
          </div>
          <div
            v-if="githubUser && contribution.author.login !== githubUser.login"
            class="alert alert-warning border-0 mt-2 mb-2"
          >
            <font-awesome-icon :icon="['fas', 'info-circle']" />
            <small> This pull request does not belong to you. </small>
          </div>
          <div
            v-if="githubUser && !contribution.merged"
            class="alert alert-warning border-0 mt-2 mb-2"
          >
            <font-awesome-icon :icon="['fas', 'info-circle']" />
            <small> This pull request is not merged yet. </small>
          </div>
          <div
            v-if="githubUser && getAge(contribution.mergedAt) > maxClaimPrAge"
            class="alert alert-warning border-0 mt-2 mb-2"
          >
            <font-awesome-icon :icon="['fas', 'info-circle']" />
            <small>
              Only pull request merged inside the last {{ maxClaimPrAge }} days
              can be claimed.
            </small>
          </div>
          <div class="text-center">
            <small class="text-muted">Score:</small>
            <h3>{{ score }}</h3>
          </div>
        </div>

        <div v-if="contribution && type == 'issue'">
          <div
            v-if="!canWithdrawIssue"
            class="alert alert-warning border-0 mb-2 mt-3"
          >
            <small>
              In order to withdraw from this issue, it must have been closed by
              one of your pull requests or explicitly released to you by the
              maintainer.
            </small>
          </div>
        </div>

        <button
          v-if="type === 'issue'"
          class="btn btn-lg btn-primary shadow-sm d-block w-100 mt-4"
          :disabled="
            withdrawingFromIssue ||
            !contribution ||
            !githubUser ||
            !canWithdrawIssue
          "
          @click="withdrawFromIssue()"
        >
          <font-awesome-icon
            v-if="withdrawingFromIssue"
            :icon="['fas', 'circle-notch']"
            spin
          />
          {{ withdrawingFromIssue ? 'Waiting for confirmation...' : 'Claim' }}
        </button>
        <button
          v-if="type === 'pr'"
          class="btn btn-lg btn-primary shadow-sm d-block w-100 mt-4"
          :disabled="
            claimingPullRequest ||
            !contribution ||
            !contribution.merged ||
            !githubUser ||
            contribution.author.login !== githubUser.login ||
            getAge(contribution.mergedAt) > maxClaimPrAge ||
            contribution.repository.owner.login === githubUser.login
          "
          @click="claimPullRequest()"
        >
          <font-awesome-icon
            v-if="claimingPullRequest"
            :icon="['fas', 'circle-notch']"
            spin
          />
          {{ claimingPullRequest ? 'Waiting for confirmation...' : 'Claim' }}
        </button>

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
    </div>
    <button
      v-else-if="$web3"
      class="btn btn-lg btn-primary shadow-sm d-block w-100 mt-4"
      @click="connect()"
    >
      Connect
    </button>
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
      maxClaimPrAge: process.env.MAX_CLAIMPR_AGE,
      url: '',
      type: null,
      loadingContribution: false,
      contribution: null,
      score: 0,
      withdrawingFromIssue: false,
      showWithdrawalSuccess: false,
      userDeposits: [],
      withdrawingUserDeposit: 0,
      claimingPullRequest: false,
      showClaimSuccess: false,
      showClaimError: false,
      canWithdrawIssue: false,
      claimRequestID: null,
    }
  },
  computed: {
    ...mapGetters([
      'connected',
      'account',
      'registeredAccount',
      'oracles',
      'redirectPrefills',
    ]),
    ...mapGetters('github', {
      githubUser: 'user',
      githubAccessToken: 'accessToken',
    }),
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
    url(newUrl, oldUrl) {
      this.contribution = null
      // TODO: use regex here
      if (newUrl.includes('https://github.com')) {
        const urlParts = newUrl.split('/')
        const number = Number(urlParts.pop())
        urlParts.pop()
        const repo = urlParts.pop()
        const owner = urlParts.pop()
        if (newUrl.includes('/pull/') && number) {
          this.type = 'pr'
          this.loadingContribution = true
          this.loadPullRequest(owner, repo, number, this.githubAccessToken)
            .then((pr) => {
              this.contribution = pr
              this.score = this.calculatePRScore(pr)
            })
            .finally(() => (this.loadingContribution = false))
        } else if (newUrl.includes('/issues/') && number) {
          this.type = 'issue'
          this.loadingContribution = true
          this.canWithdrawIssue = false
          this.loadIssue(owner, repo, number)
            .then((issue) => {
              this.contribution = issue
              this.$axios
                .$get(
                  process.env.API_URL +
                    `/github/can-withdraw-from-issue/${this.githubUser.node_id}/${this.contribution.id}`
                )
                .then((can) => {
                  this.canWithdrawIssue = can
                })
            })
            .finally(() => (this.loadingContribution = false))
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
    claimPullRequest() {
      this.claimingPullRequest = true
      // start listening for request event
      const confirmListener = this.$octoBay.events
        .ChainlinkFulfilled()
        .on('data', (event) => {
          if (event.returnValues.id === this.claimRequestID) {
            // stop listening and finish process
            confirmListener.unsubscribe()
            this.$store.dispatch('updateOvtBalance')
            this.$web3.eth
              .getBalance(this.account)
              .then((balance) => this.$store.commit('setBalance', balance))
            this.showClaimSuccess = true
            this.claimingPullRequest = false
            this.url = ''
            this.contribution = null
            this.claimRequestID = null
          }
        })

      // trigger claim (get gas price first)
      this.$octoBay.methods
        .claimPullRequest(
          this.oracles[0].ethAddress,
          this.contribution.id,
          this.githubUser.login
        )
        .send({
          // useGSN: false,
          from: this.account,
        })
        .then((claimRequest) => {
          this.claimRequestID =
            claimRequest.events.ChainlinkRequested.returnValues.id
        })
        .catch(() => (this.claimingPullRequest = false))
    },
    withdrawFromIssue() {
      this.withdrawingFromIssue = true
      this.$octoBay.methods
        .withdrawIssueDeposit(this.oracles[0].ethAddress, this.contribution.id)
        .send({
          // useGSN: false,
          from: this.account,
        })
        .then(() => {
          this.$store.commit('removeIssue', this.contribution.id)
          this.withdrawingFromIssue = false
          this.showWithdrawalSuccess = true
          this.contribution = null
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
      const deposits = []
      if (this.githubUser) {
        this.$octoBay.methods
          .getUserDepositIdsForGithubUserId(this.githubUser.node_id)
          .call()
          .then((ids) => {
            ids.forEach((id) => {
              this.$octoBay.methods
                .userDeposits(id)
                .call()
                .then((deposit) => {
                  if (Number(deposit.amount)) {
                    deposit.id = id
                    deposits.push(deposit)
                  }
                })
            })
          })
      }
      this.userDeposits = deposits
    },
    formatAmount(amount) {
      return Number(
        this.$web3.utils.fromWei(amount.toString(), 'ether')
      ).toFixed(2)
    },
  },
}
</script>
