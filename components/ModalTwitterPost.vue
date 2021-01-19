<template>
  <div class="card shadow-sm d-flex flex-column" @click.stop>
    <div v-if="octobayTwitterAccount">
      <div class="card-body p-2 modal-body flex-fill">
        <h5 class="text-center text-muted-light py-3 px-4 m-0">
          Share this issue on Twitter<br>
          with
          <span class="text-dark font-weight-bold">{{ octobayTwitterAccount.followers_count }}</span>
          followers.
        </h5>
        <div class="pt-3 pb-4 d-flex">
          <div>
            <div class="avatar rounded-circle" :style="`background-image: url(${octobayTwitterAccount.profile_image_url})`"></div>
          </div>
          <div class="ml-2">
            <div>
              <b>{{ octobayTwitterAccount.name }}</b>
              <span class="text-muted">
                @{{ octobayTwitterAccount.screen_name }}
                {{ $moment(new Date()).format("MMM D, YYYY") }}
              </span>
            </div>
            2.5 <a href="#">#ETH</a> for solving this issue: <a href="#">https://github.com/mktcode/octobay/issues/30</a> <a href="#">#ethereum</a> <a href="#">#github</a> <a href="#">#opensource</a>
          </div>
        </div>
        <div>
          <small v-if="octobayTwitterAccount.followers_count > octoPinBalance" class="text-muted text-center mb-2 d-block">
            Insufficiant balance. You need {{ octobayTwitterAccount.followers_count }} OPIN tokens to post on Twitter. <a href="https://app.uniswap.org" target="_blank">Buy OPIN on Uniswap.</a>
          </small>
          <button class="btn btn-twitter btn-lg shadow-sm w-100" :disabled="postingTweet || octobayTwitterAccount.followers_count > octoPinBalance" @click="tweet()">
            <font-awesome-icon :icon="['fas', 'circle-notch']" spin class="ml-2" v-if="postingTweet" />
            <span v-else>
              <font-awesome-icon :icon="['fab', 'twitter']" class="mr-1" />
              Post on Twitter ({{ octobayTwitterAccount.followers_count }} OPIN)
            </span>
          </button>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="text-center my-5"><font-awesome-icon :icon="['fas', 'circle-notch']" spin class="text-muted-light fa-2x" /></div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.avatar
  width: 49px
  height: 49px
  background-size: 100%
</style>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      octobayTwitterAccount: null,
      postingTweet: false
    }
  },
  computed: {
    ...mapGetters(['octoPinBalance', 'oracles', 'account'])
  },
  mounted() {
    this.$axios.$get(process.env.API_URL + '/twitter-user/1333035957805862915').then(account => {
      this.octobayTwitterAccount = account
    })
  },
  methods: {
    tweet() {
      this.postingTweet = true
      this.$octoBay.methods.updateTwitterFollowersAndPost(this.oracles[0].address, 'MDU6SXNzdWU3ODY4MzI2NjQ=').send({
        // useGSN: false,
        from: this.account
      }).then(tweetRequest => {
        this.postingTweet = false
      }).catch(() => this.postingTweet = false)
    }
  }
}
</script>
