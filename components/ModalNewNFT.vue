<template>
  <div class="card shadow-sm d-flex flex-column" @click.stop>
    <div class="card-body modal-body flex-fill">
      <h5 class="text-center text-muted-light py-3 px-4 m-0">
        New Permission NFT
      </h5>
      <div
        class="d-flex w-100 justify-content-around align-items-center text-center py-2 px-3"
      >
        <small class="w-25">Create<br />NFTs</small>
        <small class="w-25">Transfer</small>
        <small class="w-25">Bounty<br />Minting</small>
        <small class="w-25">Create<br />Proposals</small>
      </div>
      <div class="d-flex justify-content-around align-items-center px-3">
        <div class="text-center py-2 w-25">
          <div class="custom-control custom-switch ml-2">
            <input
              id="customSwitch1"
              type="checkbox"
              class="custom-control-input"
            />
            <label class="custom-control-label" for="customSwitch1"></label>
          </div>
        </div>
        <div class="text-center py-2 w-25">
          <div class="custom-control custom-switch ml-2">
            <input
              id="customSwitch2"
              type="checkbox"
              class="custom-control-input"
            />
            <label class="custom-control-label" for="customSwitch2"></label>
          </div>
        </div>
        <div class="text-center py-2 w-25">
          <div class="custom-control custom-switch ml-2">
            <input
              id="customSwitch3"
              type="checkbox"
              class="custom-control-input"
            />
            <label class="custom-control-label" for="customSwitch3"></label>
          </div>
        </div>
        <div class="text-center py-2 w-25">
          <div class="custom-control custom-switch ml-2">
            <input
              id="customSwitch4"
              type="checkbox"
              class="custom-control-input"
            />
            <label class="custom-control-label" for="customSwitch4"></label>
          </div>
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
