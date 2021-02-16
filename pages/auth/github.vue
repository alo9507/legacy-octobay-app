<template>
  <h1 class="loader text-white">
    <span class="loader__dot">.</span>
    <span class="loader__dot">.</span>
    <span class="loader__dot">.</span>
  </h1>
</template>

<script>
export default {
  layout: 'auth',
  mounted() {
    const code = this.$route.query.code
    if (code) {
      this.$axios
        .$post(process.env.API_URL + '/github/access-token', { code })
        .then((response) => {
          if (response.accessToken) {
            localStorage.setItem('github_access_token', response.accessToken)
            this.$store.dispatch('github/login').finally(() => {
              this.$router.push('/')
            })
          }
        })
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
