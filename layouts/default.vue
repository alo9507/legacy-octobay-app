<template>
  <div class="d-flex flex-column pt-5" style="min-height: 100vh">
    <div
      v-if="showPrototypeWarning"
      class="alert text-white bg-secondary border-0 mx-auto"
      style="max-width: 360px"
    >
      <button
        type="button"
        class="close p-1"
        @click="showPrototypeWarning = false"
      >
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
          Please connect to the <b>Kovan</b> test network, try things out (spot
          the bugs) and share your thoughts. This is an open source project,
          open for ideas of any kind.
        </div>
        <div class="d-flex mt-3">
          <a
            href="https://octobay.github.io/docs/"
            target="_blank"
            class="flex-fill btn btn-sm btn-outline-light"
          >
            learn more
          </a>
          <a
            href="https://discord.gg/DhKgHrFeCD"
            target="_blank"
            class="ml-1 btn btn-sm btn-outline-light"
          >
            <font-awesome-icon :icon="['fab', 'discord']" />
          </a>
          <a
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
    <RecipientTypeList />
    <IntervalSelect />
    <OracleList />
    <Modal />
  </div>
</template>

<script>
export default {
  middleware: ['load', 'deeplinks'],
  data() {
    return {
      showPrototypeWarning: true,
      showCompatibilityWarning: true,
    }
  },
}
</script>
