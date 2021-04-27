export default function ({ store, app }) {
  if (app.$octobay) {
    Promise.all([
      app.$web3.eth.net.getId(),
      app.$web3.eth.getAccounts(),
      app.$axios.$get('https://tokens.coingecko.com/uniswap/all.json'),
      app.$axios.$get(process.env.API_URL + '/graph/oracles'),
      store.dispatch('githubLogin'),
    ])
      .then((values) => {
        store.commit('setNetworkId', values[0])
        const accounts = values[1]
        store.commit('setTokenList', values[2])
        store.commit('setOracles', values[3])

        // load issues and departments
        store.dispatch('updateIssues')
        store.dispatch('updateDepartments')

        if (accounts.length) {
          store.commit('setAccounts', accounts)
          store.dispatch('updateEthBalance')
          store.dispatch('updateIsOctobayOwner')
          store.dispatch('updateIsOctobayAdmin')
        }
      })
      .catch((e) => {
        console.log(e)
        store.commit('setLoadError', e)
      })
      .finally(() => store.commit('setLoaded', true))
  }
}
