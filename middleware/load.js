export default function ({ store, app }) {
  if (app.$octobay) {
    Promise.all([
      store.dispatch('updateIssues'),
      store.dispatch('updateDepartments'),
      store.dispatch('updateOracles'),
      store.dispatch('updateNetworkId'),
      store.dispatch('updateAccounts'),
      store.dispatch('githubLogin'),
    ])
      .catch((e) => {
        console.log(e)
        store.commit('setLoadError', e)
      })
      .finally(() => store.commit('setLoaded', true))
  }
}
