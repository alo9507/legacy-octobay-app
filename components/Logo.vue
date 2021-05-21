<template>
  <div
    :class="[
      'logo d-flex flex-column align-items-center',
      {
        'logo-xl': size == 'xl',
        'logo-lg': size == 'lg',
      },
    ]"
  >
    <img
      :src="baseDir + 'logo.png'"
      :width="size == 'xl' ? 70 : size == 'lg' ? 50 : size == 'md' ? 46 : 30"
    />
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: 'sm',
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
  font-family: 'Fredoka', serif
  font-size: 0.8rem
  line-height: 1.7rem
  &.logo-lg
    font-size: 1.5rem
    line-height: 2.5rem
  &.logo-xl
    font-size: 2rem
    line-height: 3.5rem
</style>
