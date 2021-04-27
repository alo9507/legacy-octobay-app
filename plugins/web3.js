const Web3 = require('web3')

export default ({ store, app }, inject) => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum)

    window.ethereum.on('accountsChanged', (accounts) => {
      store.commit('setAccounts', accounts)
      store.dispatch('updateEthBalance')
      store.dispatch('updateIsOctobayOwner')
      store.dispatch('updateIsOctobayAdmin')
    })

    window.ethereum.on('chainChanged', () => {
      app.$web3.eth.net.getId().then((chainId) => {
        store.commit('setNetworkId', chainId)
      })
    })

    /**
     * Exposes Web3 as a nuxt plugin.
     * in components: this.$web3
     */
    inject('web3', web3)
  }
}
