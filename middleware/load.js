export default function ({ store, redirect, app }) {
  if (app.$octoBay) {
    Promise.all([
      app.$octoBay.methods.owner().call(),
      app.$octoBay.methods.octoPin().call(),
      app.$octoBay.methods.twitterAccountId().call(),
      app.$octoBay.methods.twitterFollowers().call(),
      app.$web3.eth.net.getId(),
      app.$web3.eth.getAccounts(),
      store.dispatch("github/login")
    ]).then(values => {
      store.commit('setOctoBayOwner', values[0])
      store.commit('setOctoPinAddress', values[1])
      store.commit('setTwitterAccountId', values[2])
      store.commit('setTwitterFollowers', values[3])
      store.commit('setNetworkId', values[4])
      const accounts = values[5]

      if (accounts.length) {
        store.commit('setAccounts', accounts)
        app.$web3.eth.getBalance(accounts[0]).then(balance => store.commit('setBalance', balance))
        store.dispatch('updateOctoPinBalance')
      }

      if (store.state.github.user) {
        app.$octoBay.methods.userIDsByGithubUser(store.state.github.user.login).call().then(userId => {
          app.$octoBay.methods.users(userId).call().then(result => {
            store.commit("setRegisteredAccount", result.ethAddress !== "0x0000000000000000000000000000000000000000" && result.status === '2' ? result.ethAddress : null)
          }).catch(() => {
            store.commit("setRegisteredAccount", null)
          })
        }).catch(() => {
          store.commit("setRegisteredAccount", null)
        })
      }

    }).catch(e => {
      console.log(e)
      store.commit('setLoadError', e)
    }).finally(() => store.commit('setLoaded', true))
  }
}
