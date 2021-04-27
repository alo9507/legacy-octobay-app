const Web3 = require('web3')

export default ({ store }, inject) => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum)

    window.ethereum.on('accountsChanged', () => {
      store.dispatch('updateAccounts')
    })

    window.ethereum.on('chainChanged', () => {
      store.dispatch('updateNetworkId')
    })

    /**
     * Exposes Web3 as a vue plugin.
     * in components: this.$web3
     */
    inject('web3', web3)
  }
}
