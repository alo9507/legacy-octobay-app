export default function ({ store, redirect, app }) {
  if (app.$octoBay) {
    Promise.all([
      app.$octoBay.methods.owner().call(),
      app.$octoBay.methods.octoPin().call(),
      app.$octoBay.methods.twitterAccountId().call(),
      app.$octoBay.methods.twitterFollowers().call(),
      store.dispatch("github/login")
    ]).then(values => {
      store.commit('setOctoBayOwner', values[0])
      store.commit('setOctoPinAddress', values[1])
      store.commit('setTwitterAccountId', values[2])
      store.commit('setTwitterFollowers', values[3])

      if (store.state.github.user) {
        this.$octoBay.methods.userIDsByGithubUser(rootState.github.user.login).call().then(userId => {
          this.$octoBay.methods.users(userId).call().then(result => {
            store.commit("setRegisteredAccount", result.ethAddress !== "0x0000000000000000000000000000000000000000" && result.status === '2' ? result.ethAddress : null)
          }).catch(() => {
            store.commit("setRegisteredAccount", null)
          })
        }).catch(() => {
          store.commit("setRegisteredAccount", null)
        })
      }

      app.$web3.eth.getAccounts().then(accounts => {
        if (accounts.length) {
          store.commit('setAccounts', accounts)
          this.$web3.eth.getBalance(accounts[0]).then(balance => commit('setBalance', balance))
          store.dispatch('updateOctoPinBalance')
        }
      })
      app.$web3.eth.net.getId().then(result => {
        store.commit('setNetworkId', result)
      })

    }).catch(e => {
      store.commit('setLoadError', e)
    }).finally(() => store.commit('setLoaded', true))
  }
}
