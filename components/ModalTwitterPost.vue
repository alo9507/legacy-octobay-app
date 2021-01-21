<template>
  <div class="card shadow-sm d-flex flex-column" @click.stop>
    <div v-if="octobayTwitterAccount && issue">
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
            {{ depositAmount }} <a href="#">#ETH</a> for solving this issue:
            <a :href="`https://github.com/${issue.owner}/${issue.repository}/issues/${issue.number}`" target="_blank">https://github.com/{{ issue.owner }}/{{ issue.repository }}/issues/{{ issue.number }}</a>
            <a href="https://twitter.com/hashtag/ethereum" target="_blank">#ethereum</a>
            <a href="https://twitter.com/hashtag/github" target="_blank">#github</a>
            <a href="https://twitter.com/hashtag/opensource" target="_blank">#opensource</a>
          </div>
        </div>
        <div>
          <small v-if="octobayTwitterAccount.followers_count > octoPinBalance" class="text-muted text-center mb-2 d-block">
            Insufficiant balance. You need {{ octobayTwitterAccount.followers_count }} OPIN tokens to post on Twitter. <a href="https://app.uniswap.org" target="_blank">Buy OPIN on Uniswap.</a>
          </small>
          <transition name="fade" mode="out-in">
            <div v-if="tweetId">
              <a :href="'https://twitter.com/OctoBayApp/status/' + tweetId" target="_blank" class="d-flex justify-content-between align-items-center btn btn-twitter btn-lg shadow-sm w-100">
                <font-awesome-icon :icon="['fab', 'twitter']" class="mr-auto" />
                Show Tweet
                <font-awesome-icon :icon="['fas', 'check']" class="ml-auto" />
              </a>
            </div>
            <button v-else class="btn btn-twitter btn-lg shadow-sm w-100" :disabled="requestingTweet || postingTweet || octobayTwitterAccount.followers_count > octoPinBalance" @click="tweet()">
              <span v-if="requestingTweet">
                <font-awesome-icon :icon="['fas', 'circle-notch']" spin class="ml-2" />
                Waiting for confirmation...
              </span>
              <span v-else-if="postingTweet">
                <font-awesome-icon :icon="['fas', 'circle-notch']" spin class="ml-2" />
                Posting to Twitter...
              </span>
              <span v-else class="d-flex justify-content-between align-items-center">
                <font-awesome-icon :icon="['fab', 'twitter']" class="mr-2" />
                <span class="pl-3">Post on Twitter</span>
                <small>{{ octobayTwitterAccount.followers_count }} OPIN</small>
              </span>
            </button>
          </transition>
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
      depositAmount: 0,
      requestingTweet: false,
      postingTweet: false,
      tweetId: null
    }
  },
  computed: {
    ...mapGetters(['octoPinBalance', 'oracles', 'account']),
    ...mapGetters({ issue: 'modalData' })
  },
  mounted() {
    this.$axios.$get(process.env.API_URL + '/twitter-user/1333035957805862915').then(account => {
      this.octobayTwitterAccount = account
    })

    this.$octoBay.methods.issueDepositsAmountByIssueId(this.issue.id).call().then(depositAmount => {
      this.depositAmount = this.$web3.utils.fromWei(depositAmount, 'ether')
    })
  },
  methods: {
    tweet() {
      const confirmListener = this.$octoBay.events.TwitterPost().on('data', event => {
        if (event.returnValues.issueId === this.issue.id) {
          // stop listening and finish process
          confirmListener.unsubscribe()
          this.tweetId = this.$web3.utils.hexToAscii(event.returnValues.tweetId)
          this.postingTweet = false
        }
      })

      this.requestingTweet = true
      this.$octoBay.methods.updateTwitterFollowersAndPost(this.oracles[0].address, this.issue.id).send({
        // useGSN: false,
        from: this.account
      }).then(() => {
        this.requestingTweet = false
        this.postingTweet = true
      }).catch(() => this.requestingTweet = false)
    }
  }
}
</script>
