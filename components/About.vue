<template>
  <div class="about">
    <div class="intro container mb-5 pb-5">
      <h4 class="text-center text-secondary">
        Workflow Driven Open Source Economy
      </h4>
      <h1 class="text-center">
        Smart Bounties, Atomic Contracting &amp; more...
      </h1>
      <p class="text-center lead pt-4 text-muted">
        Powered by <span class="text-secondary">Ethereum</span> and
        <span class="text-secondary">GitHub</span>, Octobay provides new and
        improved ways to benefit from open source collaboration and reduces
        delays and counterparty risks in contracting by integrating payments
        directly into your existing workflows and deployment pipelines.
      </p>
    </div>
    <div class="p-3"></div>
    <div class="container position-relative my-5 py-5">
      <div class="card w-75 p-5 mt-5 shadow-lg border-0">
        <h4 class="text-secondary mb-0">
          Fund Issues, Get Devs. Resolve Issues, Get Paid.
        </h4>
        <h1 class="mb-4">Smart Bounties</h1>
        <p class="lead text-muted">
          Create bounties by depositing on open issues. Withdrawals are only
          possible once an issue is closed. If a
          <a
            href="https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-issues/linking-a-pull-request-to-an-issue"
            target="_blank"
          >
            pull request was involved
          </a>
          only its author is eligible to withdraw. 30 days after an issue has
          been closed, deposits can be refunded to their senders.<br />
          <br />
          Bounties can also be released manually by maintainers commenting on an
          issue.
        </p>
      </div>
      <img
        :src="baseDir + 'content-tipping.png'"
        class="position-absolute content-image"
      />
    </div>
    <div class="bg-secondary">
      <img :src="baseDir + 'wave-top.png'" />
      <div class="container position-relative mt-5 py-5">
        <img
          :src="baseDir + 'content-bounties.png'"
          class="position-absolute content-image"
        />
        <div class="card w-75 p-5 mt-3 mb-5 ml-auto shadow-lg border-0">
          <h4 class="text-secondary mb-0">
            Enterprise funding with open source recruiting
          </h4>
          <h1 class="mb-4">Atomic Contracting</h1>
          <p class="lead text-muted">
            Atomic Contracts are a combination of escrow smart contracts and
            CI/CD workflows, to facilitate larger scale payment models, like in
            traditional contracting.<br />
            <br />
            <a href="https://medium.com/octobay" target="_blank">
              Atomic contracting helps you
            </a>
            to maintain a high overall project quality and to keep your
            processes clear.
          </p>
        </div>
      </div>
    </div>
    <img :src="baseDir + 'wave-bottom.png'" />
    <div class="p-3"></div>
    <div class="container position-relative my-5 py-5">
      <div class="card w-75 p-5 mt-5 shadow-lg border-0">
        <h4 class="text-secondary mb-0">Inviting GitHub to Ethereum</h4>
        <h1 class="mb-4">Tipping &amp; Subscriptions</h1>
        <p class="lead text-muted">
          Through our escrow contracts any GitHub user or project can receive
          crypto, even without connecting and verifying a wallet first.
          Scheduled payments can depict sponsorships and other forms of
          subscriptions.<br />
          <br />
          Use
          <a href="/#/u/mktcode/0.1" @click="scrollToTop">deeplinks</a>
          to request payments or ask for donations.
        </p>
      </div>
      <img
        :src="baseDir + 'content-bounties.png'"
        class="position-absolute content-image"
      />
    </div>
    <img :src="baseDir + 'wave-footer.svg'" class="w-100" />
    <div class="bg-secondary text-white">
      <div
        class="container px-5 pb-5 pt-0 text-white d-flex flex-column align-items-center"
        style="font-size: 1.9rem; font-weight: 800"
      >
        <div class="social-icons">
          <a
            href="https://twitter.com/OctoBayApp"
            target="_blank"
            class="btn text-white"
          >
            <font-awesome-icon
              :icon="['fab', 'twitter']"
              style="font-size: 2.5rem"
            />
          </a>
          <a
            href="https://github.com/OctoBay/"
            target="_blank"
            class="btn text-white"
          >
            <font-awesome-icon
              :icon="['fab', 'github']"
              style="font-size: 2.5rem"
            />
          </a>
          <a
            href="https://discord.gg/DhKgHrFeCD"
            target="_blank"
            class="btn text-white"
          >
            <font-awesome-icon
              :icon="['fab', 'discord']"
              style="font-size: 2.5rem"
            />
          </a>
        </div>
        <div class="d-flex flex-column align-items-center mt-5">
          <a href="#about" class="text-white">Imprint</a>
          <span class="text-white" style="opacity: 0.2; pointer-events: none">
            Terms of Service
          </span>
          <span class="text-white" style="opacity: 0.2; pointer-events: none">
            Privacy Policy
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseDir: process.env.BASE_DIR,
    }
  },
  methods: {
    scrollToTop() {
      setTimeout(() => window.scrollTo(0, 0), 500)
    },
  },
}
</script>

<style lang="sass">
.about
  .intro
    h1
      font-size: 4vw
      font-weight: 800
    h4
      font-size: 2vw
    p
      font-size: 2vw
  .card
    background: white
    z-index: 1
    h1
      font-size: 3vw
      font-weight: 800
    h4
      font-size: 1.5vw
    p
      font-size: 1.5vw
  .content-image
    z-index: 0
    width: 36vw
    &:first-child
      top: 0
      left: -9vw
    &:last-child
      top: 0
      right: -9vw
</style>
