<template>
  <div class="card shadow-sm d-flex flex-column" @click.stop>
    <div class="card-body modal-body flex-fill">
      <h5 class="text-center text-muted-light py-3 px-4 m-0">
        Transfer Permission
      </h5>
      <div class="text-muted text-center">
        <div class="d-flex justify-content-center">
          <GithubUser :from-address="account" :force-show-address="true" />
        </div>
        <NFTPermissions :nft="nft" class="mt-2" />
        <NFTPermissionLabels />
      </div>
      <div class="d-flex flex-column mt-3">
        Recipient Address
        <input
          v-model="ethAddress"
          type="input"
          class="form-control form-control-lg"
        />
      </div>
    </div>
    <div class="card-body pt-0">
      <div v-if="showSuccess" class="alert alert-success border-0">
        <button
          type="button"
          class="close text-success"
          @click="showSuccess = false"
        >
          <span>&times;</span>
        </button>
        <font-awesome-icon :icon="['fas', 'check']" />
        Permission transferred! :)
      </div>
      <button
        class="btn btn-lg btn-primary w-100 shadow-sm"
        :disabled="btnDisabled"
        @click="transferNFT()"
      >
        <font-awesome-icon
          v-if="transferringNFT"
          :icon="['fas', 'circle-notch']"
          spin
        />
        {{
          transferringNFT
            ? 'Waiting for confirmation...'
            : 'Transfer Permission'
        }}
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
      transferringNFT: false,
      showSuccess: false,
      ethAddress: null,
    }
  },
  computed: {
    ...mapGetters(['account', 'modalData']),
    btnDisabled() {
      return this.transferringNFT || !this.$web3utils.isAddress(this.ethAddress)
    },
    nft() {
      return this.modalData ? this.modalData : null
    },
  },
  mounted() {
    this.ethAddress = this.account
  },
  methods: {
    transferNFT() {
      if (this.nft) {
        this.transferringNFT = true
        this.octobayGovNFT.methods
          .safeTransferFrom(this.nft.ownerAddress, this.ethAddress, this.nft.id)
          .send({ from: this.account })
          .then(() => {
            this.showSuccess = true
          })
          .finally(() => {
            this.transferringNFT = false
          })
      }
    },
  },
}
</script>
