<template>
  <div class="header my-3 p-3">
    <transition name="fade" mode="out-in">
      <div v-if="connected && githubUser" :class="cssClasses">
        <GithubAvatar
          :profile-url="githubUser.html_url"
          :avatar-url="githubUser.avatar_url"
          size="2.5em"
        />
        <div class="d-flex ml-1">
          <div
            class="d-flex align-items-center bg-white pl-1 pr-5 rounded-xl border-light"
            style="margin-right: -55px"
          >
            <button
              class="btn btn-sm btn-primary shadow-sm mr-2"
              @click="openModal('ModalWallet')"
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
        <GithubAvatar
          v-if="githubUser"
          :profile-url="githubUser.html_url"
          :avatar-url="githubUser.avatar_url"
          size="2.5em"
        />
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
            @click="$store.dispatch('web3connect')"
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import helpers from '@/mixins/helpers'

export default {
  mixins: [helpers],
  data() {
    return {
      cssClasses:
        'd-flex justify-content-between align-items-center text-muted',
    }
  },
  computed: {
    ...mapGetters([
      'connected',
      'account',
      'balance',
      'networkId',
      'githubUser',
      'githubAuthUrl',
    ]),
    formattedBalance() {
      return Number(
        this.$web3utils.fromWei(this.balance.toString(), 'ether')
      ).toFixed(2)
    },
  },
}
</script>
