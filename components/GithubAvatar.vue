<template>
  <a
    :href="profileUrl"
    target="_blank"
    class="rounded-circle github-avatar mr-1 shadow-sm"
    :style="`width: ${size}; height: ${size}; background-image: url(${avatarUrl})`"
  ></a>
</template>

<script>
export default {
  props: {
    profileUrl: {
      type: String,
      default: '',
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '2em',
    },
  },
}
</script>

<style lang="sass">
.github-avatar
  display: block
  background-repeat: no-repeat
  background-position: center center
  background-size: 100%
</style>
