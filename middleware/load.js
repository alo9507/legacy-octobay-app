export default function ({ store }) {
  store.dispatch('updateIssues')
  store.dispatch('updateDepartments')
  store.dispatch('updateOracles')
  store.dispatch('updateNetworkId')
  store.dispatch('updateAccounts')
  store.dispatch('githubLogin')
}
