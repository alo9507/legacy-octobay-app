<template>
  <div
    class="embed border rounded-xl px-2 pb-3 mb-2"
    style="margin-top: -56px; padding-top: 56px"
  >
    <div class="d-flex justify-content-between align-items-center">
      <a :href="discussion.url" target="_blank" class="text-truncate text-dark">
        <b>{{ discussion.title }}</b>
      </a>
      <div
        v-clipboard="getDirectLink(discussion.title)"
        v-clipboard:success="copiedDirectLink"
        v-tooltip="{
          content: 'Direct link',
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
    </div>
    <small class="text-muted mt-1 d-flex justify-content-between">
      created
      {{ discussion.createdAt | moment('MMM Do YYYY') }}
    </small>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import helpers from '@/mixins/helpers'

export default {
  mixins: [helpers],
  props: {
    discussion: {
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
    getDirectLink() {
      return `${window.location.origin}/#/d/`
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
