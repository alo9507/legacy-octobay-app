# Octobay

The long term vision for Octobay is to become a decentralized ecosystem for funding, governance, promotion and gamified recruitment on top of GitHub and potentially other open source collaboration platforms.

- [Demo](https://app.octobay.org)
- [Docs](https://octobay.github.io/docs)
- [Contracts](https://github.com/Octobay/contracts)
- [Chainlink Adapters](https://github.com/Octobay/chainlink-adapters)
- [Subgraph](https://github.com/Octobay/subgraph)
- [API Server](https://github.com/Octobay/api)

## Run locally

```bash
git clone https://github.com/Octobay/app octobay-app && cd octobay-app && yarn && cp .env.sample .env && yarn app:dev
```

Now connect your MetaMask to Kovan and open `http://localhost:3000`.

### API

The `API_URL` configured in `.env`, is called in components and the Vuex store to fetch data from the Subgraph and GitHub (issues, deposits, token information, etc.) and to authenticate a GitHub user. If you need to work on the endpoints [run the API server locally](https://github.com/Octobay/api).

### Octobay Adapters

Some API calls are the same for the frontend API and our [chainlink adapters](https://github.com/Octobay/chainlink-adapters) and potentially interesting for use in other places. They live in [their own repository](https://github.com/Octobay/adapters) and are published as an [NPM package](https://www.npmjs.com/package/@octobay/adapters).

## Design

The general design guideline is:

> *"Everything you need. Nothing you don't."*

The app aims to expose all its content and features even to browsers without web3 support and without being connected to a wallet or GitHub. Browsing the content should be without barriers. Buttons are replaced with ["connect" buttons](https://github.com/Octobay/app/blob/main/components/ConnectActionButton.vue) whereever needed.

## Nuxt/Vue

The app is build with [Nuxt.js](https://nuxtjs.org/) on top of [Vue.js](https://vuejs.org/) (v2). As part of a future update we will migrate to [Vue.js v3](https://v3.vuejs.org/). Some basic experience with these frameworks (or similar ones like React) is required to get comfortable with the app's codebase quickly.


## Web3

The [web3 plugin](https://github.com/Octobay/app/blob/main/plugins/web3.js) injects [`web3.js`](https://web3js.readthedocs.io/) into the app for web3 enabled browsers and [`web3.utils` ](https://web3js.readthedocs.io/en/v1.3.4/web3-utils.html#utils) for all browsers. It starts listeners for account and chain changes, to trigger necessary state updates, and adds a [global mixin](https://vuejs.org/v2/guide/mixins.html) to make our contracts accessible in the app's components.

> (!) Currently only MetaMask is supported. Other wallet integrations will be outsourced to the community as bounties.

### Contracts

The address of the main [Octobay contract](https://github.com/Octobay/contracts/blob/main/contracts/Octobay.sol) needs to to be set in `.env`. The most recent development deployment address is set in `.env.sample`.

From the main contract the other "module" contracts are derived. Their addresses are exposed as public properties of the Octobay contract and indexed as part of a [config object in our Subgraph](https://github.com/Octobay/subgraph/blob/8de938b36f783ef2dca0c0be8327d8a5862009c5/schema.graphql#L1-L11).

- **Governor**: Manages governance departments and creates new governance tokens for projects.
- **Governance Token Template**: Deployed for each governance department by the Governor.
- **Governance Permission NFT**: Manages NFTs representing permissions for a governance department (token).
- **Address Storage**: Stores verified Ethereum addresses of GitHub users.
- **Oracle Storage**: Stores addresses and job information of our oracle network.
- **Deposit Storage**: Holds and manages funds related to bounties and users.

> (!) The app mostly just writes to these contracts. It reads data from the [Octobay Subgraph](https://github.com/Octobay/subgraph) ([Explorer](https://thegraph.com/explorer/subgraph/octobay/octobay)).

The main contract, the Governor and the Governance NFT contract are initialized on demand, as computed component properties.

```
computed: {
  ...mapGetters(['config']),
  octobay() {
    return new app.$web3.eth.Contract(
      require('./../contract-abi/Octobay.json').abi,
      process.env.OCTOBAY_ADDRESS
    )
  },
  octobayGovernor() { ...
```

In every component, they are available as `this.octobay`, `this.octobayGovernor` and `this.octobayGovNFT`. Since there are multiple instances of Octobay governance tokens, `this.octobayGovToken` is a function that takes the address of the deployed token contract to initializes the `web3.eth.Contract`.

```
methods: {
  octobayGovToken(address) {
    return new app.$web3.eth.Contract(
      require('./../contract-abi/OctobayGovToken.json').abi,
      address
    )
  },
},
```

## Page Load

The [default layout ](https://github.com/Octobay/app/blob/main/layouts/default.vue) (used for `/` and `/gov`) uses the [`load` middleware](https://github.com/Octobay/app/blob/main/middleware/load.js) to connect to GitHub, load MetaMask account information and populate the initial state with some API calls.

## GitHub Authentication

The [`/auth/github`](https://github.com/Octobay/app/blob/main/pages/auth/github.vue) page is the redirect page for our OAuth app and takes an auth code and exchanges it for an access token via our API, stores it in the browser's local storage and redirects to `/`, where the `load` middleware loads the profile information of the GitHub user.

## Deeplinks

The state can also be prepopulated by certain deeplinks. Currently the send form can be prefilled with the following links:

- `/#/u/<username>`
- `/#/u/<username>/<amount>`
- `/#/i/<username>/<repository>/<issue number>`
- `/#/i/<username>/<repository>/<issue number>/<amount>`

The values are fetched from the location hash in the [`deeplinks` middleware](https://github.com/Octobay/app/blob/main/middleware/deeplinks.js) used in the default layout for `/` and `/gov`.