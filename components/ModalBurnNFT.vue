<template>
  <div class="card shadow-sm d-flex flex-column" @click.stop>
    <div class="card-body modal-body flex-fill">
      <h5 class="text-center text-muted-light py-3 px-4 m-0">
        Destroy Permission
      </h5>
      <div class="text-muted text-center">
        <div class="d-flex justify-content-center">
          <GithubUser :from-address="account" :force-show-address="true" />
        </div>
        <div class="pt-2">
          <div class="d-flex justify-content-around align-items-center">
            <div class="text-center w-25">
              <font-awesome-icon
                :icon="['fas', 'check']"
                class="text-success"
              />
            </div>
            <div class="text-center w-25">
              <font-awesome-icon
                :icon="['fas', 'check']"
                class="text-success"
              />
            </div>
            <div class="text-center w-25">
              <font-awesome-icon
                :icon="['fas', 'check']"
                class="text-success"
              />
            </div>
            <div class="text-center w-25">
              <font-awesome-icon
                :icon="['fas', 'check']"
                class="text-success"
              />
            </div>
          </div>
        </div>
        <div
          class="d-flex w-100 justify-content-around align-items-center text-center"
        >
          <small class="w-25">Manage<br />Permissions</small>
          <small class="w-25">Manage<br />Bounties</small>
          <small class="w-25">Create<br />Proposals</small>
          <small class="w-25">Transfer this<br />Permission</small>
        </div>
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
        Permission destroyed! :)
      </div>
      <button
        class="btn btn-lg btn-primary w-100 shadow-sm"
        :disabled="btnDisabled"
        @click="burnNFT()"
      >
        <font-awesome-icon
          v-if="burningNFT"
          :icon="['fas', 'circle-notch']"
          spin
        />
        {{ burningNFT ? 'Waiting for confirmation...' : 'Destroy Permission' }}
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
      burningNFT: false,
      showSuccess: false,
    }
  },
  computed: {
    ...mapGetters(['account', 'modalData']),
    btnDisabled() {
      return this.burningNFT
    },
  },
  methods: {
    burnNFT() {
      const nft = this.modalData
      if (nft) {
        this.burningNFT = true
        this.octobayGovNFT.methods
          .burn(nft.id)
          .send({ from: this.account })
          .then(() => {
            this.showSuccess = true
          })
          .finally(() => {
            this.burningNFT = false
          })
      }
    },
  },
}
</script>
