<template>
  <div>
    <div
      v-if="!loading && projectNode"
      :class="['department d-flex flex-column', { showDetails }]"
      @click="showDetails = !showDetails"
    >
      <div class="position-relative">
        <!-- header -->
        <div class="d-flex flex-column align-items-top px-3 py-2">
          <div
            :class="['d-flex flex-column', { 'text-truncate': !showDetails }]"
          >
            <small class="text-muted text-truncate">
              <small>
                {{ projectNode.owner }}/{{ projectNode.repository }}
              </small>
            </small>
            <div :class="{ 'text-truncate': !showDetails }">
              <b>{{ department.name }}</b>
              <small class="text-muted">({{ department.symbol }})</small>
            </div>
          </div>
          <div v-if="showDetails" class="d-flex flex-column">
            <div
              v-clipboard="department.tokenAddress"
              v-clipboard:success="copiedAddress"
              class="text-muted text-truncate btn btn-sm bg-white shadow-xs font-weight-normal mt-2 mb-1"
              @click.stop
            >
              <small class="d-flex justify-content-between align-items-center">
                <AddressShort
                  :address="department.tokenAddress"
                  length="long"
                />
                <transition name="fade" mode="out-in">
                  <font-awesome-icon
                    v-if="copyAddressSuccess"
                    key="check"
                    :icon="['fas', 'check']"
                    class="text-success"
                  />
                  <font-awesome-icon
                    v-else
                    key="copy"
                    :icon="['far', 'copy']"
                  />
                </transition>
              </small>
            </div>
            <div class="mt-2 d-flex justify-content-between">
              <small class="text-muted text-center">
                Current supply<br />
                <b>
                  <span v-if="totalSupply !== null">
                    {{ $web3.utils.fromWei(totalSupply, 'ether') }}
                  </span>
                  <font-awesome-icon
                    v-else
                    :icon="['fas', 'circle-notch']"
                    spin
                  />
                </b>
              </small>
              <small class="text-muted text-center">
                Holders<br />
                <b>{{ department.holders.length }}</b>
              </small>
              <small class="text-muted text-center">
                Average holdings<br />
                <b v-if="department.holders.length">
                  {{
                    (
                      Number($web3.utils.fromWei(totalSupply, 'ether')) /
                      department.holders.length
                    ).toFixed(0)
                  }}
                </b>
                <b v-else>0</b>
              </small>
            </div>
          </div>
        </div>
      </div>
      <!-- details -->
      <transition name="fade">
        <div
          v-if="showDetails"
          :class="[
            'd-flex flex-column justify-content-start align-items-center',
          ]"
          style="cursor: default"
          @click.stop
        >
          <!-- details buttons -->
          <div
            class="border-top border-bottom w-100 py-2 text-nowrap d-flex justify-content-between align-items-center px-4"
          >
            <!-- Proposals -->
            <button
              v-tooltip="{ content: 'Proposals', trigger: 'hover' }"
              class="btn btn-sm btn-light text-muted"
              @click="showProposals()"
            >
              <font-awesome-icon :icon="['fas', 'comments']" />
            </button>
            <!-- Holders -->
            <button
              v-tooltip="{ content: 'Token Holders', trigger: 'hover' }"
              :class="[
                'btn btn-sm btn-light text-muted',
                { active: action === 'holders' },
              ]"
              @click="changeAction('holders')"
            >
              <font-awesome-icon :icon="['fas', 'users']" />
            </button>
            <!-- Permissions NFTs -->
            <button
              v-tooltip="{ content: 'Permission NFTs', trigger: 'hover' }"
              :class="[
                'btn btn-sm btn-light text-muted',
                { active: action === 'nfts' },
              ]"
              @click="changeAction('nfts')"
            >
              <font-awesome-icon :icon="['fas', 'key']" />
            </button>
            <!-- Settings -->
            <button
              v-tooltip="{ content: 'Settings', trigger: 'hover' }"
              :class="[
                'btn btn-sm btn-light text-muted',
                { active: action === 'settings' },
              ]"
              @click="changeAction('settings')"
            >
              <font-awesome-icon :icon="['fas', 'cog']" />
            </button>
          </div>
          <!-- details content -->
          <div class="w-100">
            <transition name="fade" mode="out-in">
              <!-- holders -->
              <div v-if="action === 'holders'" key="holders" class="p-3">
                <div v-if="department.holders.length">
                  <div
                    v-for="holder in department.holders"
                    :key="holder.id"
                    class="d-flex justify-content-between"
                  >
                    <small>
                      <AddressShort
                        :address="holder.ethAddress"
                        class="text-muted"
                      />
                    </small>
                    <small>
                      {{ $web3.utils.fromWei(holder.balance, 'ether') }}
                      {{ department.symbol }}
                    </small>
                  </div>
                </div>
                <div v-else class="text-muted text-center">
                  <small>No token holders yet.</small>
                </div>
              </div>
              <!-- nfts -->
              <div v-if="action === 'nfts'" key="nfts" class="pt-3">
                <div class="px-3 pb-3 border-bottom-light">
                  <button
                    class="btn btn-sm btn-primary w-100 shadow-sm"
                    @click="newNFT()"
                  >
                    New Permission-NFT
                  </button>
                </div>
                <div v-if="department.nfts.length">
                  <div
                    class="d-flex w-100 justify-content-around align-items-center text-center py-2 px-3"
                  >
                    <small class="w-25">Create<br />NFTs</small>
                    <small class="w-25">Transfer</small>
                    <small class="w-25">Bounty<br />Minting</small>
                    <small class="w-25">Create<br />Proposals</small>
                  </div>
                  <div
                    v-for="(nft, i) in department.nfts"
                    :key="nft.id"
                    class="py-2 border-top-light"
                  >
                    <div
                      class="d-flex justify-content-center align-items-center pb-2"
                    >
                      <small class="mr-1">
                        <GithubUser
                          :from-address="nft.ownerAddress"
                          :force-show-address="true"
                        />
                      </small>
                      <div class="btn-group shadow-sm rounded-xl ml-1">
                        <button
                          v-tooltip="{ content: 'Save', trigger: 'hover' }"
                          class="btn btn-sm btn-primary"
                        >
                          <font-awesome-icon :icon="['fas', 'check']" />
                        </button>
                        <button
                          v-tooltip="{ content: 'Transfer', trigger: 'hover' }"
                          class="btn btn-sm btn-primary"
                        >
                          <font-awesome-icon :icon="['fas', 'share']" />
                        </button>
                        <button
                          v-tooltip="{ content: 'Copy', trigger: 'hover' }"
                          class="btn btn-sm btn-primary"
                        >
                          <font-awesome-icon :icon="['fas', 'copy']" />
                        </button>
                        <button
                          v-tooltip="{ content: 'Burn', trigger: 'hover' }"
                          class="btn btn-sm btn-primary"
                        >
                          <font-awesome-icon :icon="['fas', 'fire']" />
                        </button>
                      </div>
                    </div>
                    <div
                      class="d-flex justify-content-around align-items-center px-3"
                    >
                      <div class="text-center py-2 w-25">
                        <div class="custom-control custom-switch ml-2">
                          <input
                            :id="'customSwitch1-' + i"
                            type="checkbox"
                            class="custom-control-input"
                            :checked="nft.permissions.includes('MINT')"
                          />
                          <label
                            class="custom-control-label"
                            :for="'customSwitch1-' + i"
                          ></label>
                        </div>
                      </div>
                      <div class="text-center py-2 w-25">
                        <div class="custom-control custom-switch ml-2">
                          <input
                            :id="'customSwitch2-' + i"
                            type="checkbox"
                            class="custom-control-input"
                            :checked="nft.permissions.includes('TRANSFER')"
                          />
                          <label
                            class="custom-control-label"
                            :for="'customSwitch2-' + i"
                          ></label>
                        </div>
                      </div>
                      <div class="text-center py-2 w-25">
                        <div class="custom-control custom-switch ml-2">
                          <input
                            :id="'customSwitch3-' + i"
                            type="checkbox"
                            class="custom-control-input"
                            :checked="
                              nft.permissions.includes('SET_ISSUE_GOVTOKEN')
                            "
                          />
                          <label
                            class="custom-control-label"
                            :for="'customSwitch3-' + i"
                          ></label>
                        </div>
                      </div>
                      <div class="text-center py-2 w-25">
                        <div class="custom-control custom-switch ml-2">
                          <input
                            :id="'customSwitch4-' + i"
                            type="checkbox"
                            class="custom-control-input"
                            :checked="
                              nft.permissions.includes('CREATE_PROPOSAL')
                            "
                          />
                          <label
                            class="custom-control-label"
                            :for="'customSwitch4-' + i"
                          ></label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-muted text-center">
                  <small>No Permission-NFTs yet.</small>
                </div>
              </div>
              <!-- settings -->
              <div v-if="action === 'settings'" key="settings" class="p-3">
                <div class="d-flex align-items-end">
                  <div class="mr-1">
                    <small class="d-block text-center mb-2">
                      Shares to<br />create proposals
                    </small>
                    <input
                      v-model="requiredSharesToCreateProposals"
                      type="text"
                      class="form-control form-control-sm form-control-with-embed mb-2 w-50 mx-auto"
                      placeholder="1-100 %"
                    />
                  </div>
                  <div class="ml-1">
                    <small class="d-block text-center mb-2">
                      Minimum<br />Quorum
                    </small>
                    <input
                      v-model="minQuorum"
                      type="text"
                      class="form-control form-control-sm form-control-with-embed mb-2 w-50 mx-auto"
                      placeholder="1-100 %"
                    />
                  </div>
                </div>
                <button class="btn btn-sm btn-primary w-100 mt-2 shadow-sm">
                  Save
                </button>
              </div>
            </transition>
          </div>
        </div>
      </transition>
    </div>
    <div
      v-else-if="loading"
      class="d-flex justify-content-center p-4 m-3 rounded-lg"
    >
      <font-awesome-icon
        :icon="['fas', 'circle-notch']"
        spin
        class="text-muted-light"
      />
    </div>
    <div
      v-else-if="!loading && !projectNode"
      class="d-flex justify-content-center p-3 rounded-lg"
    >
      <small class="text-muted d-block text-center border rounded-xl px-3 py-1">
        <small
          ><font-awesome-icon :icon="['fas', 'exclamation-triangle']"
        /></small>
        Project not found.
      </small>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import loadFromGithub from '@/mixins/loadFromGithub'
