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
              v-model="permissions['MINT']"
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
              v-model="permissions['TRANSFER']"
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
              v-model="permissions['SET_ISSUE_GOVTOKEN']"
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
              v-model="permissions['CREATE_PROPOSAL']"
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
        Permission-NFT created! :)
      </div>
      <button
        class="btn btn-lg btn-primary w-100 shadow-sm"
        :disabled="btnDisabled"
        @click="createNFT()"
      >
        <font-awesome-icon
          v-if="creatingNFT"
          :icon="['fas', 'circle-notch']"
          spin
        />
        {{
          creatingNFT ? 'Waiting for confirmation...' : 'Create Permission-NFT'
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
      creatingNFT: false,
      showSuccess: false,
      ethAddress: null,
      permissions: {
        MINT: false,
        TRANSFER: false,
        SET_ISSUE_GOVTOKEN: false,
        CREATE_PROPOSAL: false,
      },
    }
  },
  computed: {
    ...mapGetters(['account', 'modalData']),
    btnDisabled() {
      return (
        this.creatingNFT ||
        !this.$web3utils.isAddress(this.ethAddress) ||
        !Object.values(this.permissions).find((perm) => perm === true)
      )
    },
  },
  mounted() {
    this.ethAddress = this.account
  },
  methods: {
    createNFT() {
      const department = this.modalData
      if (department) {
        const permissionNFT = department.nfts.find((nft) => {
          return (
            nft.ownerAddress === this.account &&
            nft.permissions.includes('MINT')
          )
        })
        if (permissionNFT) {
          const perms = []
          if (this.permissions.MINT) perms.push(0)
          if (this.permissions.TRANSFER) perms.push(1)
          if (this.permissions.SET_ISSUE_GOVTOKEN) perms.push(2)
          if (this.permissions.CREATE_PROPOSAL) perms.push(3)
          this.creatingNFT = true
          this.octobayGovNFT.methods
            .mintTokenWithPermissions(
              this.ethAddress,
              permissionNFT.id,
              perms,
              department.tokenAddress
            )
            .send({ from: this.account })
            .then(() => {
              this.showSuccess = true
            })
            .finally(() => {
              this.creatingNFT = false
            })
        }
      }
    },
  },
}
</script>
