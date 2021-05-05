<template>
  <transition name="fade" mode="in-out">
    <div
      v-if="showModal"
      class="overlay d-flex justify-content-center align-items-center"
      @click="modalBlocksUi || closeModal()"
    >
      <component :is="modalComponent"></component>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import helpers from '@/mixins/helpers'

export default {
  mixins: [helpers],
  computed: {
    ...mapGetters(['showModal', 'modalComponent', 'modalBlocksUi']),
  },
}
</script>

<style lang="sass" scoped>
.overlay
  position: fixed
  top: 0
  right: 0
  bottom: 0
  left: 0
  z-index: 5
  background: rgba(0, 0, 0, 0.5)
.card
  position: static
  width: 360px
  max-height: 90%
  z-index: 6
</style>
