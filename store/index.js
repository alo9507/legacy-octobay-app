export const state = () => ({
  loaded: false,
  loadError: null,
  octoBayOwner: null,
  networkId: null,
  accounts: [],
  registeredAccount: null,
  balance: 0,
  octoPinAddress: null,
  octoPinBalance: 0,
  issues: [],
  tokenList: [],
  showTokenList: false,
  selectedToken: null,
  showRecipientTypeList: false,
  selectedRecipientType: 'User',
  showIntervalSelect: false,
  selectedInterval: 'Months',
  redirectPrefills: null,
  view: 'issues',
  oracles: [],
  activeOracle: null,
  showOracleList: false,
  forks: [],
  showForkList: false,
  showModal: false,
  modalComponent: null,
  modalData: null,
  twitterAccountId: null,
  twitterFollowers: 0,
})

export const getters = {
  loaded(state) {
    return state.loaded
  },
  loadError(state) {
    return state.loadError
  },
  networkId(state) {
    return state.networkId
  },
  accounts(state) {
    return state.accounts
  },
  account(state) {
    return state.accounts.length ? state.accounts[0] : null
  },
  balance(state) {
    return state.balance
  },
  octoPinBalance(state) {
    return state.octoPinBalance
  },
  connected(state) {
    return !!state.accounts.length
  },
  registeredAccount(state) {
    return state.registeredAccount
  },
  issues(state) {
    return state.issues
  },
  tokenList(state) {
    return state.tokenList
  },
  showTokenList(state) {
    return state.showTokenList
  },
  selectedToken(state) {
    return state.selectedToken
  },
  showRecipientTypeList(state) {
    return state.showRecipientTypeList
  },
  selectedRecipientType(state) {
    return state.selectedRecipientType
  },
  showIntervalSelect(state) {
    return state.showIntervalSelect
  },
  selectedInterval(state) {
    return state.selectedInterval
  },
  redirectPrefills(state) {
    return state.redirectPrefills
  },
  view(state) {
    return state.view
  },
  oracles(state) {
    return state.oracles
  },
  activeOracle(state) {
    return state.activeOracle
  },
  showOracleList(state) {
    return state.showOracleList
  },
  forks(state) {
    return state.forks
  },
  showForkList(state) {
    return state.showForkList
  },
  showModal(state) {
    return state.showModal
  },
  modalComponent(state) {
    return state.modalComponent
  },
  modalData(state) {
    return state.modalData
  },
  octoBayOwner(state) {
    return state.octoBayOwner
  },
  octoPinAddress(state) {
    return state.octoPinAddress
  },
  twitterAccountId(state) {
    return state.twitterAccountId
  },
  twitterFollowers(state) {
    return state.twitterFollowers
  },
}

export const mutations = {
  setLoaded(state, loaded) {
    state.loaded = loaded
  },
  setLoadError(state, error) {
    state.loadError = error
  },
  setNetworkId(state, id) {
    state.networkId = id
  },
  setAccounts(state, accounts) {
    state.accounts = accounts
  },
  setBalance(state, balance) {
    state.balance = balance
  },
  setOctoPinBalance(state, balance) {
    state.octoPinBalance = balance
  },
  setRegisteredAccount(state, registeredAccount) {
    state.registeredAccount = registeredAccount
  },
  addIssue(state, issue) {
    state.issues.push(issue)
  },
  removeIssue(state, issueId) {
    const existingIssueIndex = state.issues.findIndex((i) => i.id === issueId)
    if (existingIssueIndex !== -1) {
      state.issues.splice(existingIssueIndex, 1)
    }
  },
  removeDeposit(state, { issueId, depositId }) {
    const existingIssueIndex = state.issues.findIndex(
      (issue) => issue.id === issueId
    )
    if (existingIssueIndex !== -1) {
      const existingDepositIndex = state.issues[
        existingIssueIndex
      ].deposits.findIndex((deposit) => deposit.id === depositId)
      if (existingDepositIndex !== -1) {
        state.issues[existingIssueIndex].deposits.splice(
          existingDepositIndex,
          1
        )
        if (!state.issues[existingIssueIndex].deposits.length) {
          state.issues.splice(existingIssueIndex, 1)
        }
      }
    }
  },
  updatePins(state, { issueId, pins }) {
    const existingIssue = state.issues.find((issue) => issue.id === issueId)
    if (existingIssue) {
      existingIssue.boostAmount = Number(
        this.$web3.utils.fromWei(pins, 'ether')
      )
    }
  },
  setTokenList(state, list) {
    state.tokenList = list
  },
  setShowTokenList(state, show) {
    state.showTokenList = show
  },
  setSelectedToken(state, address) {
    state.selectedToken = address
  },
  setShowRecipientTypeList(state, show) {
    state.showRecipientTypeList = show
  },
  setSelectedRecipientType(state, type) {
    state.selectedRecipientType = type
  },
  setShowIntervalSelect(state, show) {
    state.showIntervalSelect = show
  },
  setSelectedInterval(state, interval) {
    state.selectedInterval = interval
  },
  setRedirectPrefills(state, prefills) {
    state.redirectPrefills = prefills
  },
  setView(state, view) {
    state.view = view
  },
  setOracles(state, oracles) {
    state.oracles = oracles
  },
  setActiveOracle(state, oracle) {
    state.activeOracle = oracle
  },
  setShowOracleList(state, show) {
    state.showOracleList = show
  },
  setFork(state, fork) {
    state.forks.push(fork)
  },
  setShowForkList(state, show) {
    state.showForkList = show
  },
  setShowModal(state, show) {
    state.showModal = show
  },
  setModalComponent(state, component) {
    state.modalComponent = component
  },
  setModalData(state, data) {
    state.modalData = data
  },
  setOctoBayOwner(state, owner) {
    state.octoBayOwner = owner
  },
  setOctoPinAddress(state, address) {
    state.octoPinAddress = address
  },
  setTwitterAccountId(state, id) {
    state.twitterAccountId = id
  },
  setTwitterFollowers(state, followers) {
    state.twitterFollowers = followers
  },
}

export const actions = {
  updateIssues({ commit }) {
    if (this.$octoBay) {
      this.$axios.$get(process.env.API_URL + '/graph/issues').then((issues) => {
        issues.forEach(async (issue) => {
          // TODO: this all has to go to graph as well
          let depositAmount = BigInt(0)
          issue.deposits.forEach((deposit) => {
            depositAmount += BigInt(deposit.amount)
          })
          issue.depositAmount = depositAmount.toString()
          if (issue.depositAmount) {
            const boostAmount = await this.$octoBay.methods
              .issuePins(issue.id)
              .call()
            issue.boostAmount = Number(
              this.$web3.utils.fromWei(boostAmount, 'ether')
            )
            commit('addIssue', issue)
          }
        })
      })
    }
  },
  updateOracles({ commit }) {
    this.$axios.$get(process.env.API_URL + '/graph/oracles').then((oracles) => {
      commit('setOracles', oracles)
    })
  },
  updateOctoPinBalance({ state, commit }) {
    this.$octoPin.methods
      .balanceOf(state.accounts[0])
      .call()
      .then((balance) => commit('setOctoPinBalance', balance))
  },
  updatePins({ commit }, issueId) {
    this.$octoBay.methods
      .issuePins(issueId)
      .call()
      .then((pins) => commit('updatePins', { issueId, pins }))
  },
}
