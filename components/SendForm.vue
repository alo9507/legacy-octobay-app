<template>
  <div class="card-body" style="max-width: 360px">
    <div v-if="accountsUserDeposits.length" class="border-bottom mb-4 pb-2">
      <small class="text-muted d-block text-center border-bottom pb-2 mb-2"
        >Pending withdrawals:</small
      >
      <div
        v-for="(deposit, index) in accountsUserDeposits"
        :key="index"
        class="d-flex justify-content-between align-items-center"
      >
        <div class="d-flex flex-column">
          <h4 class="mb-0">
            {{
              Number($web3.utils.fromWei(deposit.amount, 'ether')).toFixed(2)
            }}
            <small>ETH</small>
          </h4>
          <small class="text-muted">
            &gt;
            <a
              :href="'https://github.com/' + deposit.githubUser"
              target="_blank"
            >
              {{ deposit.githubUser }}
            </a>
          </small>
        </div>
        <button
          class="btn btn-primary shadow-sm"
          :disabled="refundingUserDeposit != 0"
          @click="refundUserDeposit(deposit.id)"
        >
          <font-awesome-icon
            v-if="refundingUserDeposit === deposit.id"
            :icon="['fas', 'circle-notch']"
            spin
          />
          {{ refundingUserDeposit === deposit.id ? '' : 'cancel' }}
        </button>
      </div>
    </div>
    <div v-if="showSendSuccess" class="alert alert-success border-0">
      <button
        type="button"
        class="close text-success"
        @click="showSendSuccess = false"
      >
        <span>&times;</span>
      </button>
      <CheckIcon />
      Transfer confirmed! :)
    </div>
    <div v-if="showIssueDepositSuccess" class="alert alert-success border-0">
      <button
        type="button"
        class="close text-success"
        @click="showIssueDepositSuccess = false"
      >
        <span>&times;</span>
      </button>
      <CheckIcon />
      Issue deposit confirmed! :)
    </div>
    <div
      v-if="selectedRecipientType == 'User'"
      class="input-with-embed select-input select-input-left"
    >
      <input
        v-model="username"
        type="text"
        class="form-control form-control-lg form-control-with-embed mb-2"
        style="padding-right: 5rem"
        placeholder="Username"
      />
      <span
        class="btn btn-primary shadow-sm"
        style="width: 95px"
        @click="$store.commit('setShowRecipientTypeList', true)"
      >
        <span>User</span>
        <small
          ><font-awesome-icon
            :icon="['fas', 'chevron-down']"
            style="opacity: 0.5"
        /></small>
      </span>
      <a
        v-if="user"
        href="#"
        class="position-absolute text-muted-light"
        style="top: 12px; right: 50px; z-index: 2"
        @click="
          user = null
          username = ''
        "
      >
        <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
          />
        </svg>
      </a>
      <div v-if="loading || user">
        <div v-if="loading" class="text-center mb-2">
          <font-awesome-icon
            :icon="['fas', 'circle-notch']"
            spin
            class="text-muted-light"
          />
        </div>
        <UserEmbed
          v-if="user"
          :user="user"
          :address="userEthAddress"
          class="mb-2"
        />
      </div>
    </div>
    <div
      v-if="selectedRecipientType == 'Issue'"
      class="input-with-embed select-input select-input-left"
    >
      <input
        v-model="issueUrl"
        type="text"
        class="form-control form-control-lg form-control-with-embed mb-2 pr-5"
        placeholder="Issue URL"
      />
      <span
        class="btn btn-primary shadow-sm"
        style="width: 95px"
        @click="$store.commit('setShowRecipientTypeList', true)"
      >
        <span>Issue</span>
        <small
          ><font-awesome-icon
            :icon="['fas', 'chevron-down']"
            style="opacity: 0.5"
        /></small>
      </span>
      <a
        v-if="issue"
        href="#"
        class="position-absolute text-muted-light"
        style="top: 12px; right: 10px; z-index: 2"
        @click="
          issue = null
          issueUrl = ''
        "
      >
        <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
          />
        </svg>
      </a>
      <div v-if="loading || issue">
        <div v-if="loading" class="text-center mb-2">
          <font-awesome-icon
            :icon="['fas', 'circle-notch']"
            spin
            class="text-muted-light"
          />
        </div>
        <IssueEmbed v-if="issue" :issue="issue" />
        <div
          v-if="issue"
          class="border rounded-xl mt-3 px-3 pt-2"
          style="margin-bottom: -48px; padding-bottom: 52px"
        >
          <small class="d-block font-weight-bold text-muted text-center"
            >Available repository funds:</small
          >
          <div class="d-flex justify-content-between mb-1">
            <span>
              <img
                :src="'./eth-logo.png'"
                width="18"
                height="18"
                class="rounded-circle"
              />
              ETH
            </span>
            <span>
              <span v-if="selectedToken == null">{{
                (5.31 - amount).toFixed(3)
              }}</span>
              <span v-else>5.31</span>
              <button
                class="btn btn-sm btn-primary shadow-sm"
                @click="
                  $store.commit('setSelectedToken', null)
                  amount = 5.31
                "
              >
                use
              </button>
            </span>
          </div>
          <div class="d-flex justify-content-between mb-1">
            <span>
              <img
                src="https://assets.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png?1547034700"
                width="18"
                height="18"
                class="rounded-circle"
              />
              LINK
            </span>
            <span>
              <span v-if="selectedToken && selectedToken.symbol == 'LINK'">{{
                (28.46 - amount).toFixed(3)
              }}</span>
              <span v-else>28.46</span>
              <button
                class="btn btn-sm btn-primary shadow-sm"
                @click="
                  $store.commit('setSelectedToken', token('LINK'))
                  amount = 28.46
                "
              >
                use
              </button>
            </span>
          </div>
          <div v-if="departments.length" class="border-top mt-2 py-2">
            <small class="text-muted">
              Mint governance token for contributor.
            </small>
            <select
              v-model="departmentForIssue"
              class="custom-select rounded-xl"
            >
              <option :value="null">No Governance Minting</option>
              <option
                v-for="department in departments"
                :key="department.id"
                :value="department"
              >
                {{ department.name }} ({{ department.symbol }})
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="selectedRecipientType == 'Project'"
      class="input-with-embed select-input select-input-left"
    >
      <input
        v-model="repositoryUrl"
        type="text"
        class="form-control form-control-lg form-control-with-embed mb-2 pr-5"
        placeholder="Repository URL"
      />
      <span
        class="btn btn-primary shadow-sm"
        style="width: 103px"
        @click="$store.commit('setShowRecipientTypeList', true)"
      >
        <span>Project</span>
        <small
          ><font-awesome-icon
            :icon="['fas', 'chevron-down']"
            style="opacity: 0.5"
        /></small>
      </span>
      <a
        v-if="repository"
        href="#"
        class="position-absolute text-muted-light"
        style="top: 12px; right: 10px; z-index: 2"
        @click="
          repository = null
          repositoryUrl = ''
        "
      >
        <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
          />
        </svg>
      </a>
      <div v-if="loading || repository">
        <div v-if="loading" class="text-center mb-2">
          <font-awesome-icon
            :icon="['fas', 'circle-notch']"
            spin
            class="text-muted-light"
          />
        </div>
        <RepositoryEmbed v-if="repository" :repository="repository" />
      </div>
    </div>
    <div class="select-input mb-2">
      <input
        v-model="amount"
        type="number"
        min="0"
        step="0.01"
        novalidate
        class="form-control form-control-lg mb-2"
        placeholder="0.00"
      />
      <span
        class="btn btn-primary shadow-sm"
        @click="$store.commit('setShowTokenList', true)"
      >
        <span v-if="selectedToken">{{ selectedToken.symbol }}</span>
        <span v-else>ETH</span>
        <small
          ><font-awesome-icon
            :icon="['fas', 'chevron-down']"
            style="opacity: 0.5"
        /></small>
      </span>
    </div>
    <div>
      <div class="text-center">
        <button
          class="btn btn-outline-primary btn-sm font-weight-bold px-3"
          @click="showSchedule = !showSchedule"
        >
          schedule
          <small
            ><font-awesome-icon
              :icon="['fas', showSchedule ? 'times' : 'chevron-down']"
              style="opacity: 0.5"
          /></small>
        </button>
      </div>
      <transition name="fade">
        <div v-if="showSchedule">
          <div class="d-flex align-items-center mt-2">
            <div class="select-input w-50">
              <input
                v-model="releaseInstallments"
                type="number"
                min="1"
                step="1"
                novalidate
                class="form-control form-control-lg"
                placeholder="0"
              />
              <span
                v-if="releaseInstallments > 1"
                class="btn btn-primary shadow-sm"
                @click="$store.commit('setShowIntervalSelect', true)"
              >
                <span>{{ selectedInterval }}</span>
                <small
                  ><font-awesome-icon
                    :icon="['fas', 'chevron-down']"
                    style="opacity: 0.5"
                /></small>
              </span>
              <span v-else class="btn btn-primary disabled">
                <span>payment</span>
              </span>
            </div>
            <div
              class="text-nowrap ml-2 d-flex flex-fill flex-column align-items-center border rounded-xl"
            >
              <div class="font-weight-bold">
                {{ amountPerInstallment.toFixed(3) }}
                <span v-if="selectedToken">{{ selectedToken.symbol }}</span>
                <span v-else>ETH</span>
              </div>
              <small class="text-muted" style="margin-top: -5px">
                {{ releaseInstallments > 1 ? 'each' : 'once' }}
              </small>
            </div>
          </div>
          <small
            v-if="selectedRecipientType == 'Issue'"
            class="mt-2 px-2 d-flex text-muted text-center"
          >
            Schedule starts once the project maintainer released the issue
            deposits.
          </small>
          <div v-else class="mt-2">
            <div class="select-input">
              <input
                type="text"
                readonly
                novalidate
                class="form-control form-control-lg border bg-white"
                placeholder="0"
                :value="formattedReleaseDate"
              />
              <span
                class="btn btn-primary shadow-sm"
                @click="showDatepicker = !showDatepicker"
              >
                <small
                  ><font-awesome-icon :icon="['far', 'calendar-alt']"
                /></small>
              </span>
            </div>
            <transition name="fade">
              <datepicker
                v-if="showDatepicker"
                v-model="releaseDate"
                class="mt-2"
                maximum-view="month"
                :inline="true"
                :disabled-dates="{ to: minReleaseDate }"
                @selected="showDatepicker = false"
              ></datepicker>
            </transition>
          </div>
        </div>
      </transition>
    </div>
    <button
      v-if="connected"
      class="btn btn-lg btn-primary shadow-sm d-block w-100 mt-4"
      :disabled="confirmDisabled"
      @click="confirm()"
    >
      <font-awesome-icon v-if="sending" :icon="['fas', 'circle-notch']" spin />
      {{ sending ? 'Waiting for confirmation...' : 'Confirm' }}
    </button>
    <button
      v-else-if="$web3"
      class="btn btn-lg btn-primary shadow-sm d-block w-100 mt-4"
      @click="connect()"
    >
      Connect
    </button>
    <TokenList
      :select="tokenListSelectCallback"
      :show="showTokenList"
      :hide="tokenListHideCallback"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import connect from '@/mixins/connect'
