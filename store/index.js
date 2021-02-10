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
  twitterFollowers: 0
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
  }
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
    let existingIssueIndex = state.issues.findIndex(i => i.id === issueId)
    if (existingIssueIndex != -1) {
      state.issues.splice(existingIssueIndex, 1)
    }
  },
  removeDeposit(state, { issueId, depositId }) {
    let existingIssueIndex = state.issues.findIndex(issue => issue.id === issueId)
    if (existingIssueIndex != -1) {
      let existingDepositIndex = state.issues[existingIssueIndex].deposits.findIndex(deposit => deposit.id === depositId)
      if (existingDepositIndex != -1) {
        state.issues[existingIssueIndex].deposits.splice(existingDepositIndex, 1)
        if (!state.issues[existingIssueIndex].deposits.length) {
          state.issues.splice(existingIssueIndex, 1)
        }
      }
    }
  },
  updatePins(state, { issueId, pins }) {
    let existingIssue = state.issues.find(issue => issue.id === issueId)
    if (existingIssue) {
      existingIssue.boostAmount = Number(this.$web3.utils.fromWei(pins, 'ether'))
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
  setOracle(state, oracle) {
    state.oracles.push(oracle)
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
  }
}

export const actions = {
  load({ commit, dispatch, state, rootState }) {
    this.$axios.$get('https://tokens.coingecko.com/uniswap/all.json').then(list => {
      commit('setTokenList', list)
    })

    if (this.$octoBay) {
      this.$octoBay.methods.owner().call().then(owner => {
        commit('setOwner', owner)
      })

      this.$octoBay.methods.octoPin().call().then(address => {
        commit('setOctoPinAddress', address)
      })

      dispatch('updateOracles')

      this.$octoBay.methods.twitterAccountId().call().then(id => {
        commit('setTwitterAccountId', id)
      })

      this.$octoBay.methods.twitterFollowers().call().then(followers => {
        commit('setTwitterFollowers', followers)
      })
    }

    this.$axios.$get(`${process.env.API_URL}/github/forks/octobay/app`).then(forks => {
      forks.forEach(fork => {
        commit('setFork', fork)
      })
    })

    return dispatch("github/login").then((result) => {
      if (rootState.github.user && this.$octoBay) {
        this.$octoBay.methods.userIDsByGithubUser(rootState.github.user.login).call().then(userId => {
          this.$octoBay.methods.users(userId).call().then(result => {
            commit("setRegisteredAccount", result.ethAddress !== "0x0000000000000000000000000000000000000000" && result.status === '2' ? result.ethAddress : null)
          }).catch(() => {
            commit("setRegisteredAccount", null)
          })
        }).catch(() => {
          commit("setRegisteredAccount", null)
        })
      }
      if (this.$web3 && this.$octoBay) {
        this.$web3.eth.getAccounts().then(accounts => {
          if (accounts.length) {
            commit('setAccounts', accounts)
            this.$web3.eth.getBalance(accounts[0]).then(balance => commit('setBalance', balance))
            dispatch('updateOctoPinBalance')
          }
        })
        this.$web3.eth.net.getId().then(result => {
          commit('setNetworkId', result)
        })
      }
    })
  },
  updateIssues({ state, commit }) {
    if (this.$octoBay) {
      this.$axios.$get(process.env.API_URL + '/graph/issues').then(issues => {
        issues.forEach(async issue => {
          // TODO: this all has to go to graph as well
          let depositAmount = BigInt(0)
          issue.deposits.forEach(deposit => {
            depositAmount += BigInt(deposit.amount)
          })
          issue.depositAmount = depositAmount.toString()
          if (issue.depositAmount) {
            const boostAmount = await this.$octoBay.methods.issuePins(issue.id).call()
            issue.boostAmount = Number(this.$web3.utils.fromWei(boostAmount, 'ether'))
            commit('addIssue', issue)
          }
        })
      })
    }
  },
  updateOracles({ commit }) {
    return this.$octoBay.methods.getOracles().call().then(oracleAddresses => {
      const oracleRequests = []
      oracleAddresses.forEach(oracleAddress => {
        const jobRequests = []
        jobRequests.push(this.$octoBay.methods.oracleNames(oracleAddress).call())
        jobRequests.push(this.$octoBay.methods.registerJobIds(oracleAddress).call())
        jobRequests.push(this.$octoBay.methods.registerJobFees(oracleAddress).call())
        jobRequests.push(this.$octoBay.methods.releaseJobIds(oracleAddress).call())
        jobRequests.push(this.$octoBay.methods.releaseJobFees(oracleAddress).call())
        jobRequests.push(this.$octoBay.methods.claimJobIds(oracleAddress).call())
        jobRequests.push(this.$octoBay.methods.claimJobFees(oracleAddress).call())
        jobRequests.push(this.$octoBay.methods.twitterPostJobIds(oracleAddress).call())
        jobRequests.push(this.$octoBay.methods.twitterPostJobFees(oracleAddress).call())
        jobRequests.push(this.$octoBay.methods.twitterFollowersJobIds(oracleAddress).call())
        jobRequests.push(this.$octoBay.methods.twitterFollowersJobFees(oracleAddress).call())
        oracleRequests.push(Promise.all(jobRequests).then(values => {
          const oracle =  {
            address: oracleAddress,
            name: values[0],
            registerJobId: this.$web3.utils.hexToAscii(values[1]),
            registerJobFee: values[2],
            releaseJobId: this.$web3.utils.hexToAscii(values[3]),
            releaseJobFee: values[4],
            claimJobId: this.$web3.utils.hexToAscii(values[5]),
            claimJobFee: values[6],
            twitterPostJobId: this.$web3.utils.hexToAscii(values[7]),
            twitterPostJobFee: values[8],
            twitterFollowersJobId: this.$web3.utils.hexToAscii(values[9]),
            twitterFollowersJobFee: values[10],
          }
          console.log('Oracle', oracle.address)
          console.log('- Register Job ID', oracle.registerJobId)
          console.log('- Twitter Post Job ID', oracle.twitterPostJobId)
          commit('setOracle', oracle)
          return oracle
        }))
      })
      return Promise.all(oracleRequests).then(oracles => oracles)
    })
  },
  updateOctoPinBalance({ state, commit }) {
    this.$octoPin.methods.balanceOf(state.accounts[0]).call().then(balance => commit('setOctoPinBalance', balance))
  },
  updatePins({ commit }, issueId) {
    this.$octoBay.methods.issuePins(issueId).call().then(pins => commit('updatePins', { issueId, pins }))
  }
}
