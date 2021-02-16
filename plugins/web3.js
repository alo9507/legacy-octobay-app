const Web3 = require('web3')
// const { RelayProvider } = require('@opengsn/gsn')

export default ({ app }, inject) => {
  if (window.ethereum) {
    const plainWeb3 = new Web3(window.ethereum)

    // GSN integration currently disabled
    // const gsnRelayProvider = await RelayProvider.newProvider({
    //   provider: plainWeb3.currentProvider,
    //   config: {
    //     relayHubInstance: process.env.GSN_RELAYHUB_ADDRESS,
    //     paymasterAddress: process.env.GSN_PAYMASTER_ADDRESS,
    //     loggerConfiguration: {
    //       logLevel: 'debug',
    //       loggerUrl: 'https://logger.opengsn.org',
    //       applicationId: 'octobay-dev'
    //     }
    //   }
    // }).init()

    const web3 = plainWeb3 // new Web3(gsnRelayProvider)

    window.ethereum.on('accountsChanged', (accounts) => {
      app.store.dispatch('load')
    })

    window.ethereum.on('chainChanged', (network) => {
      app.store.dispatch('load')
    })

    /**
     * Exposes Web3 as a nuxt plugin.
     * in components: this.$web3
     */
    inject('web3', web3)
  }
}
