<template>
  <transition name="fade" mode="in-out">
    <div class="overlay d-flex justify-content-center align-items-center" v-if="showModal" @click="$store.commit('setShowModal', false)">
      <component v-bind:is="modalComponent"></component>
    </div>
  </transition>
</template>

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

<script>
import { mapGetters } from 'vuex'
import ModalTwitterPost from './ModalTwitterPost.vue'

export default {
  components: { ModalTwitterPost },
  computed: {
    ...mapGetters(['showModal', 'modalComponent'])
  }
}
</script>
