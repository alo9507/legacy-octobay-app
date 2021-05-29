<template>
  <div class="header d-flex align-items-center my-3 p-3">
    <div class="mr-2">
      <GithubAvatar
        v-if="githubUser"
        :profile-url="githubUser.html_url"
        :avatar-url="githubUser.avatar_url"
        size="2.5em"
      />
    </div>
    <transition name="fade" mode="out-in">
      <div v-if="connected && githubUser" :class="cssClasses">
        <div class="d-flex">
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
                  {{ networkName(networkId) }}
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
      <div v-else :class="cssClasses">
        <ConnectActionButton :required="['wallet', 'github']" size="lg" />
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
