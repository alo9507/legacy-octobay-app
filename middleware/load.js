export default function ({ store, app }) {
  if (app.$octobay) {
    Promise.all([
      app.$octobay.methods.owner().call(),
      app.$web3.eth.net.getId(),
      app.$web3.eth.getAccounts(),
      app.$axios.$get('https://tokens.coingecko.com/uniswap/all.json'),
      app.$axios.$get(process.env.API_URL + '/graph/oracles'),
      store.dispatch('github/login'),
    ])
      .then((values) => {
        store.commit('setOctoBayOwner', values[0].toLowerCase())
        store.commit('setNetworkId', values[1])
        const accounts = values[2]
        store.commit('setTokenList', values[3])
        store.commit('setOracles', values[4])

        // load issues and departments
        store.dispatch('updateIssues')
        store.dispatch('updateDepartments')

        if (accounts.length) {
          store.commit('setAccounts', accounts)
          app.$web3.eth
            .getBalance(accounts[0])
            .then((balance) => store.commit('setBalance', balance))

          app.$octobayGovNFT.methods
            .getTokenIDForUserInProject(
              accounts[0],
              'MDEyOk9yZ2FuaXphdGlvbjc3NDAyNTM4'
            )
            .call()
            .then((tokenId) => {
              if (tokenId) {
                app.$octobayGovNFT.methods
                  .hasPermission(tokenId, 1)
                  .call()
                  .then((isOctobayAdmin) => {
                    store.commit('setOctoBayAdmin', isOctobayAdmin)
                  })
              }
            })
        }

        if (store.state.github.user) {
          app.$axios
            .$get(
              process.env.API_URL +
                '/graph/user/' +
                store.state.github.user.node_id
            )
            .then((user) => {
              if (user) {
                store.commit('setRegisteredAccounts', user.addresses)
              }
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
