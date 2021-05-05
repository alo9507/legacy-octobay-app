const Web3 = require('web3')

export default async ({ app, store }, inject) => {
  /**
   * Inject standalone web3 utils (for non-web3 browsers)
   */
  inject('web3utils', Web3.utils)

  if (window.ethereum) {
    inject('web3', new Web3(window.ethereum))

    window.ethereum.on('accountsChanged', () => {
      store.dispatch('updateAccounts')
    })

    window.ethereum.on('chainChanged', () => {
      store.dispatch('updateNetworkId')
    })

    /**
     * Initialize Octobay Contract
     * In components: this.$octobay
     */
    inject(
      'octobay',
      new app.$web3.eth.Contract(
        process.env.OCTOBAY_ABI,
        process.env.OCTOBAY_ADDRESS
      )
    )

    /**
     * Initialize Governor and GovNFT Contracts, derived from Octobay Contract
     * In components: this.$octobayGovernor, this.octobayGovNFT
     */
    inject(
      'octobayGovernor',
      new app.$web3.eth.Contract(
        process.env.OCTOBAY_GOVERNOR_ABI,
        await app.$octobay.methods.octobayGovernor().call()
      )
    )

    inject(
      'octobayGovNFT',
      new app.$web3.eth.Contract(
        process.env.OCTOBAY_NFT_ABI,
        await app.$octobay.methods.octobayGovNFT().call()
      )
    )

    /**
     * Dynamic initializer for gov token contracts
     * In components: this.octobayGovToken(<govTokenAddress>)
     */
    inject(
      'octobayGovToken',
      (address) =>
        new app.$web3.eth.Contract(process.env.OCTOBAY_GOV_TOKEN_ABI, address)
    )
  } else {
    /**
     * Set web3 to null for non-web3 browsers (for some in-template checks to work)
     */
    inject('web3', null)
  }
}
