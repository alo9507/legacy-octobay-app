export default ({ app }, inject) => {
  if (app.$web3) {
    const octoBay = new app.$web3.eth.Contract(
      process.env.OCTOBAY_ABI,
      process.env.OCTOBAY_ADDRESS
    )
    const octobayGovernor = new app.$web3.eth.Contract(
      process.env.OCTOBAY_GOVERNOR_ABI,
      process.env.OCTOBAY_GOVERNOR_ADDRESS
    )
    const octobayNFT = new app.$web3.eth.Contract(
      process.env.OCTOBAY_NFT_ABI,
      process.env.OCTOBAY_NFT_ADDRESS
    )

    /**
     * Exposes the Octobay contracts as nuxt plugins.
     * in components: this.$octoBay, this.octobayNFT, etc.
     */
    inject('octoBay', octoBay)
    inject('octobayNFT', octobayNFT)
    inject('octobayGovernor', octobayGovernor)
    inject('octobayGovToken', (address) => {
      return new app.$web3.eth.Contract(
        process.env.OCTOBAY_GOV_TOKEN_ABI,
        address
      )
    })
  }
}
