export default ({ app }, inject) => {
  if (app.$web3) {
    const octoBay = new app.$web3.eth.Contract(
      process.env.OCTOBAY_ABI,
      process.env.OCTOBAY_ADDRESS
    )
    const ovt = new app.$web3.eth.Contract(
      process.env.OVT_ABI,
      process.env.OVT_ADDRESS
    )
    const octobayGovernor = new app.$web3.eth.Contract(
      process.env.OCTOBAY_GOVERNOR_ABI,
      process.env.OCTOBAY_GOVERNOR_ADDRESS
    )

    /**
     * Exposes the OctoBay and OVT contracts as nuxt plugins.
     * in components: this.$octoBay and this.ovt
     */
    inject('octoBay', octoBay)
    inject('ovt', ovt)
    inject('octobayGovernor', octobayGovernor)
    inject('octobayGovToken', (address) => {
      return new app.$web3.eth.Contract(
        process.env.OCTOBAY_GOV_TOKEN_ABI,
        address
      )
    })
  }
}
