<template>
  <div style="max-width: 360px">
    <div class="card-body">
      <h5 class="text-center text-muted-light py-2 px-4">
        Send funds to any<br />GitHub user or issue.
      </h5>
      <div v-if="showSendSuccess" class="alert alert-success border-0">
        <button
          type="button"
          class="close text-success"
          @click="showSendSuccess = false"
        >
          <span>&times;</span>
        </button>
        <font-awesome-icon :icon="['fas', 'check']" />
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
        <font-awesome-icon :icon="['fas', 'check']" />
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
          style="padding-right: 2.5rem"
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
          style="top: 12px; right: 12px; z-index: 2"
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
        <div v-if="loadingRecipient || user">
          <div v-if="loadingRecipient" class="text-center mb-2">
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
          style="width: 103px"
          @click="$store.commit('setShowRecipientTypeList', true)"
        >
          <span>Bounty</span>
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
        <div v-if="loadingRecipient || issue">
          <div v-if="loadingRecipient" class="text-center mb-2">
            <font-awesome-icon
              :icon="['fas', 'circle-notch']"
              spin
              class="text-muted-light"
            />
          </div>
          <IssueEmbed v-if="issue" :issue="issue" />
          <div
            v-if="issue && ownDepartments.length"
            class="border rounded-xl mt-3 px-3 pt-2"
            style="margin-bottom: -48px; padding-bottom: 60px"
          >
            <div class="text-muted d-block text-center mb-2">
              Which governance token shall be minted for the contributor?
            </div>
            <select
              v-model="departmentForIssue"
              class="custom-select rounded-xl"
            >
              <option :value="null">No Governance Minting</option>
              <option
                v-for="department in ownDepartments"
                :key="department.id"
                :value="department"
              >
                {{ department.name }} ({{ department.symbol }})
              </option>
            </select>
          </div>
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
        <span class="btn btn-light disabled">ETH</span>
      </div>
      <ConnectActionButton
        :action="confirm"
        :disabled="confirmDisabled"
        :required="['wallet']"
        size="lg"
        class="mt-4"
      >
        <font-awesome-icon
          v-if="sending"
          :icon="['fas', 'circle-notch']"
          spin
        />
        {{ sending ? 'Waiting for confirmation...' : 'Confirm' }}
      </ConnectActionButton>
    </div>
    <div
      v-if="outgoingUserDeposits.length"
      class="card-body mt-2 pt-2 border-top"
    >
      <h5 class="text-center text-muted-light py-2 px-4">Pending</h5>
      <div
        v-for="(deposit, index) in outgoingUserDeposits"
        :key="index"
        class="d-flex justify-content-between align-items-center mt-2"
      >
        <small class="text-muted">
          <GithubUser :github-user-id="deposit.user.id" />
        </small>
        <div class="d-flex flex-column mb-0 ml-auto mr-2 text-right">
          <b>{{ $web3utils.fromWei(deposit.amount, 'ether') }}</b>
          <sup class="pt-2">ETH</sup>
        </div>
        <button
          class="btn btn-primary shadow-sm text-nowrap ml-1"
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import helpers from '@/mixins/helpers'

