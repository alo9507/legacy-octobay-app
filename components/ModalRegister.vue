<template>
  <div class="card shadow-sm d-flex flex-column">
    <div class="card-body pt-0" @click.stop>
      <h5 class="text-center text-muted-light py-2 px-4 mt-4">Wallet</h5>
      <div v-if="success" class="alert alert-success mb-0">
        <CheckIcon />
        Registration successful! :)
      </div>
      <div v-if="!registeredAccounts.length" class="mt-3 mb-4 text-muted">
        <p>To withdraw funds you need to fully verify your addresses.</p>
        <p>
          Create a repository named after the Ethereum address you are connected
          with and register.
        </p>
      </div>
      <div v-else class="mt-3">
        <small class="text-muted d-block text-center"
          >Verified Addresses:</small
        >
        <div v-for="regAccount in registeredAccounts" :key="regAccount.address">
          <div
            v-clipboard="regAccount.address"
            v-clipboard:success="copiedAddress"
            class="d-flex justify-content-between align-items-center btn btn-light mt-1"
          >
            <transition name="fade" mode="out-in">
              <font-awesome-icon
                v-if="copyAddressSuccess"
                key="check"
                :icon="['fas', 'check']"
                class="text-success"
              />
              <font-awesome-icon v-else key="copy" :icon="['far', 'copy']" />
            </transition>
            <b class="my-auto">
              <AddressShort :address="regAccount.address" length="medium" />
            </b>
            <i
              v-if="regAccount.address === account"
              class="bg-success d-flex rounded-xl"
              style="width: 8px; height: 8px"
            ></i>
            <i v-else></i>
          </div>
        </div>
      </div>
      <div
        v-if="
          registeredAccounts.length &&
          !registeredAccounts.map((a) => a.address).includes(account)
        "
        class="mt-3 alert bg-secondary text-white text-center"
      >
        You are connected to an address that has not been verified for this
        GitHub account:
      </div>
      <div
        v-if="
          githubUser &&
          connected &&
          !registeredAccounts.map((a) => a.address).includes(account)
        "
        class="pb-2"
      >
        <div
          v-clipboard="account"
          v-clipboard:success="copiedAddress"
          class="d-flex justify-content-between align-items-center btn btn-light mt-3"
        >
          <transition name="fade" mode="out-in">
            <font-awesome-icon
              v-if="copyAddressSuccess"
              key="check"
              :icon="['fas', 'check']"
              class="text-success"
            />
            <font-awesome-icon v-else key="copy" :icon="['far', 'copy']" />
          </transition>
          <b class="my-auto"
            ><AddressShort :address="account" length="medium"
          /></b>
          <i></i>
        </div>
        <a
          v-if="repoExists"
          href="https://github.com/new"
          target="_blank"
          class="d-flex justify-content-between align-items-center btn btn-dark btn-block mt-2 mb-3"
        >
          <font-awesome-icon :icon="['fab', 'github']" />
          <span><CheckIcon class="text-success" /> Repository found</span>
          <i></i>
        </a>
        <a
          v-else
          href="https://github.com/new"
          target="_blank"
          class="d-flex justify-content-between align-items-center btn btn-dark btn-block mt-2 mb-3"
        >
          <font-awesome-icon :icon="['fab', 'github']" />
          Create Repository
          <i></i>
        </a>
        <ConnectActionButton
          :action="register"
          :disabled="loadingRegistration || checkingRepo"
          :required="['wallet', 'github']"
          class="mt-2"
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
              : 'Verify Address'
          }}
        </ConnectActionButton>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { addressRepoExists } from '@octobay/adapters'
import helpers from '@/mixins/helpers'

export default {
  mixins: [helpers],
  data() {
    return {
      success: false,
      loadingRegistration: false,
      copyAddressSuccess: false,
      checkingRepo: true,
      repoExists: false,
      checkRepoInterval: null,
      registerRequestID: null,
    }
  },
  computed: {
    ...mapGetters([
      'connected',
      'account',
      'registeredAccounts',
      'oracles',
      'activeOracle',
    ]),
    ...mapGetters('github', {
      githubUser: 'user',
      githubAccessToken: 'accessToken',
      githubAuthUrl: 'authUrl',
    }),
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
            setTimeout(() => {
              this.repoExists = exists
              if (this.repoExists) {
                this.checkingRepo = false
                clearInterval(this.checkRepoInterval)
              }
            }, 1000)
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
            // this.$store.commit('setRegisteredAccount', this.account)
            this.success = true
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