import loadFromGithub from '@/mixins/loadFromGithub'
import helpers from '@/mixins/helpers'
import Datepicker from 'vuejs-datepicker'

export default {
  components: { Datepicker },
  mixins: [connect, loadFromGithub, helpers],
  data() {
    return {
      username: '',
      user: null,
      userEthAddress: null,
      issueUrl: '',
      issue: null,
      repositoryUrl: '',
      repository: null,
      loading: false,
      amount: 0,
      sending: false,
      showSendSuccess: false,
      showIssueDepositSuccess: false,
      loadRecipientTimeout: null,
      accountsUserDeposits: [],
      refundingUserDeposit: 0,
      releaseInstallments: 1,
      showSchedule: false,
      releaseDate: new Date(),
      showDatepicker: false,
      departmentForIssue: null,
    }
  },
  computed: {
    ...mapGetters([
      'connected',
      'account',
      'selectedToken',
      'selectedRecipientType',
      'selectedInterval',
      'showTokenList',
      'tokenList',
      'redirectPrefills',
      'departments',
    ]),
    amountPerInstallment() {
      if (this.releaseInstallments) {
        return this.amount / this.releaseInstallments
      }
      return this.amount
    },
    minReleaseDate() {
      const date = new Date()
      return new Date(date.setDate(date.getDate() - 1))
    },
    formattedReleaseDate() {
      const prefix = this.releaseInstallments > 1 ? 'Starts: ' : 'Date: '
      const date =
        this.daysBetween(new Date(), this.releaseDate) === 0
          ? 'now'
          : this.$moment(this.releaseDate).format('MMM. Do YYYY')
      return prefix + date
    },
    confirmDisabled() {
      if (!this.sending && this.amount > 0) {
        if (this.selectedRecipientType === 'User' && this.user) {
          return false
        }
        if (this.selectedRecipientType === 'Issue' && this.issue) {
          return false
        }
        if (this.selectedRecipientType === 'Project' && this.repository) {
          return false
        }
      }
      return true
    },
  },
  watch: {
    account() {
      this.updateUserDeposits()
    },
    redirectPrefills() {
      if (this.redirectPrefills) {
        if (this.redirectPrefills.type === 'send-user') {
          this.$store.commit('setSelectedRecipientType', 'User')
          this.username = this.redirectPrefills.username
          this.amount = this.redirectPrefills.amount
        } else if (this.redirectPrefills.type === 'send-repository') {
          this.$store.commit('setSelectedRecipientType', 'Project')
          this.repositoryUrl = `https://github.com/${this.redirectPrefills.username}/${this.redirectPrefills.repository}`
          this.amount = this.redirectPrefills.amount
        } else if (this.redirectPrefills.type === 'send-issue') {
          this.$store.commit('setSelectedRecipientType', 'Issue')
          this.issueUrl = `https://github.com/${this.redirectPrefills.username}/${this.redirectPrefills.repository}/issues/${this.redirectPrefills.issue}`
          this.amount = this.redirectPrefills.amount
        }
      }
    },
    username(username) {
      clearTimeout(this.loadRecipientTimeout)
      this.loadRecipientTimeout = setTimeout(() => {
        if (username.match(/^[\w-]+$/)) {
          this.loading = true
          this.user = null
          this.loadUser(username)
            .then((user) => {
              this.user = user
              // TODO: fetch info from subgraph
            })
            .catch(() => {
              this.user = null
              this.userEthAddress = null
            })
            .finally(() => (this.loading = false))
        } else {
          this.user = null
          this.userEthAddress = null
          this.loading = false
        }
      }, 500)
    },
    issueUrl(url) {
      clearTimeout(this.loadRecipientTimeout)
      this.loadRecipientTimeout = setTimeout(() => {
        const parts = url.match(
          /^https:\/\/github\.com\/([\w-]+)\/([\w-]+)\/issues\/(\d+)$/
        )
        if (parts) {
          const owner = parts[1]
          const repo = parts[2]
          const number = parts[3]
          this.loading = true
          this.issue = null
          this.$axios
            .$get(
              `${process.env.API_URL}/github/issue/${owner}/${repo}/${number}`
            )
            .then((issue) => {
              this.issue = issue
            })
            .catch(() => {
              this.issue = null
            })
            .finally(() => (this.loading = false))
        } else {
          this.issue = null
          this.loading = false
        }
      }, 500)
    },
    repositoryUrl(url) {
      clearTimeout(this.loadRecipientTimeout)
      this.loadRecipientTimeout = setTimeout(() => {
        const parts = url.match(/^https:\/\/github\.com\/([\w-]+)\/([\w-]+)$/)
        if (parts) {
          const owner = parts[1]
          const repo = parts[2]
          this.loading = true
          this.repository = null
          this.$axios
            .$get(`${process.env.API_URL}/github/repository/${owner}/${repo}`)
            .then((repository) => {
              this.repository = repository
            })
            .catch(() => {
              this.repository = null
            })
            .finally(() => (this.loading = false))
        } else {
          this.repository = null
          this.loading = false
        }
      }, 500)
    },
  },
  mounted() {
    if (this.redirectPrefills) {
      if (this.redirectPrefills.type === 'send-user') {
        this.$store.commit('setSelectedRecipientType', 'User')
        this.username = this.redirectPrefills.username
        this.amount = this.redirectPrefills.amount
      } else if (this.redirectPrefills.type === 'send-repository') {
        this.$store.commit('setSelectedRecipientType', 'Project')
        this.repositoryUrl = `https://github.com/${this.redirectPrefills.username}/${this.redirectPrefills.repository}`
        this.amount = this.redirectPrefills.amount
      } else if (this.redirectPrefills.type === 'send-issue') {
        this.$store.commit('setSelectedRecipientType', 'Issue')
        this.issueUrl = `https://github.com/${this.redirectPrefills.username}/${this.redirectPrefills.repository}/issues/${this.redirectPrefills.issue}`
        this.amount = this.redirectPrefills.amount
      }
    }
    this.updateUserDeposits()
  },
  methods: {
    tokenListSelectCallback(token) {
      this.$store.commit('setSelectedToken', token)
    },
    tokenListHideCallback() {
      this.$store.commit('setShowTokenList', false)
    },
    confirm() {
      if (this.selectedRecipientType === 'User') {
        this.depositForUser()
      } else if (this.selectedRecipientType === 'Issue') {
        this.depositForIssue()
      }
    },
    depositForUser() {
      this.sending = true
      this.$octoBay.methods
        .depositEthForGithubUser(this.user.login.toLowerCase())
        .send({
          // useGSN: false,
          from: this.account,
          value: this.$web3.utils.toWei(this.amount, 'ether'),
        })
        .then((result) => {
          this.amount = 0
          this.showSendSuccess = true
          this.updateUserDeposits()
          this.$store.dispatch('updateOvtBalance')
          this.$web3.eth
            .getBalance(this.account)
            .then((balance) => this.$store.commit('setBalance', balance))
        })
        .catch((e) => {
          console.log(e)
        })
        .finally(() => {
          this.loading = false
          this.sending = false
        })
    },
    depositForIssue() {
      this.sending = true
      if (this.departmentForIssue) {
        this.$octoBay.methods
          .depositAndSetGovTokenForIssue(
            this.issue.id,
            this.departmentForIssue.tokenAddress,
            this.departmentForIssue.projectId
          )
          .send({
            // useGSN: false,
            from: this.account,
            value: this.$web3.utils.toWei(this.amount, 'ether'),
          })
          .then((tx) => {
            this.$store.dispatch('updateIssues')
            this.$store.dispatch('updateOvtBalance')
            this.$web3.eth
              .getBalance(this.account)
              .then((balance) => this.$store.commit('setBalance', balance))
            this.sending = false
            this.showIssueDepositSuccess = true
            this.amount = 0
          })
      } else {
        this.$octoBay.methods
          .depositEthForIssue(this.issue.id)
          .send({
            // useGSN: false,
            from: this.account,
            value: this.$web3.utils.toWei(this.amount, 'ether'),
          })
          .then((tx) => {
            this.$store.dispatch('updateIssues')
            this.$store.dispatch('updateOvtBalance')
            this.$web3.eth
              .getBalance(this.account)
              .then((balance) => this.$store.commit('setBalance', balance))
            this.sending = false
            this.showIssueDepositSuccess = true
            this.amount = 0
          })
      }
    },
    updateUserDeposits() {
      const accountsDeposits = []
      if (this.$octoBay) {
        this.$octoBay.methods
          .getUserDepositIdsForSender()
          .call({ from: this.account })
          .then((ids) => {
            ids.forEach((id) => {
              this.$octoBay.methods
                .userDeposits(id)
                .call()
                .then((deposit) => {
                  if (Number(deposit.amount)) {
                    deposit.id = id
                    accountsDeposits.push(deposit)
                  }
                })
            })
          })
      }
      this.accountsUserDeposits = accountsDeposits
    },
    refundUserDeposit(id) {
      this.refundingUserDeposit = id
      this.$octoBay.methods
        .refundUserDeposit(id)
        .send({
          // useGSN: false,
          from: this.account,
        })
        .then(() => {
          this.updateUserDeposits()
          this.$store.dispatch('updateOvtBalance')
          this.$web3.eth
            .getBalance(this.account)
            .then((balance) => this.$store.commit('setBalance', balance))
        })
        .catch((e) => console.log(e))
        .finally(() => (this.refundingUserDeposit = 0))
    },
    token(symbol) {
      return this.tokenList.tokens.find((token) => token.symbol === symbol)
    },
  },
}
</script>

<style lang="sass">
.vdp-datepicker
  .vdp-datepicker__calendar
    width: 100%
    border: none
    header
      .up,
      .prev,
      .next
        border-radius: 2rem
        text-indent: 0
      .prev::after,
      .next::after
        border: none
    .day:not(.blank):not(.disabled),
    .month:not(.blank):not(.disabled)
      border-radius: 2rem
      &:hover
        border-color: #0366d6 !important
      &.selected
        background: #0366d6
        color: #fff
        &:hover
          background: #0366d6
</style>
