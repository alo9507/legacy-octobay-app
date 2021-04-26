export default async ({ app }, inject) => {
  if (app.$web3) {
    /**
     * Initialize Octobay Contract
     * In components: this.$octoBay
     */
    const octoBay = new app.$web3.eth.Contract(
      process.env.OCTOBAY_ABI,
      process.env.OCTOBAY_ADDRESS
    )
    inject('octoBay', octoBay)

    /**
     * Initialize Governor and GovNFT Contracts, derived from Octobay Contract
     * In components: this.$octobayGovernor, this.octobayGovNFT
     */
    app.$octoBay.methods
      .octobayGovernor()
      .call()
      .then((address) => {
        inject(
          'octobayGovernor',
          new app.$web3.eth.Contract(process.env.OCTOBAY_GOVERNOR_ABI, address)
        )
      })

    inject(
      'octobayGovNFT',
      new app.$web3.eth.Contract(
        process.env.OCTOBAY_NFT_ABI,
        await app.$octoBay.methods.octobayGovNFT().call()
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
  }
}
