export default function ({ app, store }) {
  store.dispatch('updateGithubUser')
  store.dispatch('updateIssues')
  store.dispatch('updateDepartments')
  store.dispatch('updateOracles')
  store.dispatch('updateConfig')
  if (app.$web3) {
    store.dispatch('updateNetworkId')
    store.dispatch('updateAccounts')
  }
}
