<template>
  <div>
    <div v-if="githubUser" class="d-flex align-items-center">
      <a
        :href="githubUser.url"
        target="_blank"
        class="rounded-circle avatar mr-1 shadow-sm"
        :style="`width: 18px; height: 18px; background-image: url(${githubUser.avatarUrl})`"
      ></a>
      <a :href="githubUser.url" target="_blank" class="font-weight-bold">
        {{ githubUser.login }}
      </a>
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
  },
  data() {
    return {
      githubUser: null,
    }
  },
  mounted() {
    if (this.githubUserId) {
      this.$axios
        .$get(process.env.API_URL + '/github/user-by-id/' + this.githubUserId)
        .then((githubUser) => {
          if (githubUser) {
            this.githubUser = githubUser
          }
        })
    } else if (this.fromAddress) {
      this.$axios
        .$get(
          process.env.API_URL + '/graph/user-by-address/' + this.fromAddress
        )
        .then((githubUserId) => {
          if (githubUserId) {
            this.$axios
              .$get(process.env.API_URL + '/github/user-by-id/' + githubUserId)
              .then((githubUser) => {
                if (githubUser) {
                  this.githubUser = githubUser
                }
              })
          }
        })
    }
  },
}
</script>