import helpers from '@/mixins/helpers'

export default {
  mixins: [loadFromGithub, helpers],
  props: {
    department: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      projectNode: null,
      showDetails: false,
      action: null,
      loading: false,
      requiredShareToCreateProposals: 0,
      minQuorum: 0,
      totalSupply: null,
      copyAddressSuccess: false,
    }
  },
  computed: {
    ...mapGetters(['account', 'oracles']),
    ...mapGetters('github', {
      githubUser: 'user',
      githubAccessToken: 'accessToken',
    }),
  },
  mounted() {
    this.requiredSharesToCreateProposals =
      this.department.requiredSharesToCreateProposals / 100
    this.minQuorum = this.department.minQuorum / 100
    this.loading = true
    this.loadProjectById(this.department.projectId)
      .then((project) => {
        if (project) {
          this.projectNode = {
            id: project.id,
            owner: 'octobay',
            repository: 'app',
            title: 'Security',
          }
        }
      })
      .finally(() => (this.loading = false))

    this.$octobayGovToken(this.department.tokenAddress)
      .methods.totalSupply()
      .call()
      .then((totalSupply) => {
        this.totalSupply = totalSupply
      })
  },
  methods: {
    showProposals() {
      this.$store.commit('setView', 'proposals')
      this.$store.commit('setSelectedDepartment', this.department)
    },
    newNFT() {
      this.$store.commit('setModalData', null)
      this.$store.commit('setModalComponent', 'ModalNewNFT')
      this.$store.commit('setShowModal', true)
    },
    changeAction(action) {
      if (this.action === action) {
        this.action = null
      } else {
        this.action = action
      }
    },
    copiedAddress() {
      this.copyAddressSuccess = true
      setTimeout(() => {
        this.copyAddressSuccess = false
      }, 1000)
    },
  },
}
</script>

<style lang="sass" scoped>
.department
  border-top: solid 1px fff
  cursor: pointer
  position: relative
  &:hover
    background: #f8f8f8
  &.showDetails
    background: #f8f8f8
    box-shadow: inset 0 0 7px rgba(0, 0, 0, 0.2)
    .details
      max-height: 40px
      cursor: default
      &.action
        max-height: 100px
      &.deposits
        max-height: 350px

.avatar
  border: solid 2px ccc
  border-radius: 50%
  width: 32px
  height: 32px
  background-repeat: no-repeat
  background-position: center center
  background-size: 100%
</style>
