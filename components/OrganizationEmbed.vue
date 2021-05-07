<template>
  <div
    class="embed border rounded-xl px-2 pb-3 mb-2"
    style="margin-top: -56px; padding-top: 56px"
  >
    <div class="d-flex justify-content-between align-items-center">
      <a
        :href="organization.url"
        target="_blank"
        class="text-truncate text-dark"
        :title="organization.name"
      >
        <b>{{ organization.name }}</b>
      </a>
      <small class="text-muted ml-auto mr-2">
        <span
          v-tooltip="{ content: 'Repositories', trigger: 'hover' }"
          class="mr-1"
        >
          <font-awesome-icon :icon="['fas', 'book']" />
          {{ organization.repositories.totalCount }}
        </span>
        <span v-tooltip="{ content: 'Members', trigger: 'hover' }">
          <font-awesome-icon :icon="['fas', 'users']" />
          {{ organization.membersWithRole.totalCount }}
        </span>
      </small>
      <div
        v-clipboard="getDirectLink(organization.name)"
        v-clipboard:success="copiedDirectLink"
        v-tooltip="{
          content: 'Send link',
          trigger: 'hover',
        }"
        class="btn btn-sm btn-light mr-1"
      >
        <transition name="fade" mode="out-in">
          <span v-if="copyDirectLinkSuccess" class="text-muted">
            copied
            <font-awesome-icon
              :icon="['fas', 'check']"
              class="text-success"
              fixed-width
            />
          </span>
          <font-awesome-icon
            v-else
            :icon="['fas', 'share-alt']"
            class="text-muted"
            fixed-width
          />
        </transition>
      </div>
      <a
        v-if="organization.twitterUsername"
        :href="'https://twitter.com/' + organization.twitterUsername"
        target="_blank"
        class="btn btn-sm btn-light text-muted"
      >
        <font-awesome-icon :icon="['fab', 'twitter']" fixed-width />
      </a>
    </div>
    <small class="text-muted mt-1 d-flex justify-content-between">
      created
      {{ organization.createdAt | moment('MMM Do YYYY') }}
    </small>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import helpers from '@/mixins/helpers'

export default {
  mixins: [helpers],
  props: {
    organization: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      copyDirectLinkSuccess: false,
    }
  },
  computed: {
    ...mapGetters('github', { githubUser: 'user' }),
  },
  methods: {
    getDirectLink(orgname) {
      return `${window.location.origin}/#/o/${orgname}/1.5`
    },
    copiedDirectLink() {
      this.copyDirectLinkSuccess = true
      setTimeout(() => {
        this.copyDirectLinkSuccess = false
      }, 1000)
    },
  },
}
</script>
