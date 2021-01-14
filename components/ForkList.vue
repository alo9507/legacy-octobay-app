<template>
  <transition name="fade" mode="in-out">
    <div class="overlay" v-if="showForkList" @click="$store.commit('setShowForkList', false)">
      <div class="card shadow-sm oracle-list" @click.stop>
        <div class="card-body p-2">
          <h5 class="text-center text-muted-light py-3 px-5">Looking to support a certain project? Here's a list of projects using OctoBay.</h5>
          <a :class="'mt-2 text-left d-flex align-items-center btn btn-outline-light text-dark'" href="https://octobay.github.io/">
            <div class="ml-2 d-flex flex-column">
              OctoBay
              <small :class="'text-muted'">For every action that involves an oracle, choose a random one.</small>
            </div>
          </a>
          <a v-for="fork in forks" :class="'mt-2 text-left d-flex align-items-center btn btn-outline-light text-dark'" :href="`https://${fork.owner.login}.github.io/${fork.name}`">
            <font-awesome-icon :icon="['fas', 'user']" class="mx-2 fa-2x" />
            <div class="ml-2 mr-auto d-flex flex-column">
              {{ fork.name }}
              <small>$0.24/Request</small>
            </div>
            <div class="d-flex flex-column align-items-end pr-3">
              <small>Reliability:</small>
              <b>99.99 %</b>
              <small>(1681/1682)</small>
            </div>
          </a>
        </div>
      </div>
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
.oracle-list
  position: absolute
  top: 35%
  left: 50%
  margin-left: -180px
  width: 360px
  z-index: 6
  .card-body
    overflow: auto
</style>

<script>
import {
  mapGetters
} from "vuex"

export default {
  computed: {
    ...mapGetters(['showForkList', 'forks'])
  }
}
</script>
