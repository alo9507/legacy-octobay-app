<template>
  <footer
    class="d-flex flex-column justify-content-end pt-5 px-5 pb-4 text-center mt-auto"
  >
    <div class="mb-3">
      <a
        href="https://twitter.com/OctoBayApp"
        target="_blank"
        class="text-white px-2"
      >
        <font-awesome-icon :icon="['fab', 'twitter']" />
      </a>
      <a
        href="https://discord.gg/DhKgHrFeCD"
        target="_blank"
        class="text-white px-2"
      >
        <font-awesome-icon :icon="['fab', 'discord']" />
      </a>
      <a
        href="https://github.com/octobay"
        target="_blank"
        class="text-white px-2"
      >
        <font-awesome-icon :icon="['fab', 'github']" />
      </a>
      <a
        :href="'https://kovan.etherscan.io/address/' + octoBayAddress"
        class="text-white px-2"
      >
        <font-awesome-icon :icon="['fab', 'ethereum']" />
      </a>
      <button
        class="align-items-center btn btn-link text-white btn-sm oracle-button"
        @click="$store.commit('setShowOracleList', true)"
      >
        <img
          :src="'./chainlink-icon.png'"
          width="36px"
          class="rounded-circle py-1 pl-1"
        />
        <small
          ><font-awesome-icon
            :icon="['fas', 'chevron-down']"
            style="opacity: 0.5"
        /></small>
      </button>
    </div>
    <div class="d-flex flex-column">
      <nuxt-link v-if="$route.name === 'index'" to="/gov" class="text-white">
        governance
      </nuxt-link>
      <nuxt-link v-if="$route.name === 'gov'" to="/" class="text-white">
        payments
      </nuxt-link>
      <a href="https://octobay.org" target="_blank" class="text-white">
        about
      </a>
    </div>
  </footer>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['activeOracle']),
    appName() {
      return process.env.APP_NAME
    },
    octoBayAddress() {
      return process.env.OCTOBAY_ADDRESS
    },
  },
}
</script>

<style lang="sass" scoped>
footer
  font-size: 1.9rem
  background-color: #652FFF
  background-image: url('/wave-footer.svg')
  background-size: 110%
  background-repeat: no-repeat
  background-position: top
  height: 22vw
  min-height: 360px
  font-weight: 800
  .oracle-button
    transition: opacity .2s ease
    &:hover,
    &:active,
    &:focus
      text-decoration: none
  .donate-btn
    position: relative
    z-index: 1
  .donate
    max-width: 330px
    position: relative
    z-index: 0
    opacity: 0
    max-height: 0
    transition: opacity .3s ease, max-height .3s ease
    &.show
      opacity: 1
      max-height: 500px
</style>
