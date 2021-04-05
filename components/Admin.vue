<template>
  <div class="card-body" style="max-width: 360px">
    <div>
      <b>OctoBay Contract</b>
      <div>
        <input
          type="text"
          :value="$octoBay.options.address"
          class="form-control"
          readonly
        />
      </div>
    </div>
    <div class="mt-3">
      <b>Twitter Account ID</b>
      <div class="input-with-button">
        <input v-model="twitterAccountId" type="text" class="form-control" />
        <button
          class="btn btn-primary btn-sm shadow-sm"
          :disabled="updatingTwitterAccountId"
          @click="updateTwitterAccountId()"
        >
          <font-awesome-icon
            v-if="updatingTwitterAccountId"
            :icon="['fas', 'circle-notch']"
            spin
          />
          <font-awesome-icon v-else :icon="['fas', 'check']" />
        </button>
      </div>
    </div>
    <div class="mt-3">
      <b>New Oracle</b>
      <div>
        <small class="text-muted">Address:</small>
        <input
          v-model="newOracle.ethAddress"
          type="text"
          class="form-control"
        />
      </div>
      <div>
        <small class="text-muted">Name</small>
        <input v-model="newOracle.name" type="text" class="form-control" />
      </div>
      <div class="input-with-button">
        <small class="text-muted">Register Job ID</small>
        <input
          v-model="newOracle.registerJobId"
          type="text"
          class="form-control"
        />
      </div>
      <div class="input-with-button">
        <small class="text-muted">Release Job ID</small>
        <input
          v-model="newOracle.releaseJobId"
          type="text"
          class="form-control"
        />
      </div>
      <div class="input-with-button">
        <small class="text-muted">Claim Job ID</small>
        <input
          v-model="newOracle.claimJobId"
          type="text"
          class="form-control"
        />
      </div>
      <div class="input-with-button">
        <small class="text-muted">Twitter Post Job ID</small>
        <input
          v-model="newOracle.twitterPostJobId"
          type="text"
          class="form-control"
        />
      </div>
      <div class="input-with-button">
        <small class="text-muted">Twitter Followers Job ID</small>
        <input
          v-model="newOracle.twitterFollowersJobId"
          type="text"
          class="form-control"
        />
      </div>
      <button
        class="btn btn-primary mt-3 w-100 shadow-sm"
        :disabled="!isNewOracleValid()"
        @click="addNewOracle()"
      >
        <font-awesome-icon
          v-if="addingNewOracle"
          :icon="['fas', 'circle-notch']"
          spin
        />
        <span v-else>Add new Oracle</span>
      </button>
    </div>
    <div
      v-for="oracle in oracles"
      :key="oracle.id"
      class="border rounded-xl p-3 mt-3"
    >
      <div>
        <small class="text-muted">Address</small>
        <input
          v-model="oracle.ethAddress"
          type="text"
          class="form-control"
          readonly
        />
      </div>
      <div>
        <small class="text-muted">Name</small>
        <input
          v-model="oracle.name"
          type="text"
          class="form-control"
          readonly
        />
      </div>
      <div v-for="job in oracle.jobs" :key="job.id">
        <small class="text-muted">{{ job.name }}</small>
        <input :value="job.id" type="text" class="form-control" readonly />
      </div>
      <button
        class="btn btn-danger mt-3 w-100 shadow-sm"
        :disabled="removingOralce == oracle.ethAddress"
        @click="removeOracle(oracle.ethAddress)"
      >
        <font-awesome-icon
          v-if="removingOralce == oracle.ethAddress"
          :icon="['fas', 'circle-notch']"
          spin
        />
        <span v-else>Remove Oracle</span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      newOracle: {
        ethAddress: '',
        name: '',
        registerJobId: '',
        releaseJobId: '',
        claimJobId: '',
        twitterPostJobId: '',
        twitterFollowersJobId: '',
      },
      oracleUpdating: false,
      jobUpdating: false,
      addingNewOracle: false,
      removingOralce: false,
      updatingTwitterAccountId: false,
    }
  },
  computed: {
    ...mapGetters(['account', 'oracles', 'twitterAccountId']),
    twitterAccountId: {
      get() {
        return this.$store.state.twitterAccountId
      },
      set(id) {
        this.$store.commit('setTwitterAccountId', id)
      },
    },
  },
  methods: {
    updateTwitterAccountId() {
      this.updatingTwitterAccountId = true
      this.$octoBay.methods
        .setTwitterAccountId(this.twitterAccountId)
        .send({ from: this.account })
        .then(() => {
          this.updatingTwitterAccountId = false
        })
    },
    isNewOracleValid() {
      return (
        this.newOracle.ethAddress.length === 42 &&
        this.newOracle.ethAddress.startsWith('0x') &&
        this.newOracle.name &&
        this.newOracle.registerJobId.length === 32 &&
        this.newOracle.releaseJobId.length === 32 &&
        this.newOracle.claimJobId.length === 32 &&
        this.newOracle.twitterPostJobId.length === 32 &&
        this.newOracle.twitterFollowersJobId.length === 32
      )
    },
    addNewOracle() {
      this.addingNewOracle = true
      const jobFee = '10000000000000000'
      this.$octoBay.methods
        .addOracle(
          this.newOracle.ethAddress,
          this.newOracle.name,
          ['register', 'release', 'claim', 'twitterPost', 'twitterFollowers'],
          [
            [this.$web3.utils.toHex(this.newOracle.registerJobId), jobFee],
            [this.$web3.utils.toHex(this.newOracle.releaseJobId), jobFee],
            [this.$web3.utils.toHex(this.newOracle.claimJobId), jobFee],
            [this.$web3.utils.toHex(this.newOracle.twitterPostJobId), jobFee],
            [
              this.$web3.utils.toHex(this.newOracle.twitterFollowersJobId),
              jobFee,
            ],
          ]
        )
        .send({ from: this.account })
        .then(() => {
          this.newOracle.ethAddress = ''
          this.newOracle.name = ''
          this.newOracle.registerJobId = ''
          this.newOracle.releaseJobId = ''
          this.newOracle.claimJobId = ''
          this.newOracle.twitterPostJobId = ''
          this.newOracle.twitterFollowersJobId = ''
          this.$store.dispatch('updateOracles').then((oracles) => {
            this.addingNewOracle = false
          })
        })
    },
    updateJobId(oracle, type, jobId, jobFee) {
      if (!jobFee) {
        jobFee = '10000000000000000'
      }

      this.oracleUpdating = oracle
      this.jobUpdating = type
      this.$octoBay.methods
        .setOracleJob(oracle, type, this.$web3.utils.toHex(jobId), jobFee)
        .send({ from: this.account })
        .then(() => {
          this.oracleUpdating = false
          this.jobUpdating = false
        })
    },
    removeOracle(address) {
      this.removingOralce = address
      this.$octoBay.methods
        .removeOracle(address)
        .send({ from: this.account })
        .then(() => {
          this.$store.dispatch('updateOracles').then((oracles) => {
            this.removingOralce = false
          })
        })
    },
  },
}
</script>

<style lang="sass" scoped>
.input-with-button
  position: relative
  input
    padding-right: 50px
  button
    position: absolute
    right: 5px
    bottom: 5px
</style>
