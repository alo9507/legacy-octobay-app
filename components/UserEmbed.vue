<template>
  <div
    class="border rounded-xl px-1"
    style="margin-top: -56px; padding-top: 56px"
  >
    <div class="embed rounded-top pb-3 px-2">
      <div class="d-flex justify-content-between">
        <div class="d-flex">
          <GithubAvatar
            :profile-url="user.url"
            :avatar-url="user.avatarUrl"
            size="1.5rem"
          />
          <b class="text-nowrap text-truncate">{{ user.name }}</b>
        </div>
        <div class="text-nowrap">
          <div
            v-clipboard="getDirectLink(user.login)"
            v-clipboard:success="copiedDirectLink"
            v-tooltip="{
              content: 'Direct link',
              trigger: 'hover',
            }"
            class="btn btn-sm btn-light"
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
          <div
            v-if="address"
            v-clipboard="address"
            v-clipboard:success="copiedAddress"
            v-tooltip="{
              content: address.substr(0, 12) + '...' + address.substr(32),
              trigger: 'hover',
            }"
            class="btn btn-sm btn-light"
          >
            <transition name="fade" mode="out-in">
              <span v-if="copyAddressSuccess" class="text-muted">
                copied
                <font-awesome-icon
                  :icon="['fas', 'check']"
                  class="text-success"
                  fixed-width
                />
              </span>
              <font-awesome-icon
                v-else
                :icon="['fab', 'ethereum']"
                class="text-muted"
                fixed-width
              />
            </transition>
          </div>
          <a
            v-if="user.email"
            :href="'mailto:' + user.email"
            class="btn btn-sm btn-light text-muted"
          >
            <font-awesome-icon :icon="['fas', 'envelope']" fixed-width />
          </a>
          <a
            v-if="user.twitterUsername"
            :href="'https://twitter.com/' + user.twitterUsername"
            target="_blank"
            class="btn btn-sm btn-light text-muted"
          >
            <font-awesome-icon :icon="['fab', 'twitter']" fixed-width />
          </a>
          <a
            v-if="user.websiteUrl"
            :href="user.websiteUrl"
            target="_blank"
            class="btn btn-sm btn-light text-muted"
          >
            <font-awesome-icon :icon="['fas', 'globe-americas']" fixed-width />
          </a>
        </div>
      </div>
      <small class="d-flex justify-content-between text-muted mt-1">
        <span>GitHub user since:</span>
        <span>{{ user.createdAt | moment('MMMM Do YYYY') }}</span>
      </small>
      <small class="d-flex justify-content-between text-muted mt-1">
        <span>Last seen:</span>
        <span>{{ $moment(user.updatedAt).fromNow() }}</span>
      </small>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: null,
    },
    address: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      copyAddressSuccess: false,
      copyDirectLinkSuccess: false,
    }
  },
  methods: {
    getDirectLink(username) {
      return `${window.location.origin}${window.location.pathname}#/u/${username}/1.5`
    },
    copiedAddress() {
      this.copyAddressSuccess = true
      setTimeout(() => {
        this.copyAddressSuccess = false
      }, 1000)
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
