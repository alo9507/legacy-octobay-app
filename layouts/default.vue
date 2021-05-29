<template>
  <div class="d-flex flex-column pt-3" style="min-height: 100vh">
    <div class="text-center pb-5">
      <Logo variant="grayscale" />
    </div>
    <div
      v-if="showPrototypeWarning"
      class="alert text-white bg-secondary border-0 mx-auto"
      style="max-width: 360px"
    >
      <button type="button" class="close p-1" @click="hidePrototypeWarning">
        <svg style="width: 20px; height: 20px" viewBox="0 0 24 24">
          <path
            fill="#ffffff"
            d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
          />
        </svg>
      </button>
      <font-awesome-icon :icon="['fas', 'info-circle']" />
      <b>This is a prototype!</b>
      <div class="mt-2 d-flex flex-column">
        <div>
          Try things out (spot the bugs) and share your thoughts. This is an
          open source project, open for ideas of any kind.
        </div>
        <div class="d-flex mt-3">
          <a
            href="https://github.com/octobay/app/wiki"
            target="_blank"
            class="flex-fill btn btn-sm btn-outline-light"
          >
            learn more
          </a>
          <a
            v-tooltip="{ content: 'Discussions', trigger: 'hover' }"
            href="https://github.com/Octobay/app/discussions"
            target="_blank"
            class="ml-1 btn btn-sm btn-outline-light"
          >
            <font-awesome-icon :icon="['fas', 'comments']" />
          </a>
          <a
            v-tooltip="{ content: 'Discord', trigger: 'hover' }"
            href="https://discord.gg/DhKgHrFeCD"
            target="_blank"
            class="ml-1 btn btn-sm btn-outline-light"
          >
            <font-awesome-icon :icon="['fab', 'discord']" />
          </a>
          <a
            v-tooltip="{ content: 'Twitter', trigger: 'hover' }"
            href="https://twitter.com/OctobayApp"
            target="_blank"
            class="ml-1 btn btn-sm btn-outline-light"
          >
            <font-awesome-icon :icon="['fab', 'twitter']" />
          </a>
          <a
            v-tooltip="{ content: 'Kovan Faucet', trigger: 'hover' }"
            href="https://gitter.im/kovan-testnet/faucet"
            target="_blank"
            class="ml-1 btn btn-sm btn-outline-light"
          >
            <font-awesome-icon :icon="['fas', 'faucet']" />
          </a>
          <a
            v-tooltip="{ content: 'New Issue', trigger: 'hover' }"
            href="https://github.com/octobay/app/issues/new"
            target="_blank"
            class="ml-1 btn btn-sm btn-outline-light"
          >
            <font-awesome-icon :icon="['fas', 'exclamation-circle']" />
          </a>
        </div>
      </div>
    </div>
    <div
      v-if="!$web3 && showCompatibilityWarning"
      class="alert bg-primary text-white border-0 mb-3 mx-auto"
      style="max-width: 360px"
    >
      <button
        type="button"
        class="close p-1"
        @click="showCompatibilityWarning = false"
      >
        <svg style="width: 20px; height: 20px" viewBox="0 0 24 24">
          <path
            fill="#ffffff"
            d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
          />
        </svg>
      </button>
      <font-awesome-icon :icon="['fas', 'exclamation-triangle']" />
      <b>Unsupported Browser!</b>
      <div class="mt-2">
        You need an Ethereum compatible browser to use this service.
      </div>
    </div>
    <div
      class="container-fluid main d-flex flex-column align-items-center pb-5"
    >
      <Header />
      <Nuxt />
    </div>
    <Footer />
    <About />
    <RecipientTypeList />
    <IntervalSelect />
    <OracleList />
    <Modal />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import helpers from '@/mixins/helpers'

export default {
  mixins: [helpers],
  middleware: ['load', 'deeplinks'],
  data() {
    return {
      showCompatibilityWarning: true,
      showPrototypeWarning: false,
    }
  },
  computed: {
    ...mapGetters(['networkId']),
  },
  watch: {
    networkId() {
      if (this.networkId !== Number(process.env.CHAIN_ID)) {
        this.openModal('ModalWrongNetwork', true)
      } else {
        this.closeModal()
      }
    },
  },
  mounted() {
    const hidePrototypeWarningExpire = localStorage.getItem(
      'hidePrototypeWarningExpire'
    )
    this.showPrototypeWarning = !(
      hidePrototypeWarningExpire &&
      Number(hidePrototypeWarningExpire) > Math.floor(Date.now() / 1000)
    )
  },
  methods: {
    hidePrototypeWarning() {
      this.showPrototypeWarning = false
      localStorage.setItem(
        'hidePrototypeWarningExpire',
        Math.floor(Date.now() / 1000) + 60 * 60 // expire in one hour
      )
    },
  },
}
</script>
