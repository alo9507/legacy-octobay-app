<template>
  <div
    :class="[
      'logo d-flex flex-column align-items-center',
      {
        'logo-xl': size == 'xl',
        'logo-lg': size == 'lg',
        'text-white': color == 'white',
        'text-dark': color == 'dark',
      },
    ]"
  >
    <img
      :src="color == 'white' ? './logo-white.png' : './logo-black.png'"
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
    color: {
      type: String,
      default: 'white',
    },
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
