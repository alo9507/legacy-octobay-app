<template>
  <div>
    <div v-if="!loading && issueNode" :class="['issue d-flex flex-column', { 'pinned': issue.boostAmount > 0, showDetails }]" @click="showDetails = !showDetails">
      <div>
        <div class="bg-success" :style="`height: 5px; width: ${(Math.min(issue.depositAmount / fundingGoal * 100, 100)).toFixed(2)}%`"></div>
      </div>
      <div class="d-flex align-items-top px-3 py-2">
        <div :class="{ 'text-truncate': !showDetails }">
          <small class="text-muted text-truncate">
            <small>
              <span v-if="issue.boostAmount">
                <svg style="width:14px;height:14px" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12M8.8,14L10,12.8V4H14V12.8L15.2,14H8.8Z" />
                </svg>
              </span>
              {{ issueNode.owner }}/{{ issueNode.repository }}/issues/{{ issueNode.number }}
            </small>
          </small>
          <div :class="{ 'text-truncate': !showDetails }">
            {{ issueNode.title }}
          </div>
        </div>
        <div class="text-nowrap text-right ml-auto pl-3">
          <div class="mb-0 d-flex align-items-center" @click.stop>
            <div class="text-center d-flex flex-column">
              <small class="text-muted">
                <small>
                  <font-awesome-icon :icon="['fas', 'check']" v-if="issue.depositAmount >= fundingGoal" class="text-success mr-1" />
                  {{ fundingGoal }} ETH Goal
                </small>
              </small>
              <div>
                {{ $web3.utils.fromWei(issue.depositAmount, 'ether') }} ETH
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="issueNode.primaryLanguage" :class="['px-3 pb-3', { 'text-truncate': !showDetails }]" style="text-overflow: ' ...'">
        <span :class="'mr-1 badge badge-pill' + (brightnessByColor(issueNode.primaryLanguage.color) < 180 ? ' text-white' : '')" :style="'background-color: ' + issueNode.primaryLanguage.color">
          {{ issueNode.primaryLanguage.name }}
        </span><span :class="'mr-1 badge badge-pill' + (brightnessByColor('#' + label.color) < 180 ? ' text-white' : '')" v-for="label in issueNode.labels" :style="'background-color: #' + label.color">
          {{ label.name }}
        </span>
      </div>
      <transition name="fade">
        <div :class="['d-flex flex-column justify-content-start align-items-center', { action: !!action, deposits: action == 'deposits' }]" @click.stop v-if="showDetails" style="cursor: default">
          <div class="border-top border-bottom w-100 py-2 text-nowrap d-flex justify-content-between align-items-center px-4">
            <button class="btn btn-sm btn-light text-muted" @click="fundIssue()" v-tooltip="{ content: 'Fund issue', trigger: 'hover' }">
              <font-awesome-icon :icon="['fas', 'plus']" />
            </button>
            <button :class="['btn btn-sm btn-light text-muted', { active: action === 'deposits' }]" @click="changeAction('deposits')" v-tooltip="{ content: 'Deposits', trigger: 'hover' }">
              <font-awesome-icon :icon="['fas', 'coins']" />
            </button>
            <button class="btn btn-sm btn-light text-muted" @click="twitterPost()" v-tooltip="{ content: 'Post via @OctoBayApp', trigger: 'hover' }">
              <font-awesome-icon :icon="['fab', 'twitter']" />
            </button>
            <button :class="['btn btn-sm btn-light text-muted', { active: action === 'pin' }]" @click="changeAction('pin')" v-tooltip="{ content: 'Pin issue', trigger: 'hover' }">
              <svg style="width:18px;height:18px" viewBox="0 0 24 24">
                <path fill="currentColor" d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12M8.8,14L10,12.8V4H14V12.8L15.2,14H8.8Z" />
              </svg>
            </button>
            <button :class="['btn btn-sm btn-light text-muted', { active: action === 'pull-requests' }]" @click="changeAction('pull-requests')" v-tooltip="{ content: 'Pull Requests', trigger: 'hover' }">
              <svg style="width:19px;height:19px" viewBox="0 0 24 24">
                <path fill="currentColor" d="M6,3A3,3 0 0,1 9,6C9,7.31 8.17,8.42 7,8.83V15.17C8.17,15.58 9,16.69 9,18A3,3 0 0,1 6,21A3,3 0 0,1 3,18C3,16.69 3.83,15.58 5,15.17V8.83C3.83,8.42 3,7.31 3,6A3,3 0 0,1 6,3M6,5A1,1 0 0,0 5,6A1,1 0 0,0 6,7A1,1 0 0,0 7,6A1,1 0 0,0 6,5M6,17A1,1 0 0,0 5,18A1,1 0 0,0 6,19A1,1 0 0,0 7,18A1,1 0 0,0 6,17M21,18A3,3 0 0,1 18,21A3,3 0 0,1 15,18C15,16.69 15.83,15.58 17,15.17V7H15V10.25L10.75,6L15,1.75V5H17A2,2 0 0,1 19,7V15.17C20.17,15.58 21,16.69 21,18M18,17A1,1 0 0,0 17,18A1,1 0 0,0 18,19A1,1 0 0,0 19,18A1,1 0 0,0 18,17Z" />
              </svg>
            </button>
            <a class="btn btn-sm btn-light text-muted" @click :href="'https://github.com/' + issueNode.owner + '/' + issueNode.repository + '/issues/' + issueNode.number" target="_blank" v-tooltip="{ content: 'Open on GitHub', trigger: 'hover' }">
              <font-awesome-icon :icon="['fab', 'github']" />
              <font-awesome-icon :icon="['fas', 'external-link-alt']" class="text-muted-light ml-1" />
            </a>
          </div>
          <div class="w-100 px-3">
            <transition name="fade" mode="out-in">
              <div v-if="action === 'release'" key="release" class="py-3">
                <div class="alert alert-success border-0" v-if="showReleaseSuccess">
                  <button type="button" class="close text-success" @click="showReleaseSuccess = false">
                    <span>&times;</span>
                  </button>
                  <CheckIcon width="24px" height="24px" />
                  <small>Release successful! The GitHub user can now claim the deposits.</small>
                </div>
                <div class="alert alert-danger border-0" v-if="showReleaseError">
                  <button type="button" class="close text-danger" @click="showReleaseError = false">
                    <span>&times;</span>
                  </button>
                  <small>
                    Release failed! You need to be the owner of the repository. If you are, the problem might be on our side.
                    Please let us know on <a href="https://twitter.com/OctoBayApp" target="_blank">Twitter</a> or <a href="https://discord.gg/DhKgHrFeCD" target="_blank">Discord</a>.
                  </small>
                </div>
                <div class="d-flex">
                  <div class="d-flex flex-fill position-relative">
                    <input type="text" class="form-control" placeholder="GitHub user" v-model="releaseTo" />
                    <div v-if="loadingReleaseToUser || releaseToUser" class="position-absolute" style="right: 0; top: 0;">
                      <font-awesome-icon :icon="['fas', 'circle-notch']" spin v-if="loadingReleaseToUser" class="text-muted-light m-2" />
                      <a :href="releaseToUser.url" target="_blank" class="avatar d-block m-1" :style="'background-image: url(' + releaseToUser.avatarUrl + ')'" v-if="releaseToUser"></a>
                    </div>
                  </div>
                  <button class="btn btn-success ml-1 shadow-sm" @click="release()" :disabled="releasing || !releaseToUser">
                    <font-awesome-icon :icon="['fas', 'circle-notch']" spin v-if="releasing" />
                    <span v-else class="text-nowrap">
                      <font-awesome-icon :icon="['fas', 'gavel']" class="mr-1" />
                      release
                    </span>
                  </button>
                </div>
              </div>
              <div v-if="action === 'deposits'" key="deposits" class="py-3">
                <div v-for="(deposit, index) in issue.deposits" :key="index" class="d-flex mb-2 justify-content-between align-items-center">
                  <div class="d-flex flex-column">
                    <h5 class="mb-0">{{ Number($web3.utils.fromWei(deposit.amount, 'ether')) }} <small>ETH</small></h5>
                    <small class="text-muted">
                      From: <AddressShort :address="deposit.from" />
                    </small>
                  </div>
                  <button class="btn btn-primary shadow-sm" v-if="deposit.from === account" @click="refundIssueDeposit(deposit.id)" :disabled="refundingDeposit">
                    <font-awesome-icon :icon="['fas', 'circle-notch']" spin v-if="refundingDeposit === deposit.id" />
                    <span v-else>withdraw</span>
                  </button>
                </div>
              </div>
              <div v-if="action === 'pin'" key="pin" class="py-3">
                <div class="d-flex align-items-center">
                  <div class="select-input flex-fill mr-2">
                    <input type="number" min="0" step="0.01" novalidate class="form-control" placeholder="0.00" v-model="pinAmount" />
                    <span class="text-muted mr-2">OPIN</span>
                  </div>
                  <button class="btn btn-primary shadow-sm text-nowrap" @click="pin()" :disabled="pinningIssue || !Number(pinAmount)">
                    <font-awesome-icon :icon="['fas', 'circle-notch']" spin v-if="pinningIssue" />
                    <span v-else>
                      <svg style="width:18px;height:18px" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12M8.8,14L10,12.8V4H14V12.8L15.2,14H8.8Z" />
                      </svg>
                      Pin
                    </span>
                  </button>
                </div>
              </div>
              <div v-if="action === 'pull-requests'" key="pull-requests" class="py-3">
                <div v-if="linkedPullRequests.length">
                  <a :href="pullRequest.url" target="_blank" v-for="pullRequest in sortedLinkedPullRequests" class="btn btn-light btn-sm btn-block mb-2 d-flex align-items-center">
                    <svg style="width:19px;height:19px" viewBox="0 0 24 24" :class="'text-' + (pullRequest.state == 'MERGED' ? 'merged' : (pullRequest.state == 'CLOSED' ? 'danger' : 'success'))">
                      <path fill="currentColor" d="M6,3A3,3 0 0,1 9,6C9,7.31 8.17,8.42 7,8.83V15.17C8.17,15.58 9,16.69 9,18A3,3 0 0,1 6,21A3,3 0 0,1 3,18C3,16.69 3.83,15.58 5,15.17V8.83C3.83,8.42 3,7.31 3,6A3,3 0 0,1 6,3M6,5A1,1 0 0,0 5,6A1,1 0 0,0 6,7A1,1 0 0,0 7,6A1,1 0 0,0 6,5M6,17A1,1 0 0,0 5,18A1,1 0 0,0 6,19A1,1 0 0,0 7,18A1,1 0 0,0 6,17M21,18A3,3 0 0,1 18,21A3,3 0 0,1 15,18C15,16.69 15.83,15.58 17,15.17V7H15V10.25L10.75,6L15,1.75V5H17A2,2 0 0,1 19,7V15.17C20.17,15.58 21,16.69 21,18M18,17A1,1 0 0,0 17,18A1,1 0 0,0 18,19A1,1 0 0,0 19,18A1,1 0 0,0 18,17Z" />
                    </svg>
                    <span class="mr-auto ml-2 pr-2 text-truncate">{{ pullRequest.title }}</span>
                    {{ pullRequest.comments.totalCount }}
                    <font-awesome-icon :icon="['far', 'comment-alt']" class="ml-1 mr-2 text-muted" />
                    <font-awesome-icon :icon="['fab', 'github']" class="text-muted" />
                    <font-awesome-icon :icon="['fas', 'external-link-alt']" class="text-muted-light ml-1" />
                  </a>
                </div>
                <small v-else class="text-muted d-block text-center">
                  No linked pull requests yet.
                </small>
              </div>
            </transition>
          </div>
        </div>
      </transition>
    </div>
    <div v-else-if="loading" class="d-flex justify-content-center p-4 m-3 rounded-lg">
      <font-awesome-icon :icon="['fas', 'circle-notch']" spin class="text-muted-light" />
    </div>
    <div v-else-if="!loading && !issueNode" class="d-flex justify-content-center p-3 rounded-lg">
      <small class="text-muted d-block text-center border rounded-xl px-3 py-1">
        <small><font-awesome-icon :icon="['fas', 'exclamation-triangle']" /></small>
        Issue not found.
      </small>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.issue
  border-top: solid 1px #fff
  cursor: pointer
  position: relative
  &.pinned
    box-shadow: inset 0 0 30px rgba(255, 187, 0, 0.1) !important
    &.showDetails
      box-shadow: inset 0 0 30px rgba(255, 187, 0, 0.1), inset 0 0 7px rgba(0, 0, 0, 0.2) !important

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
  border: solid 2px #ccc
  border-radius: 50%
  width: 32px
  height: 32px
  background-repeat: no-repeat
  background-position: center center
  background-size: 100%
