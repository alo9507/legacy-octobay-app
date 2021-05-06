import Web3 from 'web3'
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default ({ app, store }, inject) => {
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
      store.dispatch('updateAccounts')
    })

    Vue.mixin({
      computed: {
        ...mapGetters(['config']),
        octobay() {
          return new app.$web3.eth.Contract(
            require('./../contract-abi/Octobay.json').abi,
            process.env.OCTOBAY_ADDRESS
          )
        },
        octobayGovernor() {
          return new app.$web3.eth.Contract(
            require('./../contract-abi/OctobayGovernor.json').abi,
            this.config.octobayGovernor
          )
        },
        octobayGovNFT() {
          return new app.$web3.eth.Contract(
            require('./../contract-abi/OctobayGovNFT.json').abi,
            this.config.octobayGovNFT
          )
        },
      },
      methods: {
        octobayGovToken(address) {
          return new app.$web3.eth.Contract(
            require('./../contract-abi/OctobayGovToken.json').abi,
            address
          )
        },
      },
    })
  } else {
    /**
     * Set web3 to null for non-web3 browsers (for some in-template checks to work)
     */
    inject('web3', null)
  }
}
