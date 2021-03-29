<template>
  <div>
    <div
      v-if="!loading && projectNode"
      :class="['issue d-flex flex-column', { showDetails }]"
      @click="showDetails = !showDetails"
    >
      <div class="position-relative">
        <!-- header -->
        <div class="d-flex align-items-top px-3 py-2">
          <div :class="{ 'text-truncate': !showDetails }">
            <small class="text-muted text-truncate">
              <small>
                {{ projectNode.owner }}/{{ projectNode.repository }}
              </small>
            </small>
            <div :class="{ 'text-truncate': !showDetails }">
              <b>{{ projectNode.title }}</b>
            </div>
            <small class="text-muted text-truncate">
              <small>
                {{ department.address }}
              </small>
            </small>
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
                List of token holders
              </div>
              <!-- nfts -->
              <div v-if="action === 'nfts'" key="nfts" class="py-3">
                List of permission NFTs
              </div>
              <!-- settings -->
              <div v-if="action === 'settings'" key="settings" class="py-3">
                Token settings
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
