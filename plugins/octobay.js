export default async ({ app }, inject) => {
  if (app.$web3) {
    const octoBay = new app.$web3.eth.Contract(process.env.OCTOBAY_ABI, process.env.OCTOBAY_ADDRESS)
    const octoPin = new app.$web3.eth.Contract(process.env.OCTOPIN_ABI, process.env.OCTOPIN_ADDRESS)

    /**
     * Exposes the OctoBay and OctoPin contracts as nuxt plugins.
     * in components: this.$octoBay and this.octoPin 
     */
    inject('octoBay', octoBay)
    inject('octoPin', octoPin)
  }
}
