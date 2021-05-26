<template>
  <footer
    class="text-center"
    :style="`background-image: url('${baseDir}footer-bg.png')`"
  >
    <div class="d-flex flex-column">
      <a href="#about" class="text-white mb-3" style="font-size: 2.2vw">
        <small class="about-arrow">
          <font-awesome-icon :icon="['fas', 'chevron-down']" />
        </small>
        about
      </a>
      <a href="https://docs.octobay.org" target="_blank" class="text-white">
        documentation
        <sup style="opacity: 0.3">
          <small>
            <font-awesome-icon :icon="['fas', 'external-link-alt']" />
          </small>
        </sup>
      </a>
      <span class="text-white" style="opacity: 0.2; pointer-events: none">
        governance
      </span>
    </div>
    <div class="mt-3 mb-4">
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
    <a id="about" />
    <div class="headers text-white mt-5 pt-5">
      <h1 class="mb-4">Octobay</h1>
      <h2>
        Decentralized Job Marketplace<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;for
        Developers
      </h2>
      <div class="mt-5 pt-5 d-flex flex-column align-items-center">
        <button
          class="btn btn-lg py-3 px-5 btn-primary play-button"
          style="font-size: 1.9rem; border-radius: 2.5rem"
        >
          <small class="pr-2" style="opacity: 0.5">
            <font-awesome-icon :icon="['fas', 'play']" />
          </small>
          How it works
        </button>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      baseDir: process.env.BASE_DIR,
    }
  },
}
</script>

<style lang="sass" scoped>
footer
  background-color: white
  background-size: 110%
  background-repeat: no-repeat
  background-position: top
  min-height: 85vw
  padding-top: 12vw
  font-size: 1.9rem
  font-weight: 800
  .about-arrow
    position: relative
    opacity: 0
    animation-name: about-arrow-bounce
    animation-duration: 1.5s
    animation-fill-mode: forwards
    animation-iteration-count: 6

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
      text-shadow: 0 0 35px rgba(255, 255, 255, 0.7), 0 -3px 3px rgba(0, 0, 0, 0.2)
      animation-name: header-content-slide-left
      animation-duration: 8s
      animation-fill-mode: forwards
      animation-timing-function: cubic-bezier(0.25, 1, 0.5, 1)
      animation-delay: 5.5s
    h2
      margin-top: 1rem
      font-weight: 700
      font-size: 4vw
      text-shadow: 0 0 25px rgba(255, 255, 255, 0.8), 0 -3px 3px rgba(0, 0, 0, 0.2)
      animation-name: header-content-slide-right
      animation-duration: 8s
      animation-fill-mode: forwards
      animation-timing-function: cubic-bezier(0.25, 1, 0.5, 1)
      animation-delay: 5.5s
    .play-button
      box-shadow: 0 0 55px rgba(255, 255, 255, 0.8), 0 -3px 3px rgba(0, 0, 0, 0.4) !important

@keyframes about-arrow-bounce
  0%
    opacity: 0
    top: -20px
  100%
    opacity: 0.5
    top: 0

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
