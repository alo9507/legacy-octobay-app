<template>
  <div>
    <button
      v-if="required.includes('wallet') && !account"
      :class="
        'btn btn-light shadow-sm d-block w-100' + (size ? ' btn-' + size : '')
      "
      @click="$store.dispatch('web3connect')"
    >
      Connect Wallet
    </button>
    <a
      v-else-if="required.includes('github') && !githubUser"
      :href="githubAuthUrl"
      :class="
        'btn btn-light shadow-sm d-block w-100' + (size ? ' btn-' + size : '')
      "
    >
      <font-awesome-icon :icon="['fab', 'github']" />
      Connect GitHub
    </a>
    <a
      v-else-if="
        required.includes('verify') &&
        !githubUser.ethAddresses.map((a) => a.address).includes(account)
      "
      :class="
        'btn btn-primary shadow-sm d-block w-100' + (size ? ' btn-' + size : '')
      "
      @click="openModal('ModalWallet')"
    >
      Verify Address
    </a>
    <button
      v-else-if="$web3"
      :class="
        'btn btn-primary shadow-sm d-block w-100' + (size ? ' btn-' + size : '')
      "
      :disabled="disabled"
      @click="action()"
    >
      <slot></slot>
    </button>
    <div v-else class="alert bg-secondary text-white">Browser unsupported.</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import helpers from '@/mixins/helpers'

export default {
  mixins: [helpers],
  props: {
    action: {
      type: Function,
      default: () => null,
    },
    required: {
      type: Array,
      default: () => ['github', 'wallet', 'verify'],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapGetters(['account', 'githubUser', 'githubAuthUrl']),
  },
}
</script>
