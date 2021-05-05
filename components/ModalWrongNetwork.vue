<template>
  <div
    class="card bg-primary border-0 text-white shadow-sm d-flex flex-column"
    @click.stop
  >
    <div class="card-body">
      <h5 class="text-center mb-3">
        <font-awesome-icon :icon="['fas', 'exclamation-triangle']" />
        Wrong Network!
      </h5>
      <p class="m-0">
        You are not connected to the expected network. Please connect to
        {{ networkName(targetNetworkId) }}.
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import helpers from '@/mixins/helpers'

export default {
  mixins: [helpers],
  data() {
    return {
      targetNetworkId: process.env.CHAIN_ID,
    }
  },
  computed: {
    ...mapGetters(['networkId']),
  },
}
</script>
