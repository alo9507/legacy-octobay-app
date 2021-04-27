export const state = () => ({
  loaded: false,
  loadError: null,
  isOctobayOwner: null,
  isOctobayAdmin: null,
  networkId: null,
  accounts: [],
  githubUser: null,
  githubAccessToken: null,
  balance: 0,
  issues: [],
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
  modalData(state) {
    return state.modalData
  },
  isOctobayOwner(state) {
    return state.isOctobayOwner
  },
  isOctobayAdmin(state) {
    return state.isOctobayAdmin
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
  setModalData(state, data) {
    state.modalData = data
  },
  setIsOctobayOwner(state, isOwner) {
    state.isOctobayOwner = isOwner
  },
  setIsOctobayAdmin(state, isAdmin) {
    state.isOctobayAdmin = isAdmin
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
  web3connect({ commit, dispatch }) {
    this.$web3.eth.requestAccounts().then((accounts) => {
      commit(
        'setAccounts',
        accounts.map((a) => a.toLowerCase())
      )
      dispatch('updateEthBalance')
      dispatch('updateIsOctobayOwner')
      dispatch('updateIsOctobayAdmin')
    })
  },
  updateEthBalance({ state, commit }) {
    if (state.accounts.length) {
      this.$web3.eth
        .getBalance(state.accounts[0])
        .then((balance) => commit('setBalance', balance))
    } else {
      commit('setBalance', '0')
    }
  },
  githubLogin({ commit, dispatch }) {
    // in that case we look for an access token in localStorage
    const accessToken = localStorage.getItem('github_access_token')
    if (accessToken) {
      // try to fetch user object
      this.$axios
        .$get('https://api.github.com/user', {
          headers: {
            Authorization: 'bearer ' + accessToken,
          },
        })
        .then((response) => {
          commit('setGithubAccessToken', accessToken)
          commit('setGithubUser', response)
          dispatch('updateGithubUserAddresses')
        })
    }
  },
  githubLogout({ commit }) {
    localStorage.removeItem('github_access_token')
    commit('setGithubUser', null)
    commit('setGithubAccessToken', null)
  },
  updateGithubUserAddresses({ state, commit }) {
    if (state.githubUser) {
      this.$axios
        .$get(process.env.API_URL + '/graph/user/' + state.githubUser.node_id)
        .then((user) => {
          commit('setGithubUserEthAddresses', user.addresses)
        })
    }
  },
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
  updateIsOctobayOwner({ state, commit }) {
    this.$octobay.methods
      .owner()
      .call()
      .then((owner) => {
        commit('setIsOctobayOwner', state.accounts[0] === owner.toLowerCase())
      })
  },
  updateIsOctobayAdmin({ state, commit }) {
    this.$octobayGovNFT.methods
      .getTokenIDForUserInProject(
        state.accounts[0],
        'MDEyOk9yZ2FuaXphdGlvbjc3NDAyNTM4'
      )
      .call()
      .then((tokenId) => {
        if (tokenId) {
          this.$octobayGovNFT.methods
            .hasPermission(tokenId, 1)
            .call()
            .then((isOctobayAdmin) =>
              commit('setIsOctobayAdmin', isOctobayAdmin)
            )
        }
      })
  },
}
