<template>
  <div>
    <div v-if="githubUser" class="d-flex align-items-center">
      <GithubAvatar
        :profile-url="githubUser.url"
        :avatar-url="githubUser.avatarUrl"
      />
      <div class="d-flex flex-column">
        <a :href="githubUser.url" target="_blank" class="font-weight-bold">
          {{ githubUser.login }}
        </a>
        <a
          v-if="fromAddress && forceShowAddress"
          :href="`https://etherscan.com/address/${fromAddress}`"
          target="_blank"
          class="d-flex text-muted"
        >
          <small><AddressShort :address="fromAddress" /></small>
        </a>
      </div>
    </div>
    <div v-else-if="fromAddress">
      <a
        :href="`https://etherscan.com/address/${fromAddress}`"
        target="_blank"
        class="font-weight-bold"
      >
        <AddressShort :address="fromAddress" />
      </a>
    </div>
    <div v-else>
      <font-awesome-icon
        :icon="['fas', 'circle-notch']"
        spin
        class="text-muted-light"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    githubUserId: {
      type: String,
      default: '',
    },
    fromAddress: {
      type: String,
      default: '',
    },
    forceShowAddress: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      githubUser: null,
    }
  },
  mounted() {
    if (this.githubUserId) {
      this.$github.getUserById(this.githubUserId).then((githubUser) => {
        this.githubUser = githubUser
      })
    } else if (this.fromAddress) {
      this.$subgraph.getUserAddress(this.fromAddress).then((userAddress) => {
        if (userAddress) {
          this.$github.getUserById(userAddress.user.id).then((githubUser) => {
            this.githubUser = githubUser
          })
        }
      })
    }
  },
}
</script>
