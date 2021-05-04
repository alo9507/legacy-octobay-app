import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['oracles', 'activeOracle']),
  },
  methods: {
    loadIssue(owner, repo, number) {
      return this.$axios
        .get(`${process.env.API_URL}/github/issue/${owner}/${repo}/${number}`)
        .then((res) => res.data)
    },
    loadIssueById(issueId) {
      return this.$axios
        .get(`${process.env.API_URL}/github/issue-by-id/${issueId}`)
        .then((res) => res.data)
    },
    loadUser(username) {
      return this.$axios
        .get(`${process.env.API_URL}/github/user/${username}`)
        .then((res) => res.data)
    },
    loadProjectById(id) {
      return new Promise((resolve) => {
        resolve({
          id: '123',
        })
      })
    },
    loadDiscussionById(discussionId) {
      return this.$axios
        .get(`${process.env.API_URL}/github/discussion-by-id/${discussionId}`)
        .then((res) => res.data)
    },
    brightnessByColor(color) {
      color = '' + color
      const isHEX = color.indexOf('#') === 0
      const isRGB = color.indexOf('rgb') === 0
      let r, g, b
      if (isHEX) {
        const hasFullSpec = color.length === 7
        const m = color.substr(1).match(hasFullSpec ? /(\S{2})/g : /(\S{1})/g)
        if (m) {
          r = parseInt(m[0] + (hasFullSpec ? '' : m[0]), 16)
          g = parseInt(m[1] + (hasFullSpec ? '' : m[1]), 16)
          b = parseInt(m[2] + (hasFullSpec ? '' : m[2]), 16)
        }
      }
      if (isRGB) {
        const m = color.match(/(\d+){3}/g)
        if (m) {
          r = m[0]
          g = m[1]
          b = m[2]
        }
      }
      if (typeof r !== 'undefined') return (r * 299 + g * 587 + b * 114) / 1000
    },
    nextOracle() {
      if (this.activeOracle) {
        return this.activeOracle
      }

      return this.oracles[Math.floor(Math.random() * this.oracles.length)]
    },
    oracleRequest(method, params, waitingForRequest, waitingForOracle) {
      return new Promise((resolve, reject) => {
        waitingForRequest(true)
        waitingForOracle(false)
        let requestID

        // listening for oracle request fulfillment
        const fulfillmentListener = this.$octobay.events
          .ChainlinkFulfilled()
          .on('data', (event) => {
            if (event.returnValues.id === requestID) {
              // stop listening and finish process
              fulfillmentListener.unsubscribe()
              waitingForOracle(false)
              resolve()
            }
          })

        method(this.nextOracle().ethAddress, ...params)
          .send({ from: this.account })
          .then((rId) => {
            requestID = rId
            waitingForRequest(false)
            waitingForOracle(true)
          })
          .catch((e) => reject(e))
      })
    },
    openModal(component) {
      this.$store.commit('setModalComponent', component)
      this.$store.commit('setShowModal', true)
    },
    closeModal() {
      this.$store.commit('setModalComponent', null)
      this.$store.commit('setShowModal', false)
    },
  },
}
