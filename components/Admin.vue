<template>
    <div class="card-body" style="max-width: 360px">
      <div>
        <b>OctoBay Contract</b>
        <div>
          <input type="text" :value="$octoBay.options.address" class="form-control" readonly />
        </div>
      </div>
      <div class="mt-3">
        <b>OctoPin Token</b>
        <div class="input-with-button">
          <input type="text" v-model="octoPinAddress" class="form-control" />
          <button class="btn btn-primary btn-sm shadow-sm" @click="updateOctoPinToken()" :disabled="updatingOctoPinToken">
            <font-awesome-icon :icon="['fas', 'circle-notch']" spin v-if="updatingOctoPinToken" />
            <font-awesome-icon :icon="['fas', 'check']" v-else />
          </button>
        </div>
      </div>
      <div class="mt-3">
        <b>Twitter Account ID</b>
        <div class="input-with-button">
          <input type="text" v-model="twitterAccountId" class="form-control" />
          <button class="btn btn-primary btn-sm shadow-sm" @click="updateTwitterAccountId()" :disabled="updatingTwitterAccountId">
            <font-awesome-icon :icon="['fas', 'circle-notch']" spin v-if="updatingTwitterAccountId" />
            <font-awesome-icon :icon="['fas', 'check']" v-else />
          </button>
        </div>
      </div>
      <div class="mt-3">
        <b>New Oracle</b>
        <div>
          <small class="text-muted">Address:</small>
          <input type="text" v-model="newOracle.address" class="form-control" />
        </div>
        <div>
          <small class="text-muted">Name</small>
          <input type="text" v-model="newOracle.name" class="form-control" />
        </div>
        <div class="input-with-button">
          <small class="text-muted">Register Job ID</small>
          <input type="text" v-model="newOracle.registerJobId" class="form-control" />
        </div>
        <div class="input-with-button">
          <small class="text-muted">Release Job ID</small>
          <input type="text" v-model="newOracle.releaseJobId" class="form-control" />
        </div>
        <div class="input-with-button">
          <small class="text-muted">Claim Job ID</small>
          <input type="text" v-model="newOracle.claimJobId" class="form-control" />
        </div>
        <div class="input-with-button">
          <small class="text-muted">Twitter Post Job ID</small>
          <input type="text" v-model="newOracle.twitterPostJobId" class="form-control" />
        </div>
        <div class="input-with-button">
          <small class="text-muted">Twitter Followers Job ID</small>
          <input type="text" v-model="newOracle.twitterFollowersJobId" class="form-control" />
        </div>
        <button class="btn btn-primary mt-3 w-100 shadow-sm" @click="addNewOracle()" :disabled="!isNewOracleValid()">
          <font-awesome-icon :icon="['fas', 'circle-notch']" spin v-if="addingNewOracle" />
          <span v-else>Add new Oracle</span>
        </button>
      </div>
      <div v-for="oracle in oracleForms" class="border rounded-xl p-3 mt-3">
        <div>
          <small class="text-muted">Address</small>
          <input type="text" v-model="oracle.address" class="form-control" readonly />
        </div>
        <div>
          <small class="text-muted">Name</small>
          <input type="text" v-model="oracle.name" class="form-control" readonly />
        </div>
        <div class="input-with-button">
          <small class="text-muted">Register Job ID</small>
          <input type="text" v-model="oracle.registerJobId" class="form-control" />
          <button class="btn btn-primary btn-sm shadow-sm" @click="updateJobId(oracle.address, 1, oracle.registerJobId, oracle.registerJobFee)">
            <font-awesome-icon :icon="['fas', 'circle-notch']" spin v-if="oracleUpdating == oracle.address && jobUpdating == 1" />
            <font-awesome-icon :icon="['fas', 'check']" v-else />
          </button>
        </div>
        <div class="input-with-button">
          <small class="text-muted">Release Job ID</small>
          <input type="text" v-model="oracle.releaseJobId" class="form-control" />
          <button class="btn btn-primary btn-sm shadow-sm" @click="updateJobId(oracle.address, 2, oracle.releaseJobId, oracle.releaseJobFee)">
            <font-awesome-icon :icon="['fas', 'circle-notch']" spin v-if="oracleUpdating == oracle.address && jobUpdating == 2" />
            <font-awesome-icon :icon="['fas', 'check']" v-else />
          </button>
        </div>
        <div class="input-with-button">
          <small class="text-muted">Claim Job ID</small>
          <input type="text" v-model="oracle.claimJobId" class="form-control" />
          <button class="btn btn-primary btn-sm shadow-sm" @click="updateJobId(oracle.address, 3, oracle.claimJobId, oracle.claimJobFee)">
            <font-awesome-icon :icon="['fas', 'circle-notch']" spin v-if="oracleUpdating == oracle.address && jobUpdating == 3" />
            <font-awesome-icon :icon="['fas', 'check']" v-else />
          </button>
        </div>
        <div class="input-with-button">
          <small class="text-muted">Twitter Post Job ID</small>
          <input type="text" v-model="oracle.twitterPostJobId" class="form-control" />
          <button class="btn btn-primary btn-sm shadow-sm" @click="updateJobId(oracle.address, 4, oracle.twitterPostJobId, oracle.twitterPostJobFee)">
            <font-awesome-icon :icon="['fas', 'circle-notch']" spin v-if="oracleUpdating == oracle.address && jobUpdating == 4" />
            <font-awesome-icon :icon="['fas', 'check']" v-else />
          </button>
        </div>
        <div class="input-with-button">
          <small class="text-muted">Twitter Followers Job ID</small>
          <input type="text" v-model="oracle.twitterFollowersJobId" class="form-control" />
          <button class="btn btn-primary btn-sm shadow-sm" @click="updateJobId(oracle.address, 5, oracle.twitterFollowersJobId, oracle.twitterFollowersJobFee)">
            <font-awesome-icon :icon="['fas', 'circle-notch']" spin v-if="oracleUpdating == oracle.address && jobUpdating == 5" />
            <font-awesome-icon :icon="['fas', 'check']" v-else />
          </button>
        </div>
        <button class="btn btn-danger mt-3 w-100 shadow-sm" @click="removeOracle(oracle.address)" :disabled="removingOralce == oracle.address">
          <font-awesome-icon :icon="['fas', 'circle-notch']" spin v-if="removingOralce == oracle.address" />
          <span v-else>Remove Oracle</span>
        </button>
      </div>
    </div>
