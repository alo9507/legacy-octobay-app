<template>
  <div class="my-auto text-center">
    <div v-if="error">
      <h3 class="text-secondary mt-5 mb-0">Oops.</h3>
      <div class="text-muted">There was an error.</div>
      <nuxt-link to="/" class="btn btn-secondary mt-3">Back to App</nuxt-link>
    </div>
    <div v-else>
      <h3 class="text-secondary mt-5 mb-0">One moment please.</h3>
      <div class="text-muted">You will be redirected.</div>
      <h1 class="text-muted-lightest mt-3">
        <font-awesome-icon :icon="['fas', 'circle-notch']" spin />
      </h1>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'auth',
  data() {
    return {
      error: false,
    }
  },
  mounted() {
    const code = this.$route.query.code
    if (code) {
      this.$axios
        .$post(process.env.API_URL + '/github/access-token', { code })
        .then((response) => {
          if (response.accessToken) {
            setTimeout(() => {
              localStorage.setItem('github_access_token', response.accessToken)
              this.$store.dispatch('github/login').finally(() => {
                this.$router.push('/')
              })
            }, 1000)
          } else {
            this.error = true
          }
        })
        .catch(() => (this.error = true))
    }
  },
}
</script>

<style lang="sass">
.loader__dot
  animation: 1s blink infinite
.loader__dot:nth-child(2)
  animation-delay: 250ms
.loader__dot:nth-child(3)
  animation-delay: 500ms
</style>