export default {
  mixins: [helpers],
  data() {
    return {
      username: '',
      user: null,
      userEthAddress: null,
      issueUrl: '',
      issue: null,
      loadingRecipient: false,
      amount: 0,
      sending: false,
      showSendSuccess: false,
      showIssueDepositSuccess: false,
      loadRecipientTimeout: null,
      refundingUserDeposit: 0,
      departmentForIssue: null,
    }
  },
  computed: {
    ...mapGetters([
      'account',
      'selectedRecipientType',
      'redirectPrefills',
      'ownDepartments',
      'githubUser',
      'outgoingUserDeposits',
    ]),
    confirmDisabled() {
      if (!this.sending && this.amount > 0) {
        if (this.selectedRecipientType === 'User' && this.user) {
          return false
        }
        if (this.selectedRecipientType === 'Issue' && this.issue) {
          return false
        }
      }
      return true
    },
  },
  watch: {
    account() {
      this.$store.dispatch('updateOutgoingUserDeposits')
    },
    redirectPrefills() {
      if (this.redirectPrefills) {
        if (this.redirectPrefills.type === 'send-user') {
          this.$store.commit('setSelectedRecipientType', 'User')
          this.username = this.redirectPrefills.username
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
          this.loadingRecipient = true
          this.user = null
          this.$github
            .getUserByUsername(username)
            .then((user) => {
              this.user = user
              // TODO: fetch info from subgraph
            })
            .catch(() => {
              this.user = null
              this.userEthAddress = null
            })
            .finally(() => (this.loadingRecipient = false))
        } else {
          this.user = null
          this.userEthAddress = null
          this.loadingRecipient = false
        }
      }, 800)
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
          this.loadingRecipient = true
          this.issue = null
          this.$github
            .getIssueByOwnerRepoNumber(owner, repo, Number(number))
            .then((issue) => {
              this.issue = issue
            })
            .catch(() => {
              this.issue = null
            })
            .finally(() => (this.loadingRecipient = false))
        } else {
          this.issue = null
          this.loadingRecipient = false
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
      } else if (this.redirectPrefills.type === 'send-issue') {
        this.$store.commit('setSelectedRecipientType', 'Issue')
        this.issueUrl = `https://github.com/${this.redirectPrefills.username}/${this.redirectPrefills.repository}/issues/${this.redirectPrefills.issue}`
        this.amount = this.redirectPrefills.amount
      }
    }
    if (this.account) {
      this.$store.dispatch('updateOutgoingUserDeposits')
    }
  },
  methods: {
    confirm() {
      if (this.selectedRecipientType === 'User') {
        this.depositForUser()
      } else if (this.selectedRecipientType === 'Issue') {
        this.depositForIssue()
      }
    },
    depositForUser() {
      this.sending = true
      this.octobay.methods
        .depositEthForGithubUser(this.user.id)
        .send({
          from: this.account,
          value: this.$web3utils.toWei(this.amount, 'ether'),
        })
        .then(() => {
          this.amount = 0
          this.showSendSuccess = true
          setTimeout(
            () => this.$store.dispatch('updateOutgoingUserDeposits'),
            1000
          )
          this.$store.dispatch('updateEthBalance')
        })
        .catch((e) => {
          console.log(e)
        })
        .finally(() => {
          this.sending = false
        })
    },
    depositForIssue() {
      this.sending = true
      if (this.departmentForIssue) {
        this.octobay.methods
          .depositAndSetGovTokenForIssue(
            this.issue.id,
            this.departmentForIssue.tokenAddress,
            this.departmentForIssue.projectId
          )
          .send({
            from: this.account,
            value: this.$web3utils.toWei(this.amount, 'ether'),
          })
          .then(() => {
            this.$store.dispatch('updateIssues')
            this.$store.dispatch('updateEthBalance')
            this.sending = false
            this.showIssueDepositSuccess = true
            this.amount = 0
          })
          .catch((e) => {
            console.log(e)
          })
          .finally(() => {
            this.sending = false
          })
      } else {
        this.octobay.methods
          .depositEthForIssue(this.issue.id)
          .send({
            from: this.account,
            value: this.$web3utils.toWei(this.amount, 'ether'),
          })
          .then(() => {
            this.$store.dispatch('updateIssues')
            this.$store.dispatch('updateEthBalance')
            this.sending = false
            this.showIssueDepositSuccess = true
            this.amount = 0
          })
          .catch((e) => {
            console.log(e)
          })
          .finally(() => {
            this.sending = false
          })
      }
    },
    refundUserDeposit(id) {
      this.refundingUserDeposit = id
      this.octobay.methods
        .refundUserDeposit(id)
        .send({ from: this.account })
        .then(() => {
          this.$store.dispatch('updateEthBalance')
          setTimeout(
            () => this.$store.dispatch('updateOutgoingUserDeposits'),
            1000
          )
        })
        .catch((e) => console.log(e))
        .finally(() => (this.refundingUserDeposit = 0))
    },
  },
}
</script>
