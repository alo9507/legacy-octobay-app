<template>
  <img :class="'logo ' + variant" :src="baseDir + 'logo.png'" :width="width" />
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: '195px',
    },
    variant: {
      type: String,
      default: 'colored',
    },
  },
  data() {
    return {
      baseDir: process.env.BASE_DIR,
    }
  },
}
</script>

<style lang="sass">
.logo
  &.grayscale
    filter: grayscale(100%)
    opacity: 0.07
  &.white
    filter: contrast(0%) brightness(999%)
</style>
