<template>
  <div class="card shadow-sm d-flex flex-column">
    <div class="card-body pt-0" @click.stop>
      <h5 class="text-center text-muted-light py-2 px-4 mt-4">Wallet</h5>
      <div v-if="success" class="alert alert-success mb-0">
        <font-awesome-icon :icon="['fas', 'check']" />
        Verification successful! :)
      </div>
      <div
        v-if="!registeredAccounts.length"
        class="alert bg-secondary text-white text-center"
      >
        To withdraw funds you need to fully verify your addresses.<br />
        <br />
        Create a repository on GitHub, named after the address you are connected
        with.
      </div>
      <div v-else class="mt-3">
        <small class="text-muted d-block text-center">Verified Addresses</small>
        <div v-for="regAccount in registeredAccounts" :key="regAccount.address">
          <div
            v-clipboard="regAccount.address"
            v-clipboard:success="() => copiedAddress(regAccount.address)"
            :class="
              'd-flex justify-content-between align-items-center btn mt-2 position-relative' +
              (regAccount.address === account
                ? ' btn-dark text-white'
                : ' btn-light')
            "
            style="z-index: 1"
          >
            <transition name="fade" mode="out-in">
              <font-awesome-icon
                v-if="copyAddressSuccess === regAccount.address"
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
          <div
            v-if="regAccount.address === account && nfts.length"
            class="border-light rounded-xl px-3 pb-3 position-relative"
            style="margin-top: -36px; padding-top: 32px; z-index: 0"
          >
            <transition name="fade">
              <div
                v-if="showTransferNFTsuccess"
                class="alert alert-success mt-3"
              >
                <font-awesome-icon :icon="['fas', 'check']" />
                Permission transferred.
              </div>
            </transition>
            <div v-for="nft in nfts" :key="nft.id" class="mt-3 pt-1">
              <b class="d-block text-center mb-2">
                <b>{{ nft.department.name }}</b>
              </b>
              <div class="d-flex justify-content-between align-items-center">
                <small>Manage Governance</small>
                <div>
                  <font-awesome-icon
                    v-if="nft.permissions.includes('MINT')"
                    :icon="['fas', 'check']"
                    class="text-success"
                  />
                  <font-awesome-icon
                    v-else
                    :icon="['fas', 'ban']"
                    class="text-danger"
                  />
                </div>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <small>Manage Bounties</small>
                <div>
                  <font-awesome-icon
                    v-if="nft.permissions.includes('SET_ISSUE_GOVTOKEN')"
                    :icon="['fas', 'check']"
                    class="text-success"
                  />
                  <font-awesome-icon
                    v-else
                    :icon="['fas', 'ban']"
                    class="text-danger"
                  />
                </div>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <small>Create Proposals</small>
                <div>
                  <font-awesome-icon
                    v-if="nft.permissions.includes('CREATE_PROPOSAL')"
                    :icon="['fas', 'check']"
                    class="text-success"
                  />
                  <font-awesome-icon
                    v-else
                    :icon="['fas', 'ban']"
                    class="text-danger"
                  />
                </div>
              </div>
              <div v-if="nft.permissions.includes('TRANSFER')" class="mt-2">
                <input
                  v-model="nftTransferAddress[nft.id]"
                  type="text"
                  class="form-control form-contro-sm"
                  placeholder="Address"
                />
                <button
                  class="btn btn-primary shadow-sm w-100 mt-2"
                  :disabled="
                    transferingNFT ||
                    !$web3.utils.isAddress(nftTransferAddress[nft.id])
                  "
                  @click="transferNft(nft, nftTransferAddress[nft.id])"
                >
                  <font-awesome-icon
                    v-if="transferingNFT == nft.id"
                    :icon="['fas', 'circle-notch']"
                    spin
                    class="text-muted-light"
                  />
                  {{
                    transferingNFT == nft.id
                      ? 'Waiting for confirmation...'
                      : 'Transfer Permission'
                  }}
                </button>
              </div>
            </div>
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
      <h5
        v-if="
          registeredAccounts.length &&
          !registeredAccounts.map((a) => a.address).includes(account)
        "
        class="text-muted-light text-center pt-2"
      >
        Verify Address
      </h5>
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
          <span>
            <font-awesome-icon :icon="['fas', 'check']" class="text-success" />
            Repository found
          </span>
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
          size="lg"
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
      copyAddressSuccess: null,
      checkingRepo: true,
      repoExists: false,
      checkRepoInterval: null,
      registerRequestID: null,
      nftTransferAddress: {},
      transferingNFT: null,
      showTransferNFTsuccess: false,
    }
  },
  computed: {
    ...mapGetters([
      'connected',
      'account',
      'registeredAccounts',
      'oracles',
      'activeOracle',
      'nfts',
    ]),
    ...mapGetters('github', {
      githubUser: 'user',
      githubAccessToken: 'accessToken',
      githubAuthUrl: 'authUrl',
    }),
  },
  watch: {
    account() {
      this.$store.dispatch('updateNFTs')
      this.checkRepo()
    },
  },
  mounted() {
    this.$store.dispatch('updateNFTs')
    this.checkRepo()
    this.checkRepoInterval = setInterval(() => this.checkRepo(), 10000)
  },
  methods: {
    checkRepo() {
      if (
        this.connected &&
        this.githubUser &&
        !this.registeredAccounts.map((a) => a.address).includes(this.account)
      ) {
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
      const confirmListener = this.$octobay.events
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

      this.$octobay.methods
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
    transferNft(nft, ethAddress) {
      this.transferingNFT = nft.id
      this.$octobayGovNFT.methods
        .safeTransferFrom(this.account, ethAddress, nft.id)
        .send({ from: this.account })
        .then(() => {
          this.showTransferNFTsuccess = true
          setTimeout(() => {
            this.$store.dispatch('updateNFTs').then(() => {
              this.transferingNFT = null
              setTimeout(() => (this.showTransferNFTsuccess = false), 3000)
            })
          }, 3000)
        })
        .catch(() => (this.transferingNFT = null))
    },
    copiedAddress(address) {
      this.copyAddressSuccess = address
      setTimeout(() => {
        this.copyAddressSuccess = null
      }, 1000)
    },
  },
}
</script>
