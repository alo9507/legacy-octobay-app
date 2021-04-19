<template>
  <div>
    <button
      v-if="required.includes('wallet') && !connected"
      class="btn btn-lg btn-light shadow-sm d-block w-100"
      @click="connect()"
    >
      Connect Wallet
    </button>
    <a
      v-else-if="required.includes('github') && !githubUser"
      :href="githubAuthUrl"
      class="btn btn-lg btn-light shadow-sm d-block"
    >
      <font-awesome-icon :icon="['fab', 'github']" />
      Connect GitHub
    </a>
    <button
      v-else-if="$web3"
      class="btn btn-lg btn-primary w-100 shadow-sm"
      :disabled="disabled"
      @click="action()"
    >
      <slot></slot>
    </button>
    <div v-else class="alert alert-warning">Browser unsupported.</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import connect from '@/mixins/connect'

export default {
  mixins: [connect],
  props: {
    action: {
      type: Function,
      default: () => null,
    },
    required: {
      type: Array,
      default: () => ['github', 'wallet'],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(['connected']),
    ...mapGetters('github', {
      githubUser: 'user',
      githubAuthUrl: 'authUrl',
    }),
  },
}
</script>
