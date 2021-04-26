<template>
  <div class="header my-3 p-3">
    <transition name="fade" mode="out-in">
      <div v-if="connected && githubUser" :class="cssClasses">
        <a
          :href="githubUser.html_url"
          target="_blank"
          class="rounded-circle avatar mr-1 shadow-sm"
          :style="'background-image: url(' + githubUser.avatar_url + ')'"
        ></a>
        <div class="d-flex ml-1">
          <div
            class="d-flex align-items-center bg-white pl-1 pr-5 rounded-xl border-light"
            style="margin-right: -55px"
          >
            <button
              class="btn btn-sm btn-primary shadow-sm mr-2"
              @click="showWallet()"
            >
              <font-awesome-icon :icon="['fas', 'wallet']" />
            </button>
            <div class="pr-3 d-flex flex-column align-items-end">
              <small><AddressShort :address="account" /></small>
              <small>
                <sup class="text-nowrap">
                  {{
                    networkId === 1
                      ? 'Mainnet'
                      : networkId === 3
                      ? 'Ropsten'
                      : networkId === 4
                      ? 'Rinkeby'
                      : networkId === 42
                      ? 'Kovan'
                      : 'Unknown Testnet'
                  }}
                </sup>
              </small>
            </div>
          </div>
          <div
            class="d-flex align-items-center bg-secondary text-white px-3 py-1 rounded-xl text-nowrap font-weight-bold"
          >
            {{ formattedBalance }}
            <font-awesome-icon :icon="['fab', 'ethereum']" class="ml-2" />
          </div>
        </div>
      </div>

      <div v-else-if="connected" :class="cssClasses">
        <Logo
          color="white"
          class="mr-2"
          size="md"
          style="background-color: #652fff; border-radius: 50%"
        />
        <a :href="githubAuthUrl" class="ml-2 btn btn-lg btn-light shadow-sm">
          Connect GitHub
        </a>
      </div>

      <div v-else :class="cssClasses">
        <a
          v-if="githubUser"
          :href="githubUser.html_url"
          target="_blank"
          class="rounded-circle avatar mr-1 shadow-sm"
          :style="'background-image: url(' + githubUser.avatar_url + ')'"
        ></a>
        <Logo
          v-else
          color="white"
          class="mr-2"
          size="md"
          style="background-color: #652fff; border-radius: 50%"
        />
        <span
          v-if="!connected"
          key="disconnected"
          class="d-flex align-items-center"
        >
          <button
            v-if="$web3"
            class="ml-2 btn btn-lg btn-light shadow-sm"
            @click="connect()"
          >
            Connect Wallet
          </button>
          <a
            v-else
            href="https://metamask.io"
            target="_blank"
            class="ml-2 btn btn-lg btn-light shadow-sm"
          >
            Install MetaMask
          </a>
        </span>
      </div>
    </transition>
    <div
      v-if="!$web3"
      class="alert alert-info border-0 my-3"
      style="max-width: 330px"
    >
      You need an Ethereum compatible browser to use this service.
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import connect from '@/mixins/connect'

export default {
  mixins: [connect],
  data() {
    return {
      cssClasses: 'd-flex justify-content-between align-items-top text-muted',
    }
  },
  computed: {
    ...mapGetters(['connected', 'account', 'balance', 'networkId']),
    ...mapGetters('github', { githubUser: 'user', githubAuthUrl: 'authUrl' }),
    formattedBalance() {
      return Number(
        this.$web3.utils.fromWei(this.balance.toString(), 'ether')
      ).toFixed(2)
    },
  },
  methods: {
    showWallet() {
      this.$store.commit('setModalData', null)
      this.$store.commit('setModalComponent', 'ModalWallet')
      this.$store.commit('setShowModal', true)
    },
  },
}
</script>

<style lang="sass">
.avatar
  display: block
  width: 40px
  height: 40px
  background-repeat: no-repeat
  background-position: center center
  background-size: 100%
</style>
