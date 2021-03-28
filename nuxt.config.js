import fs from 'fs'

export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  ssr: false,

  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'static',
  router: {
    base: process.env.BASE_PATH,
  },

  env: {
    OCTOBAY_ABI: JSON.parse(
      fs.readFileSync('./contract-abi/Octobay.json').toString()
    ).abi,
    OVT_ABI: JSON.parse(
      fs.readFileSync('./contract-abi/OctobayVisibilityToken.json').toString()
    ).abi,
  },

  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: 'OctoBay',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
      { property: 'og:title', content: 'OctoBay' },
      {
        property: 'og:image',
        content: 'https://octobay.github.io/app/cover.png',
      },
      { property: 'twitter:title', content: 'OctoBay' },
      {
        property: 'twitter:image',
        content: 'https://octobay.github.io/app/cover.png',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: './icon.png' },
      { rel: 'shortcut icon', type: 'image/png', href: './icon.png' },
    ],
  },
  /*
   ** Global CSS
   */
  css: ['@/assets/css/main.sass'],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    '@/plugins/moment',
    '@/plugins/tooltips',
    '@/plugins/clipboard',
    '@/plugins/web3',
    '@/plugins/octobay',
    '@/plugins/octicons',
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    [
      '@nuxtjs/dotenv',
      {
        path: './',
        only: [
          'API_URL',
          'APP_NAME',
          'GITHUB_CLIENT_ID',
          'OCTOBAY_ADDRESS',
          'OVT_ADDRESS',
          'GSN_RELAYHUB_ADDRESS',
          'GSN_PAYMASTER_ADDRESS',
          'MAX_CLAIMPR_AGE',
        ],
      },
    ],
    '@nuxtjs/fontawesome',
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/axios', '@nuxtjs/pwa'],
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    extend(config, ctx) {
      config.node = {
        fs: 'empty',
      }
    },
  },

  fontawesome: {
    icons: {
      regular: [
        'faCopy',
        'faCommentAlt',
        'faFlag',
        'faFrown',
        'faSmile',
        'faCalendarAlt',
      ],
      solid: [
        'faShareAlt',
        'faPlus',
        'faMinus',
        'faChevronUp',
        'faChevronDown',
        'faLongArrowAltUp',
        'faCheck',
        'faCheckDouble',
        'faBan',
        'faInfoCircle',
        'faQuestion',
        'faExclamation',
        'faExclamationTriangle',
        'faExclamationCircle',
        'faSignInAlt',
        'faSignOutAlt',
        'faAngleDoubleRight',
        'faExternalLinkAlt',
        'faCircleNotch',
        'faCircle',
        'faThumbtack',
        'faCoins',
        'faCodeBranch',
        'faFaucet',
        'faEnvelope',
        'faGlobeAmericas',
        'faGavel',
        'faUser',
        'faCode',
        'faTimes',
        'faStar',
        'faUsers',
        'faDice',
        'faSlidersH',
        'faHandHoldingUsd',
        'faExchangeAlt',
        'faCog',
      ],
      brands: ['faEthereum', 'faTwitter', 'faGithub', 'faDiscord'],
    },
  },
}
