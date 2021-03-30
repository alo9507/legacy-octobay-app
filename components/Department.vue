<template>
  <div>
    <div
      v-if="!loading && projectNode"
      :class="['issue d-flex flex-column', { showDetails }]"
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
            <small class="text-muted text-truncate">
              {{ department.address }}
            </small>
            <div class="mt-2 d-flex justify-content-between">
              <small class="text-muted text-center">
                Current supply: 10,000
              </small>
              <small class="text-muted text-center">Holders: 20</small>
              <small class="text-muted text-center">Median holdings: 315</small>
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
          <div class="w-100 px-3">
            <transition name="fade" mode="out-in">
              <!-- holders -->
              <div v-if="action === 'holders'" key="holders" class="py-3">
                <div v-if="department.holders.length">
                  <div
                    v-for="holder in department.holders"
                    :key="holder.id"
                    class="d-flex justify-content-between"
                  >
                    <small>
                      <b>{{ holder.githubUserId }}</b
                      ><br />
                      <AddressShort
                        :address="holder.address"
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
              <div v-if="action === 'nfts'" key="nfts" class="py-3">
                <div v-if="department.nfts.length">
                  <small class="d-block">
                    <table class="w-100">
                      <tr>
                        <th></th>
                        <th class="text-center">Manage<br />Settings</th>
                        <th class="text-center">Create<br />Proposals</th>
                        <th></th>
                      </tr>
                      <tr v-for="nft in department.nfts" :key="nft.id">
                        <td>
                          <b>{{ nft.githubUserId }}</b>
                          <br />
                          <AddressShort
                            :address="nft.owner"
                            class="text-muted"
                          />
                        </td>
                        <td class="text-center"><input type="checkbox" /></td>
                        <td class="text-center"><input type="checkbox" /></td>
                        <td class="text-right">
                          <button
                            v-tooltip="{ content: 'Save', trigger: 'hover' }"
                            class="btn btn-sm btn-primary shadow-sm"
                          >
                            <font-awesome-icon :icon="['fas', 'check']" />
                          </button>
                          <button
                            v-tooltip="{ content: 'Burn', trigger: 'hover' }"
                            class="btn btn-sm btn-primary shadow-sm"
                          >
                            <font-awesome-icon :icon="['fas', 'fire']" />
                          </button>
                        </td>
                      </tr>
                    </table>
                  </small>
                </div>
                <div v-else class="text-muted text-center">
                  <small>No Permission-NFTs yet.</small>
                </div>
                <button
                  class="btn btn-sm btn-primary w-100 mt-2 shadow-sm"
                  @click="newNFT()"
                >
                  New Permission-NFT
                </button>
              </div>
              <!-- settings -->
              <div v-if="action === 'settings'" key="settings" class="py-3">
                <div class="d-flex align-items-end">
                  <div class="mr-1">
                    <small class="d-flex">Shares to create proposals</small>
                    <input
                      v-model="requiredSharesToCreateProposals"
                      type="text"
                      class="form-control form-control-sm form-control-with-embed mb-2"
                      placeholder="1-100 %"
                    />
                  </div>
                  <div class="ml-1">
                    <small class="d-flex">Default Quorum</small>
                    <input
                      v-model="defaultQuorum"
                      type="text"
                      class="form-control form-control-sm form-control-with-embed mb-2"
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
      defaultQuorum: 0,
    }
  },
  computed: {
    ...mapGetters(['account', 'registeredAccount', 'oracles']),
    ...mapGetters('github', {
      githubUser: 'user',
      githubAccessToken: 'accessToken',
    }),
  },
  mounted() {
    this.requiredSharesToCreateProposals =
      this.department.requiredSharesToCreateProposals / 100
    this.defaultQuorum = this.department.defaultQuorum / 100
    this.loading = true
    this.loadProjectById(this.department.project.id)
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
  },
}
</script>

<style lang="sass" scoped>
.issue
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
