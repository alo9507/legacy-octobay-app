export const state = () => ({
  loaded: false,
  loadError: null,
  octoBayOwner: null,
  networkId: null,
  accounts: [],
  registeredAccount: null,
  balance: 0,
  ovtBalance: 0,
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
  selectedDepartment: null,
  departments: [
    {
      id: 'abcdef',
      name: 'Octobay Strategy',
      address: '0x0000000000000000000000000000000000000001',
      symbol: 'OSTRG',
      project: {
        id: '123',
      },
      holders: [
        {
          id: 'akjdhakjdf',
          githubUserId: 'anjkgfnlag=',
          address: '0x0000000000000000000000000000000000000004',
          balance: '315000000000000000000',
        },
        {
          id: 'akgjglsf',
          githubUserId: 'rkjugslrhjd',
          address: '0x0000000000000000000000000000000000000005',
          balance: '315000000000000000000',
        },
        {
          id: 'hdlsnujeg=',
          githubUserId: 'klhdjgsbkg',
          address: '0x0000000000000000000000000000000000000006',
          balance: '4000000000000000000000',
        },
      ],
      nfts: [
        {
          id: '12321',
          githubUserId: 'klhdjgsbkg',
          owner: '0x0000000000000000000000000000000000000012',
          permissions: ['manageSettings', 'createProposals'],
        },
      ],
    },
    {
      id: 'ghijkl',
      name: 'Octobay Security',
      address: '0x0000000000000000000000000000000000000002',
      symbol: 'OSECG',
      project: {
        id: '123',
      },
      holders: [],
      nfts: [],
    },
  ],
  proposals: [
    {
      id: '1231321',
      department: 'abcdef',
      quorum: 2500,
      discussion: {
        id: '2342342',
      },
      votes: [
        {
          address: '0x1230000000000000000000000000000000000456',
          githubUser: 'mktcode',
          percentage: 1260,
        },
        {
          address: '0x7890000000000000000000000000000000000abc',
          githubUser: 'rikkce',
          percentage: -280,
        },
      ],
    },
  ],
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
  ovtBalance(state) {
    return state.ovtBalance
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
  twitterAccountId(state) {
    return state.twitterAccountId
  },
  twitterFollowers(state) {
    return state.twitterFollowers
  },
  selectedDepartment(state) {
    return state.selectedDepartment
  },
  departments(state) {
    return state.departments
  },
  proposals(state) {
    return state.proposals
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
  setOvtBalance(state, balance) {
    state.ovtBalance = balance
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
  setTwitterAccountId(state, id) {
    state.twitterAccountId = id
  },
  setTwitterFollowers(state, followers) {
    state.twitterFollowers = followers
  },
  setSelectedDepartment(state, department) {
    state.selectedDepartment = department
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
  updateOvtBalance({ state, commit }) {
    this.$ovt.methods
      .balanceOf(state.accounts[0])
      .call()
      .then((balance) => commit('setOvtBalance', balance))
  },
  updatePins({ commit }, issueId) {
    this.$octoBay.methods
      .issuePins(issueId)
      .call()
      .then((pins) => commit('updatePins', { issueId, pins }))
  },
}
