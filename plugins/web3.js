const Web3 = require('web3')
// const { RelayProvider } = require('@opengsn/gsn')

export default ({ store, app }, inject) => {
  if (window.ethereum) {
    const plainWeb3 = new Web3(window.ethereum)

    const web3 = plainWeb3 // new Web3(gsnRelayProvider)

    window.ethereum.on('accountsChanged', (accounts) => {
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
                store.commit('setOctobayAdmin', isOctobayAdmin)
              })
          }
        })
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
