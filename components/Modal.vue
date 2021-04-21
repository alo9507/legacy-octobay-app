<template>
  <transition name="fade" mode="in-out">
    <div
      v-if="showModal"
      class="overlay d-flex justify-content-center align-items-center"
      @click="close()"
    >
      <component :is="modalComponent"></component>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['showModal', 'modalComponent']),
  },
  methods: {
    close() {
      this.$store.commit('setModalData', null)
      this.$store.commit('setShowModal', false)
    },
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
