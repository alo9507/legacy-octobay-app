<template>
  <div class="card-body" style="max-width: 360px">
    <div>
      <b>Octobay Contract</b>
      <div>
        <input
          type="text"
          :value="$octobay.options.address"
          class="form-control"
          readonly
        />
      </div>
    </div>
    <div class="mt-2">
      <small><b>OctobayGovernor Contract</b></small>
      <div>
        <input
          type="text"
          :value="$octobayGovernor.options.address"
          class="form-control form-control-sm"
          readonly
        />
      </div>
    </div>
    <div class="mt-2">
      <small><b>OctobayGovNFT Contract</b></small>
      <div>
        <input
          type="text"
          :value="$octobayGovNFT.options.address"
          class="form-control form-control-sm"
          readonly
        />
      </div>
    </div>
    <div class="mt-2">
      <small><b>OracleStorage Contract</b></small>
      <div>
        <input
          type="text"
          :value="oracleStorageAddress"
          class="form-control form-control-sm"
          readonly
        />
      </div>
    </div>
    <div class="mt-2">
      <small><b>DepositStorage Contract</b></small>
      <div>
        <input
          type="text"
          :value="depositStorageAddress"
          class="form-control form-control-sm"
          readonly
        />
      </div>
    </div>
    <div class="mt-2">
      <small><b>UserAddressStorage Contract</b></small>
      <div>
        <input
          type="text"
          :value="userAddressStorageAddress"
          class="form-control form-control-sm"
          readonly
        />
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
    <div class="mt-2">
      <b>New Oracle Job</b>
      <input
        v-model="newOracleJob.oracle"
        type="text"
        class="form-control mb-1"
        placeholder="Oracle Address"
      />
      <input
        v-model="newOracleJob.jobName"
        type="text"
        class="form-control mb-1"
        placeholder="Oracle Job Name"
      />
      <input
        v-model="newOracleJob.jobId"
        type="text"
        class="form-control mb-1"
        placeholder="Oracle Job ID"
      />
      <input
        v-model="newOracleJob.jobFee"
        type="text"
        class="form-control"
        placeholder="Oracle Job Fee"
      />
      <button
        class="btn btn-primary mt-3 w-100 shadow-sm"
        @click="addOracleJob()"
      >
        <font-awesome-icon
          v-if="addingOracleJob"
          :icon="['fas', 'circle-notch']"
          spin
        />
        <span v-else>Add Oracle Job</span>
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
      },
      oracleUpdating: false,
      jobUpdating: false,
      addingNewOracle: false,
      removingOralce: false,
      newOracleJob: {
        oracle: null,
        jobName: null,
        jobId: null,
        jobFee: null,
      },
      addingOracleJob: false,
      oracleStorageAddress: '',
      depositStorageAddress: '',
      userAddressStorageAddress: '',
    }
  },
  computed: {
    ...mapGetters(['account', 'oracles']),
  },
  mounted() {
    this.$octobay.methods
      .oracleStorage()
      .call()
      .then((address) => (this.oracleStorageAddress = address))
    this.$octobay.methods
      .depositStorage()
      .call()
      .then((address) => (this.depositStorageAddress = address))
    this.$octobay.methods
      .userAddressStorage()
      .call()
      .then((address) => (this.userAddressStorageAddress = address))
  },
  methods: {
    isNewOracleValid() {
      return (
        this.newOracle.ethAddress.length === 42 &&
        this.newOracle.ethAddress.startsWith('0x') &&
        this.newOracle.name &&
        this.newOracle.registerJobId.length === 32
      )
    },
    addNewOracle() {
      this.addingNewOracle = true
      const jobFee = '10000000000000000'
      this.$octobay.methods
        .addOracle(
          this.newOracle.ethAddress,
          this.newOracle.name,
          ['register'],
          [[this.$web3utils.toHex(this.newOracle.registerJobId), jobFee]]
        )
        .send({ from: this.account })
        .then(() => {
          this.newOracle.ethAddress = ''
          this.newOracle.name = ''
          this.newOracle.registerJobId = ''
          this.$store.dispatch('updateOracles').then(() => {
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
      this.$octobay.methods
        .setOracleJob(oracle, type, this.$web3utils.toHex(jobId), jobFee)
        .send({ from: this.account })
        .then(() => {
          this.oracleUpdating = false
          this.jobUpdating = false
        })
    },
    removeOracle(address) {
      this.removingOralce = address
      this.$octobay.methods
        .removeOracle(address)
        .send({ from: this.account })
        .then(() => {
          this.$store.dispatch('updateOracles').then(() => {
            this.removingOralce = false
          })
        })
    },
    addOracleJob() {
      this.addingOracleJob = true
      this.$octobay.methods
        .addOracleJob(this.newOracleJob.oracle, this.newOracleJob.jobName, [
          this.$web3utils.toHex(this.newOracleJob.jobId),
          this.newOracleJob.jobFee,
        ])
        .send({ from: this.account })
        .then(() => {
          this.addingOracleJob = false
          this.newOracleJob.oracle = null
          this.newOracleJob.jobName = null
          this.newOracleJob.jobId = null
          this.newOracleJob.jobFee = null
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
