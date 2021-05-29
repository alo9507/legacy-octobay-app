export const state = () => ({
  config: {},
  networkId: null,
  accounts: [],
  githubUser: null,
  githubAccessToken: null,
  balance: 0,
  issues: [],
  outgoingUserDeposits: [],
  showRecipientTypeList: false,
  selectedRecipientType: 'User',
  showIntervalSelect: false,
  selectedInterval: 'Months',
  redirectPrefills: null,
  view: 'issues',
  oracles: [],
  activeOracle: null,
  showOracleList: false,
  showModal: false,
  modalComponent: null,
  modalBlocksUi: false,
  modalData: null,
  selectedDepartment: null,
  departments: [],
  nfts: [],
})

export const getters = {
  config(state) {
    return state.config
  },
  isOctobayOwner(state, getters) {
    return getters.account === state.config.owner
  },
  isOctobayAdmin(state) {
    /**
     * Gives access to the admin dashboard. (like isOctobayOwner)
     * Currently you are considered an admin if you hold an NFT with MINT permission
     * from any governance department that belongs to the Octobay GitHub org.
     * Should be changed in the future to either a special ADMIN permission.
     */
    return state.nfts.find(
      (nft) =>
        nft.department.projectId === 'MDEyOk9yZ2FuaXphdGlvbjc3NDAyNTM4' &&
        nft.permissions.includes('MINT')
    )
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
  connected(state) {
    return !!state.accounts.length
  },
  githubUser(state) {
    return state.githubUser
  },
  githubAccessToken(state) {
    return state.githubAccessToken
  },
  githubAuthUrl() {
    return `https://github.com/login/oauth/authorize?scope=user:email,public_repo&client_id=${process.env.GITHUB_CLIENT_ID}`
  },
  issues(state) {
    return state.issues
  },
  outgoingUserDeposits(state) {
    return state.outgoingUserDeposits
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
  showModal(state) {
    return state.showModal
  },
  modalComponent(state) {
    return state.modalComponent
  },
  modalBlocksUi(state) {
    return state.modalBlocksUi
  },
  modalData(state) {
    return state.modalData
  },
  selectedDepartment(state) {
    return state.selectedDepartment
  },
  departments(state) {
    return state.departments
  },
  ownDepartments(state, getters) {
    return state.departments.filter(
      (d) =>
        d.creator === getters.account ||
        d.nfts.find((nft) => nft.ownerAddress === getters.account) ||
        d.holders.find((holder) => holder.ethAddress === getters.account)
    )
  },
  proposals(state) {
    return state.proposals
  },
  nfts(state) {
    return state.nfts
  },
}

export const mutations = {
  setConfig(state, config) {
    state.config = config
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
  setGithubUser(state, user) {
    state.githubUser = user
  },
  setGithubUserEthAddresses(state, addresses) {
    state.githubUser.ethAddresses = addresses
  },
  setGithubAccessToken(state, accessToken) {
    state.githubAccessToken = accessToken
  },
  setIssues(state, issues) {
    state.issues = issues
  },
  addIssue(state, issue) {
    state.issues.push(issue)
  },
  setOutgoingUserDeposits(state, deposits) {
    state.outgoingUserDeposits = deposits
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
  setShowModal(state, show) {
    state.showModal = show
  },
  setModalComponent(state, component) {
    state.modalComponent = component
  },
  setModalBlocksUi(state, blocksUi) {
    state.modalBlocksUi = blocksUi
  },
  setModalData(state, data) {
    state.modalData = data
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
  updateNetworkId({ commit }) {
    this.$web3.eth.net
      .getId()
      .then((chainId) => commit('setNetworkId', chainId))
  },
  web3connect({ dispatch }) {
    this.$web3.eth.requestAccounts().then(() => {
      dispatch('updateAccounts')
    })
  },
  updateAccounts({ commit, dispatch }) {
    this.$web3.eth.getAccounts().then((accounts) => {
      commit('setAccounts', accounts)
      dispatch('updateEthBalance')
      dispatch('updateNFTs')
    })
  },
  updateEthBalance({ state, getters, commit }) {
    if (state.accounts.length) {
      this.$web3.eth
        .getBalance(getters.account)
        .then((balance) => commit('setBalance', balance))
    } else {
      commit('setBalance', '0')
    }
  },
  updateGithubUser({ commit }) {
    const accessToken = localStorage.getItem('github_access_token')
    if (accessToken) {
      this.$subgraph.me(accessToken).then((githubUser) => {
        commit('setGithubAccessToken', accessToken)
        commit('setGithubUser', githubUser)
      })
    }
  },
  githubLogout({ commit }) {
    localStorage.removeItem('github_access_token')
    commit('setGithubUser', null)
    commit('setGithubAccessToken', null)
  },
  updateIssues({ commit }) {
    commit('setIssues', [])
    this.$subgraph.getIssues().then((issues) => {
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
  updateOutgoingUserDeposits({ getters, commit }) {
    this.$subgraph
      .getOutgoingDepositsByAddress(getters.account)
      .then((deposits) => {
        if (deposits) {
          commit('setOutgoingUserDeposits', deposits)
        }
      })
  },
  updateDepartments({ commit }) {
    this.$subgraph.getDepartments().then((departments) => {
      commit('setDepartments', departments)
    })
  },
  updateNFTs({ getters, commit }) {
    return this.$subgraph
      .getPermissionNFTsByAddress(getters.account)
      .then((nfts) => {
        commit('setNFTs', nfts)
      })
  },
  updateOracles({ commit }) {
    this.$subgraph.getOracles().then((oracles) => {
      commit('setOracles', oracles)
    })
  },
  updateConfig({ commit }) {
    this.$subgraph
      .getConfig(process.env.OCTOBAY_ADDRESS.toLowerCase())
      .then((config) => {
        commit('setConfig', config)
      })
  },
}
