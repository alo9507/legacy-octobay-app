export default function ({ store, app }) {
  if (app.$octobay) {
    Promise.all([
      app.$web3.eth.getAccounts(),
      app.$axios.$get(process.env.API_URL + '/graph/oracles'),
      store.dispatch('updateNetworkId'),
      store.dispatch('githubLogin'),
    ])
      .then((values) => {
        const accounts = values[0]
        store.commit('setOracles', values[1])

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
