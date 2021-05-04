export default function ({ app, store }) {
  store.dispatch('githubLogin')
  store.dispatch('updateIssues')
  store.dispatch('updateDepartments')
  store.dispatch('updateOracles')
  if (app.$web3) {
    store.dispatch('updateNetworkId')
    store.dispatch('updateAccounts')
  }
}
