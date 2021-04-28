<template>
  <div class="card shadow-sm d-flex flex-column">
    <div v-if="success" class="alert alert-success mb-0">
      <font-awesome-icon :icon="['fas', 'check']" />
      Governance department created successfully! :)
    </div>
    <div v-else @click.stop>
      <div class="card-body modal-body flex-fill">
        <h5 class="text-center text-muted-light py-3 px-4 m-0">
          New Department
        </h5>
        <div>
          <b>Link to Repository or Organization</b>
          <input
            v-model="projectUrl"
            type="text"
            class="form-control form-control-lg form-control-with-embed mb-2"
            placeholder="https://github.com/..."
          />
          <small v-if="repository">{{ repository.id }}</small>
          <small v-if="organization">{{ organization.id }}</small>
        </div>
        <div>
          <div class="d-flex">
            <div class="mr-1">
              <input
                v-model="tokenName"
                type="text"
                class="form-control form-control-lg form-control-with-embed mb-2"
                placeholder="Token Name"
              />
            </div>
            <div class="ml-1">
              <input
                v-model="tokenSymbol"
                type="text"
                class="form-control form-control-lg form-control-with-embed mb-2"
                placeholder="Symbol"
              />
            </div>
          </div>
        </div>
        <div>
          <div class="d-flex align-items-end">
            <div class="mr-1">
              <small class="d-flex">Shares to create proposals</small>
              <input
                v-model="newProposalShare"
                type="text"
                class="form-control form-control-lg form-control-with-embed mb-2"
                placeholder="1-100 %"
              />
            </div>
            <div class="ml-1">
              <small class="d-flex">Default Quorum</small>
              <input
                v-model="minQuorum"
                type="text"
                class="form-control form-control-lg form-control-with-embed mb-2"
                placeholder="1-100 %"
              />
            </div>
          </div>
        </div>
        <div>
          <b>Permission NFT</b><br />
          <small>This NFT can be copied and handed out to others.</small>
          <div class="d-flex mt-2">
            <input type="checkbox" class="mr-2" checked disabled />
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
        </div>
      </div>
      <div class="card-body pt-0">
        <button
          class="btn btn-lg btn-primary w-100 shadow-sm"
          :disabled="waitingForOracleRequest || waitingForOracleFulfillment"
          @click="createNewDepartment()"
        >
          <font-awesome-icon
            v-if="waitingForOracleRequest || waitingForOracleFulfillment"
            :icon="['fas', 'circle-notch']"
            spin
          />
          {{
            waitingForOracleRequest
              ? 'Waiting for confirmation...'
              : waitingForOracleFulfillment
              ? 'Waiting for oracle...'
              : 'Create new Department'
          }}
        </button>
      </div>
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
      success: false,
      loadingProject: false,
      tokenName: null,
      tokenSymbol: null,
      projectUrl: '',
      repository: null,
      organization: null,
      newProposalShare: null,
      minQuorum: null,
      waitingForOracleRequest: false,
      waitingForOracleFulfillment: false,
    }
  },
  computed: {
    ...mapGetters(['githubUser']),
  },
  watch: {
    projectUrl(url) {
      clearTimeout(this.loadProjectTimeout)
      this.loadProjectTimeout = setTimeout(() => {
        const repoParts = url.match(
          /^https:\/\/github\.com\/([\w-]+)\/([\w-]+)$/
        )
        const orgParts = url.match(/^https:\/\/github\.com\/([\w-]+)$/)
        if (repoParts) {
          const owner = repoParts[1]
          const repo = repoParts[2]
          this.loadingProject = true
          this.repository = null
          this.$axios
            .$get(`${process.env.API_URL}/github/repository/${owner}/${repo}`)
            .then((repository) => {
              this.repository = repository
            })
            .catch(() => {
              this.repository = null
              this.organization = null
            })
            .finally(() => (this.loadingProject = false))
        } else if (orgParts) {
          const name = orgParts[1]
          this.loadingProject = true
          this.organization = null
          this.$axios
            .$get(`${process.env.API_URL}/github/organization/${name}`)
            .then((organization) => {
              this.organization = organization
            })
            .catch(() => {
              this.repository = null
              this.organization = null
            })
            .finally(() => (this.loadingProject = false))
        } else {
          this.repository = null
          this.organization = null
          this.loadingProject = false
        }
      }, 500)
    },
  },
  methods: {
    createNewDepartment() {
      const projectId = this.repository
        ? this.repository.id
        : this.organization
        ? this.organization.id
        : null

      if (projectId) {
        this.oracleRequest(
          this.$octobay.methods.createGovernanceToken,
          [
            {
              isValue: true,
              githubUserId: this.githubUser.node_id,
              name: this.tokenName,
              symbol: this.tokenSymbol,
              projectId,
              newProposalShare: Number(this.newProposalShare) * 100,
              minQuorum: Number(this.minQuorum) * 100,
              creator: '0x0000000000000000000000000000000000000000',
            },
          ],
          (state) => (this.waitingForOracleRequest = state),
          (state) => (this.waitingForOracleFulfillment = state)
        ).then(() => {
          this.success = true
          this.tokenName = null
          this.tokenSymbol = null
          this.projectUrl = ''
          this.repository = null
          this.organization = null
          this.newProposalShare = null
          this.minQuorum = null
          setTimeout(() => {
            this.$store.dispatch('updateDepartments')
            this.closeModal()
          }, 3000)
        })
      }
    },
  },
}
</script>
