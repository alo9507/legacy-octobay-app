export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  ssr: false,

  router: {
    base: process.env.NUXT_ROUTER_BASE_DIR || '/',
  },

  env: {
    BASE_DIR: process.env.NUXT_ROUTER_BASE_DIR || '/',
    API_URL: process.env.API_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    OCTOBAY_ADDRESS: process.env.OCTOBAY_ADDRESS,
    CHAIN_ID: process.env.CHAIN_ID,
  },

  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'static',

  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: 'Octobay App',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
      { property: 'og:title', content: 'Octobay' },
      {
        property: 'og:image',
        content: 'https://octobay.github.io/app/cover.png',
      },
      { property: 'twitter:title', content: 'Octobay' },
      {
        property: 'twitter:image',
        content: 'https://octobay.github.io/app/cover.png',
      },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/png',
        href: (process.env.NUXT_ROUTER_BASE_DIR || '/') + 'icon.png',
      },
      {
        rel: 'shortcut icon',
        type: 'image/png',
        href: (process.env.NUXT_ROUTER_BASE_DIR || '/') + 'icon.png',
      },
    ],
  },
  loading: {
    color: '#652FFF',
    height: '5px',
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
    '@/plugins/octicons',
    '@/plugins/api',
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
    extend(config) {
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
        'faBook',
        'faCopy',
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
        'faThumbsUp',
        'faThumbsDown',
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
        'faKey',
        'faComments',
        'faVoteYea',
        'faFire',
        'faWallet',
        'faShare',
        'faPlay',
      ],
      brands: ['faEthereum', 'faTwitter', 'faGithub', 'faDiscord'],
    },
  },
}
