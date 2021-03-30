<template>
  <div class="card shadow-sm d-flex flex-column" @click.stop>
    <div class="card-body modal-body flex-fill">
      <h5 class="text-center text-muted-light py-3 px-4 m-0">
        New Permission NFT
      </h5>
      <div class="d-flex mt-2">
        <input type="checkbox" class="mr-2" />
        <div class="d-flex flex-column">
          Manage Settings
          <small class="text-muted">includes creating/revoking NFTs</small>
        </div>
      </div>
      <div class="d-flex">
        <input type="checkbox" class="mr-2" />
        <div class="d-flex flex-column">
          Create Proposals
          <small class="text-muted">regardless of token holdings</small>
        </div>
      </div>
      <div class="d-flex flex-column mt-3">
        Recipient Address
        <input
          type="input"
          class="form-control form-control-lg"
          :value="account"
        />
      </div>
    </div>
    <div class="card-body pt-0">
      <button class="btn btn-lg btn-primary w-100 shadow-sm">
        Create Permission-NFT
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    ...mapGetters(['oracles', 'account']),
  },
}
</script>