</template>

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

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      newOracle: {
        address: '',
        name: '',
        registerJobId: '',
        releaseJobId: '',
        claimJobId: '',
        twitterPostJobId: '',
        twitterFollowersJobId: ''
      },
      oracleForms: [],
      oracleUpdating: false,
      jobUpdating: false,
      addingNewOracle: false,
      removingOralce: false,
      updatingOctoPinToken: false,
      updatingTwitterAccountId: false
    }
  },
  computed: {
    ...mapGetters(['account', 'oracles', 'octoPinAddress', 'twitterAccountId']),
    octoPinAddress: {
      get() {
        return this.$store.state.octoPinAddress
      },
      set(address) {
        this.$store.commit('setOctoPinAddress', address)
      }
    },
    twitterAccountId: {
      get() {
        return this.$store.state.twitterAccountId
      },
      set(id) {
        this.$store.commit('setTwitterAccountId', id)
      }
    }
  },
  mounted() {
    this.oracles.forEach(oracle => {
      this.oracleForms.push({
        address: oracle.address,
        name: oracle.name,
        registerJobId: oracle.registerJobId,
        releaseJobId: oracle.releaseJobId,
        claimJobId: oracle.claimJobId,
        twitterPostJobId: oracle.twitterPostJobId,
        twitterFollowersJobId: oracle.twitterFollowersJobId
      })
    })
  },
  methods: {
    updateOctoPinToken() {
      this.updatingOctoPinToken = true
      this.$octoBay.methods.setOctoPin(
        this.octoPinAddress
      ).send({ from: this.account }).then(() => {
        this.updatingOctoPinToken = false
      })
    },
    updateTwitterAccountId() {
      this.updatingTwitterAccountId = true
      this.$octoBay.methods.setTwitterAccountId(
        this.twitterAccountId
      ).send({ from: this.account }).then(() => {
        this.updatingTwitterAccountId = false
      })
    },
    isNewOracleValid() {
      return (
        this.newOracle.address.length === 42 &&
        this.newOracle.address.startsWith('0x') &&
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
      console.log(this.$octoBay)
      this.$octoBay.methods.addOracle(
        this.newOracle.address,
        this.newOracle.name,
        [0, 1, 2, 3, 4],
        [
          [this.$web3.utils.toHex(this.newOracle.registerJobId), jobFee],
          [this.$web3.utils.toHex(this.newOracle.releaseJobId), jobFee],
          [this.$web3.utils.toHex(this.newOracle.claimJobId), jobFee],
          [this.$web3.utils.toHex(this.newOracle.twitterPostJobId), jobFee],
          [this.$web3.utils.toHex(this.newOracle.twitterFollowersJobId), jobFee]
        ]
      ).send({ from: this.account }).then(() => {
        this.newOracle.address = ''
        this.newOracle.name = ''
        this.newOracle.registerJobId = ''
        this.newOracle.releaseJobId = ''
        this.newOracle.claimJobId = ''
        this.newOracle.twitterPostJobId = ''
        this.newOracle.twitterFollowersJobId = ''
        this.$store.dispatch('updateOracles').then(oracles => {
          this.oracleForms = oracles
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
      this.$octoBay.methods.setOracleJob(
        oracle,
        type,
        this.$web3.utils.toHex(jobId),
        jobFee
      ).send({ from: this.account }).then(() => {
        this.oracleUpdating = false
        this.jobUpdating = false
      })
    },
    removeOracle(address) {
      this.removingOralce = address
      this.$octoBay.methods.removeOracle(
        address
      ).send({ from: this.account }).then(() => {
        this.$store.dispatch('updateOracles').then(oracles => {
          this.oracleForms = oracles
          this.removingOralce = false
        })
      })
    }
  }
}
</script>
