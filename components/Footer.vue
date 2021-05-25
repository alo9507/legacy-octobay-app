<template>
  <footer class="text-center">
    <div class="mb-3">
      <a
        href="https://twitter.com/OctobayApp"
        target="_blank"
        class="text-white px-2"
      >
        <font-awesome-icon :icon="['fab', 'twitter']" />
      </a>
      <a
        href="https://discord.gg/DhKgHrFeCD"
        target="_blank"
        class="text-white px-2"
      >
        <font-awesome-icon :icon="['fab', 'discord']" />
      </a>
      <a
        href="https://github.com/octobay"
        target="_blank"
        class="text-white px-2"
      >
        <font-awesome-icon :icon="['fab', 'github']" />
      </a>
    </div>
    <div class="d-flex flex-column">
      <a href="https://octobay.org" target="_blank" class="text-white">
        about
      </a>
      <a href="https://docs.octobay.org" target="_blank" class="text-white">
        documentation
      </a>
      <span class="text-white" style="opacity: 0.2; pointer-events: none">
        governance
      </span>
    </div>
    <div class="headers text-white mt-5 pt-5">
      <h1 class="mb-5">Octobay</h1>
      <h2>
        Decentralized Job Marketplace<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;for
        Developers
      </h2>
    </div>
  </footer>
</template>

<style lang="sass" scoped>
footer
  background-color: white
  background-image: url('/footer-bg.png')
  background-size: 110%
  background-repeat: no-repeat
  background-position: top
  min-height: 85vw
  padding-top: 12vw
  font-size: 1.9rem
  font-weight: 800
  .oracle-button
    transition: opacity .2s ease
    &:hover,
    &:active,
    &:focus
      text-decoration: none
  .donate-btn
    position: relative
    z-index: 1
  .donate
    max-width: 330px
    position: relative
    z-index: 0
    opacity: 0
    max-height: 0
    transition: opacity .3s ease, max-height .3s ease
    &.show
      opacity: 1
      max-height: 500px

  .headers
    opacity: 0
    animation-name: header-content-fade
    animation-duration: 4s
    animation-fill-mode: forwards
    animation-timing-function: cubic-bezier(0.25, 1, 0.5, 1)
    animation-delay: 5.5s
    h1
      font-weight: 900
      font-size: 7vw
      margin-left: -10vw
      text-shadow: 0 0 35px rgba(0, 0, 0, 0.3)
      animation-name: header-content-slide-left
      animation-duration: 2s
      animation-fill-mode: forwards
      animation-timing-function: cubic-bezier(0.25, 1, 0.5, 1)
      animation-delay: 5.5s
    h2
      margin-top: 1rem
      font-weight: 700
      font-size: 4vw
      text-shadow: 0 0 35px rgba(0, 0, 0, 0.6)
      animation-name: header-content-slide-right
      animation-duration: 2s
      animation-fill-mode: forwards
      animation-timing-function: cubic-bezier(0.25, 1, 0.5, 1)
      animation-delay: 5.5s

@keyframes header-content-fade
  from
    opacity: 0
  to
    opacity: 1

@keyframes header-content-slide-left
  from
    padding-left: 4rem

  to
    padding-left: 0rem

@keyframes header-content-slide-right
  from
    padding-left: 0rem
  to
    padding-left: 4rem
</style>