</style>

<script>
import { mapGetters } from 'vuex'
import loadFromGithub from '@/mixins/loadFromGithub'
import helpers from '@/mixins/helpers'

export default {
  props: ['issue'],
  mixins: [loadFromGithub, helpers],
  data() {
    return {
      issueNode: null,
      showDetails: false,
      action: null,
      pinAmount: 10,
      releaseTo: '',
      releasing: false,
      showReleaseSuccess: false,
      showReleaseError: false,
      pinningIssue: false,
      refundingDeposit: false,
      loadReleaseToUserTimeout: null,
      loadingReleaseToUser: false,
      releaseToUser: null,
      releaseRequestID: null,
      isRepoAdmin: false,
      fundingGoal: Math.floor(Math.random() * 5) + 1,
      linkedPullRequests: [],
      loading: false
    }
  },
  watch: {
    releaseTo(newUsername, oldUsername) {
      clearTimeout(this.loadReleaseToUserTimeout)
      this.loadReleaseToUserTimeout = setTimeout(() => {
        if (newUsername) {
          this.loadingReleaseToUser = true
          this.releaseToUser = null
          this.loadUser(newUsername)
            .then(user => {
              this.releaseToUser = user
            })
            .catch(() => {
              this.releaseToUser = null
            })
            .finally(() => this.loadingReleaseToUser = false)
        } else {
          this.releaseToUser = null
          this.loadingReleaseToUser = false
        }
      }, 500)
    },
    showDetails(show) {
      if (show) {
        this.$axios.$get(
          `${process.env.API_URL}/github/is-repo-admin/${this.githubUser.login}/${this.issueNode.owner}/${this.issueNode.repository}`
        ).then(isRepoAdmin => this.isRepoAdmin = isRepoAdmin).catch(() => this.isRepoAdmin = false)

        this.linkedPullRequests = []
        this.$axios.$get(`${process.env.API_URL}/github/linked-pullrequests/${this.issueNode.id}`).then(activePullRequestIds => {
          activePullRequestIds.forEach(prId => {
            this.$axios.$get(`${process.env.API_URL}/github/pullrequest-by-id/${prId}`).then(pr => {
              this.linkedPullRequests.push(pr)
            })
          })
        }).catch(() => this.linkedPullRequests = [])
      }
    }
  },
  computed: {
    ...mapGetters(['account', 'registeredAccount', 'oracles']),
    ...mapGetters('github', { githubUser: 'user' }),
    sortedLinkedPullRequests() {
      return this.linkedPullRequests.sort((a, b) => {
        return a.state === 'MERGED' ? -1 : 1
      })
    }
  },
  methods: {
    fundIssue() {
      this.$store.commit('setRedirectPrefills', {
        type: 'send-issue',
        username: this.issueNode.owner,
        repository: this.issueNode.repository,
        issue: this.issueNode.number,
        amount: '1.0'
      })
      this.$store.commit('setView', 'send')
    },
    twitterPost() {
      this.$store.commit('setModalData', this.issueNode)
      this.$store.commit('setModalComponent', 'ModalTwitterPost')
      this.$store.commit('setShowModal', true)
    },
    changeAction(action) {
      if (this.action === action) {
        this.action = null
      } else {
        this.action = action
      }
    },
    pin() {
      if (this.$octoBay) {
        this.pinningIssue = true
        this.$octoBay.methods.pinIssue(this.issue.id, this.$web3.utils.toWei(this.pinAmount, 'ether')).send({
          // useGSN: false,
          from: this.account
        }).then(result => {
          this.$store.dispatch('updatePins', this.issue.id)
          this.$store.dispatch('updateOctoPinBalance')
          this.$web3.eth.getBalance(this.account).then(balance => this.$store.commit('setBalance', balance))
          this.pinAmount = 0
        }).catch(e => {
          console.log(e)
        }).finally(() => {
          this.pinningIssue = false
        })
      }
    },
    refundIssueDeposit(id) {
      this.refundingDeposit = id
      this.$octoBay.methods.refundIssueDeposit(id).send({
        // useGSN: false,
        from: this.account
      }).then(() => {
        this.$store.commit('removeDeposit', { issueId: this.issue.id, depositId: id })
      }).catch(e => console.log(e)).finally(() => this.refundingDeposit = false)
    },
    release() {
      if (this.releaseTo) {
        this.releasing = true
        // start listening for request event
        const confirmListener = this.$octoBay.events.ChainlinkFulfilled().on('data', event => {
          if (event.returnValues.id === this.releaseRequestID) {
            // stop listening and finish process
            confirmListener.unsubscribe()
            this.showReleaseSuccess = true
            this.releasing = false,
            this.releaseRequestID = null
          }
        })

        // trigger release (get gas price first)
        web3.eth.getGasPrice((error, gasPrice) => {
          this.$octoBay.methods.releaseIssueDeposits(
            this.oracles[0].address,
            this.issue.id,
            this.releaseTo
          ).send({
            // useGSN: false,
            from: this.account,
          }).then(releaseRequest => {
            this.releaseRequestID = releaseRequest.events.ChainlinkRequested.returnValues.id
          }).catch(() => this.releasing = false)
        })
      }
    }
  },
  mounted() {
    this.loading = true
    this.loadIssueById(this.issue.id).then(issue => {
      if (issue) {
        this.issueNode = {
          id: issue.id,
          number: issue.number,
          title: issue.title,
          owner: issue.repository.owner.login,
          repository: issue.repository.name,
          repositoryOwner: issue.repository.owner.login,
          primaryLanguage: issue.repository.primaryLanguage,
          labels: issue.labels.edges.map(label => label.node),
          closed: issue.closed
        }
      }
    }).finally(() => this.loading = false)
  }
}
</script>
