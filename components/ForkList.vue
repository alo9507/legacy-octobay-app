<template>
  <transition name="fade" mode="in-out">
    <div class="overlay" v-if="showForkList" @click="$store.commit('setShowForkList', false)">
      <div class="card shadow-sm fork-list" @click.stop>
        <div class="card-body px-2 pt-2 pb-0">
          <h5 class="text-center text-muted-light py-3 px-4 m-0">Explore the ecosystem. Here's a list of all OctoBay forks.</h5>
          <div class="text-right">
            <small>
              <a href="https://github.com/octobay/app/fork" target="_blank" class="font-weight-bold">create fork</a>
            </small>
          </div>
        </div>
        <div class="card-header border-0 p-2">
          <input type="text" class="form-control form-control-lg" placeholder="Search" v-model="forkSearch" />
        </div>
        <div class="card-body p-2">
          <a :class="'mt-2 text-left d-flex align-items-center btn btn-outline-light text-dark'" href="https://octobay.github.io/">
            <img :src="'./icon.png'" width="32" height="32" class="rounded-circle shadow-sm" />
            <div class="ml-2 d-flex flex-column">
              OctoBay
              <small :class="'text-muted'">Ethereum payment service for GitHub users.</small>
            </div>
          </a>
          <a v-for="fork in filteredForkList" :class="'mt-2 text-left d-flex align-items-center btn btn-outline-light text-dark'" :href="`https://${fork.username}.github.io/${fork.repository}`">
            <div target="_blank" class="rounded-circle shadow-sm avatar border" :style="'background-image: url(' + fork.logo + ')'"></div>
            <div class="ml-2 mr-auto d-flex flex-column">
              <div class="d-flex justify-content-between">
                {{ fork.username }}
                <small class="text-muted">
                  <small><font-awesome-icon :icon="['fas', 'star']" /></small>
                  {{ fork.stars }}
                </small>
              </div>
              <small>{{ fork.description }}</small>
            </div>
          </a>
          <button class="btn btn-outline-light text-dark btn-block my-2" @click="showNum += 25" v-if="!forkSearch && forks.length > 25">
            Show more
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="sass" scoped>
.avatar
  width: 32px
  height: 32px
  background-repeat: no-repeat
  background-position: center center
  background-size: 100%
  border-width: 2px !important
.overlay
  position: fixed
  top: 0
  right: 0
  bottom: 0
  left: 0
  z-index: 5
  background: rgba(0, 0, 0, 0.5)
.fork-list
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
  data() {
    return {
      forkSearch: '',
      showNum: 25
    }
  },
  computed: {
    ...mapGetters(['showForkList', 'forks']),
    filteredForkList() {
      const search = this.forkSearch.toLowerCase()
      const forkList = this.forkSearch ?
        this.forks.filter(fork => fork.username.toLowerCase().includes(search)).splice(0, this.showNum) :
        this.forks.filter(fork => fork).splice(0, this.showNum)
      forkList.sort((a, b) => a.stars < b.stars)
      return forkList
    }
  }
}
</script>
