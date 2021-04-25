export const state = () => ({
  loaded: false,
  loadError: null,
  octoBayOwner: null,
  octoBayAdmin: null,
  networkId: null,
  accounts: [],
  registeredAccounts: [],
  balance: 0,
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
  selectedDepartment: null,
  departments: [],
  nfts: [],
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
    return state.accounts.length ? state.accounts[0].toLowerCase() : null
  },
  balance(state) {
    return state.balance
  },
  connected(state) {
    return !!state.accounts.length
  },
  registeredAccounts(state) {
    return state.registeredAccounts
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
  octoBayAdmin(state) {
    return state.octoBayAdmin
  },
  selectedDepartment(state) {
    return state.selectedDepartment
  },
  departments(state) {
    return state.departments
  },
  ownDepartments(state) {
    return state.departments.filter((d) => {
      return (
        state.accounts.length &&
        (d.creator === state.accounts[0] ||
          d.nfts.find((nft) => nft.ownerAddress === state.accounts[0]) ||
          d.holders.find((holder) => holder.ethAddress === state.accounts[0]))
      )
    })
  },
  proposals(state) {
    return state.proposals
  },
  nfts(state) {
    return state.nfts
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
    state.accounts = accounts.map((address) => address.toLowerCase())
  },
  setBalance(state, balance) {
    state.balance = balance
  },
  setRegisteredAccounts(state, registeredAccounts) {
    state.registeredAccounts = registeredAccounts
  },
  setIssues(state, issues) {
    state.issues = issues
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
  setOctoBayAdmin(state, isAdmin) {
    state.octoBayAdmin = isAdmin
  },
  setDepartments(state, departments) {
    state.departments = departments
  },
  setSelectedDepartment(state, department) {
    state.selectedDepartment = department
  },
  setNFTs(state, nfts) {
    state.nfts = nfts
  },
}

export const actions = {
  updateIssues({ commit }) {
    commit('setIssues', [])
    this.$axios.$get(process.env.API_URL + '/graph/issues').then((issues) => {
      issues.forEach((issue) => {
        // TODO: this all has to go to graph as well
        let depositAmount = BigInt(0)
        issue.deposits.forEach((deposit) => {
          depositAmount += BigInt(deposit.amount)
        })
        issue.depositAmount = depositAmount.toString()
        if (issue.depositAmount) {
          commit('addIssue', issue)
        }
      })
    })
  },
  updateDepartments({ commit }) {
    this.$axios
      .$get(process.env.API_URL + '/graph/departments')
      .then((departments) => {
        commit('setDepartments', departments)
      })
  },
  updateNFTs({ state, commit }) {
    return this.$axios
      .$get(
        process.env.API_URL +
          '/graph/permission-nfts-by-owner/' +
          state.accounts[0]
      )
      .then((nfts) => {
        commit('setNFTs', nfts)
      })
  },
  updateOracles({ commit }) {
    this.$axios.$get(process.env.API_URL + '/graph/oracles').then((oracles) => {
      commit('setOracles', oracles)
    })
  },
}
