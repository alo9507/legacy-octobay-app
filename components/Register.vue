<template>
  <div class="p-3">
    <div v-if="showRegistrationSuccess" class="alert alert-success border-0">
      <button
        type="button"
        class="close text-success"
        @click="showRegistrationSuccess = false"
      >
        <span>&times;</span>
      </button>
      <font-awesome-icon :icon="['far', 'smile']" />
      Registration successfull! :)<br />
      <small>
        You can now delete the repository again and start claiming funds.
      </small>
    </div>
    <div v-if="connected">
      <div v-if="githubUser">
        <h5 class="text-center text-muted-light py-2 px-4">
          Create a repository with your address as its name.
        </h5>
        <div
          v-clipboard="account"
          v-clipboard:success="copiedAddress"
          class="d-flex justify-content-between align-items-center btn btn-light mt-3"
        >
          <transition name="fade" mode="out-in"
            >>
            <font-awesome-icon
              v-if="copyAddressSuccess"
              key="check"
              :icon="['fas', 'check']"
              class="text-success"
            />
            <font-awesome-icon v-else key="copy" :icon="['far', 'copy']" />
          </transition>
          <i class="my-auto">
            <AddressShort :address="account" length="medium"
          /></i>
          <i></i>
        </div>
        <a
          href="https://github.com/new"
          target="_blank"
          class="d-flex justify-content-between align-items-center btn btn-dark btn-block mt-2"
        >
          <font-awesome-icon :icon="['fab', 'github']" />
          Create Repository
          <i></i>
        </a>
        <div class="text-center my-2">
          <button
            class="btn btn-outline-primary btn-sm font-weight-bold px-3"
            @click="showIssueInput = !showIssueInput"
          >
            Want to withdraw a deposit?
            <small
              ><font-awesome-icon
                :icon="['fas', showIssueInput ? 'times' : 'chevron-down']"
                style="opacity: 0.5"
            /></small>
          </button>
        </div>
        <transition name="fade">
          <div v-if="showIssueInput">
            <div class="input-with-embed">
              <input
                v-model="issueUrl"
                type="text"
                class="form-control form-control-lg form-control-with-embed mb-2 pr-5"
                placeholder="Issue URL"
              />
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
              <div v-if="loadingIssue || issue">
                <div v-if="loadingIssue" class="text-center mb-2">
                  <font-awesome-icon
                    :icon="['fas', 'circle-notch']"
                    spin
                    class="text-muted-light"
                  />
                </div>
                <IssueEmbed v-if="issue" :issue="issue" />
              </div>
            </div>
          </div>
        </transition>
        <button
          class="btn btn-lg btn-primary shadow-sm d-block w-100 mt-3"
          :disabled="loadingRegistration || checkingRepo"
          @click="register()"
        >
          <font-awesome-icon
            v-if="loadingRegistration || checkingRepo"
            :icon="['fas', 'circle-notch']"
            spin
          />
          {{
            loadingRegistration
              ? 'Waiting for confirmation...'
              : checkingRepo
              ? 'Waiting for repository'
              : issue && showIssueInput
              ? 'Register & Withdraw'
              : 'Register'
          }}
        </button>
      </div>
      <a
        v-else
        :href="
          'https://github.com/login/oauth/authorize?scope=user:email&client_id=' +
          githubClientId
        "
        class="btn btn-lg btn-dark shadow-sm d-block mt-4"
      >
        <font-awesome-icon :icon="['fab', 'github']" />
        Connect
      </a>
    </div>
    <button
      v-else-if="$web3"
      class="btn btn-lg btn-primary shadow-sm d-block w-100 mt-4"
      @click="connect()"
    >
      Connect Wallet
    </button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { addressRepoExists } from '@octobay/adapters'
import connect from '@/mixins/connect'
import helpers from '@/mixins/helpers'

export default {
  mixins: [connect, helpers],
  data() {
    return {
      githubClientId: process.env.GITHUB_CLIENT_ID,
      loadingRegistration: false,
      showRegistrationSuccess: false,
      copyAddressSuccess: false,
      checkingRepo: true,
      repoExists: false,
      checkRepoInterval: null,
      registerRequestID: null,
      showIssueInput: false,
      issueUrl: '',
      issue: null,
      loadingIssue: false,
      loadIssueTimeout: null,
    }
  },
  computed: {
    ...mapGetters([
      'connected',
      'account',
      'registeredAccount',
      'oracles',
      'activeOracle',
    ]),
    ...mapGetters('github', {
      githubUser: 'user',
      githubAccessToken: 'accessToken',
    }),
  },
  watch: {
    issueUrl(url) {
      clearTimeout(this.loadIssueTimeout)
      this.loadIssueTimeout = setTimeout(() => {
        const parts = url.match(
          /^https:\/\/github\.com\/([\w-]+)\/([\w-]+)\/issues\/(\d+)$/
        )
        if (parts) {
          const owner = parts[1]
          const repo = parts[2]
          const number = parts[3]
          this.loadingIssue = true
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
            .finally(() => (this.loadingIssue = false))
        } else {
          this.issue = null
          this.loadingIssue = false
        }
      }, 500)
    },
  },
  mounted() {
    this.checkRepo()
    this.checkRepoInterval = setInterval(() => this.checkRepo(), 10000)
  },
  methods: {
    checkRepo() {
      if (this.connected && this.githubUser) {
        addressRepoExists(
          this.githubUser.login,
          this.account,
          this.githubAccessToken
        )
          .then((exists) => {
            this.repoExists = exists
            if (this.repoExists) {
              this.checkingRepo = false
              clearInterval(this.checkRepoInterval)
            }
          })
          .catch((e) => {
            this.repoExists = false
          })
      }
    },
    register() {
      this.loadingRegistration = true
      // listening for request confirmation
      const confirmListener = this.$octoBay.events
        .ChainlinkFulfilled()
        .on('data', (event) => {
          if (event.returnValues.id === this.registerRequestID) {
            // stop listening and finish process
            confirmListener.unsubscribe()
            this.$store.commit('setRegisteredAccount', this.account)
            this.showRegistrationSuccess = true
            this.loadingRegistration = false
            this.registerRequestID = null
          }
        })

      this.$octoBay.methods
        .registerUserAddress(
          this.nextOracle().ethAddress,
          this.githubUser.node_id
        )
        .send({
          // useGSN: false,
          from: this.account,
        })
        .then((registerRequest) => {
          this.registerRequestID =
            registerRequest.events.ChainlinkRequested.returnValues.id
        })
        .catch(() => (this.loadingRegistration = false))
    },
    copiedAddress() {
      this.copyAddressSuccess = true
      setTimeout(() => {
        this.copyAddressSuccess = false
      }, 1000)
    },
  },
}
</script>
