<template>
  <div class="card shadow-sm d-flex flex-column">
    <div v-if="success" class="alert alert-success mb-0">
      <font-awesome-icon :icon="['fas', 'check']" />
      Governance department created successfully! :)
    </div>
    <div v-else @click.stop>
      <div class="card-body modal-body flex-fill">
        <h5 class="text-center text-muted-light py-3 px-4 m-0">
          Create a Token for your Repository or Organization.
        </h5>
        <div>
          <input
            v-model="projectUrl"
            type="text"
            class="form-control form-control-lg form-control-with-embed mb-2"
            placeholder="Repo/Org URL"
          />
          <RepositoryEmbed v-if="repository" :repository="repository" />
          <OrganizationEmbed v-if="organization" :organization="organization" />
        </div>
        <div class="d-flex">
          <div class="mr-1" style="width: 66%">
            <input
              v-model="tokenName"
              type="text"
              class="form-control form-control-lg mb-2"
              placeholder="Token Name"
            />
          </div>
          <div class="ml-1" style="width: 33%">
            <input
              v-model="tokenSymbol"
              type="text"
              class="form-control form-control-lg mb-2"
              placeholder="Symbol"
            />
          </div>
        </div>
        <div class="d-flex align-items-end py-2">
          <div class="mr-1 d-flex flex-column align-items-center">
            <small class="d-flex text-muted text-center mb-2">
              Required token shares<br />to create proposals
            </small>
            <input
              v-model="newProposalShare"
              type="text"
              class="text-center form-control w-75 mb-2"
              placeholder="1-100 %"
            />
          </div>
          <div class="mr-1 d-flex flex-column align-items-center">
            <small class="d-flex text-muted text-center mb-2">
              Minimum quorum for new proposals
            </small>
            <input
              v-model="minQuorum"
              type="text"
              class="text-center form-control w-75 mb-2"
              placeholder="1-100 %"
            />
          </div>
        </div>
        <div class="alert bg-secondary text-white text-center m-0">
          You'll receive a Permission-NFT for this department. It allows you to:
          <div
            class="alert border border-light bg-white text-muted text-center rounded-xl"
            style="margin: 1rem -1.25rem"
          >
            <div class="d-flex justify-content-center mb-2">
              <GithubUser :from-address="account" :force-show-address="true" />
            </div>
            <div style="margin-left: -1.25rem; margin-right: -1.25rem">
              <NFTPermissions :perms="[true, true, true, true]" />
              <NFTPermissionLabels />
            </div>
          </div>
          Manage permissions in your wallet and the governance dashboard.
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
              : 'Create Department'
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
    ...mapGetters(['githubUser', 'account']),
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
          this.organization = null
          const owner = repoParts[1]
          const repo = repoParts[2]
          this.loadingProject = true
          this.repository = null
          this.$github
            .getRepository(owner, repo)
            .then((repository) => {
              this.repository = repository
            })
            .catch(() => {
              this.repository = null
            })
            .finally(() => (this.loadingProject = false))
        } else if (orgParts) {
          this.repository = null
          const name = orgParts[1]
          this.loadingProject = true
          this.organization = null
          this.$github
            .getOrganizationByName(name)
            .then((organization) => {
              this.organization = organization
            })
            .catch(() => {
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
          this.octobay.methods.createGovernanceToken,
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
