export default function ({ store, redirect, app }) {
  if (app.$octoBay) {
    Promise.all([
      app.$octoBay.methods.owner().call(),
      app.$octoBay.methods.twitterAccountId().call(),
      app.$octoBay.methods.twitterFollowers().call(),
      app.$web3.eth.net.getId(),
      app.$web3.eth.getAccounts(),
      app.$axios.$get('https://tokens.coingecko.com/uniswap/all.json'),
      app.$axios.$get(process.env.API_URL + '/graph/oracles'),
      store.dispatch('github/login'),
    ])
      .then((values) => {
        store.commit('setOctoBayOwner', values[0].toLowerCase())
        store.commit('setTwitterAccountId', values[1])
        store.commit('setTwitterFollowers', values[2])
        store.commit('setNetworkId', values[3])
        const accounts = values[4]
        store.commit('setTokenList', values[5])
        store.commit('setOracles', values[6])

        if (accounts.length) {
          store.commit('setAccounts', accounts)
          app.$web3.eth
            .getBalance(accounts[0])
            .then((balance) => store.commit('setBalance', balance))
          store.dispatch('updateOvtBalance')
        }

        if (store.state.github.user) {
          app.$axios
            .$get(
              process.env.API_URL +
                '/graph/user/' +
                store.state.github.user.node_id
            )
            .then((user) => {
              store.commit('setRegisteredAccounts', user.addresses)
            })
        }
      })
      .catch((e) => {
        console.log(e)
        store.commit('setLoadError', e)
      })
      .finally(() => store.commit('setLoaded', true))
  }
}
