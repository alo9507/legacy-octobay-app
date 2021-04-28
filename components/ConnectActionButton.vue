<template>
  <div>
    <a
      v-if="!$web3"
      href="https://metamask.io"
      target="_blank"
      :class="cssClasses"
    >
      Install MetaMask
    </a>
    <button
      v-else-if="required.includes('wallet') && !account"
      :class="cssClasses"
      @click="$store.dispatch('web3connect')"
    >
      Connect Wallet
    </button>
    <a
      v-else-if="required.includes('github') && !githubUser"
      :href="githubAuthUrl"
      :class="cssClasses"
    >
      <font-awesome-icon :icon="['fab', 'github']" />
      Connect GitHub
    </a>
    <a
      v-else-if="
        required.includes('verify') &&
        !githubUser.ethAddresses.map((a) => a.address).includes(account)
      "
      :class="cssClasses"
      @click="openModal('ModalWallet')"
    >
      Verify Address
    </a>
    <button
      v-else-if="action"
      :class="cssClasses"
      :disabled="disabled"
      @click="action()"
    >
      <slot></slot>
    </button>
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
  data() {
    return {
      cssClasses:
        'btn btn-light shadow-sm d-block w-100' +
        (this.size ? ' btn-' + this.size : ''),
    }
  },
  computed: {
    ...mapGetters(['account', 'githubUser', 'githubAuthUrl']),
  },
}
</script>
