<template>
  <div class="content card overflow-hidden border-0 shadow-lg">
    <div class="d-flex justify-content-around mt-4 px-2 font-weight-bold">
      <button
        :class="
          'btn btn-link mx-2 text-' +
          (view === 'departments' ? 'primary' : 'muted')
        "
        @click="$store.commit('setView', 'departments')"
      >
        Departments
      </button>
      <button
        :class="
          'btn btn-link mx-2 text-' +
          (view === 'proposals' ? 'primary' : 'muted')
        "
        @click="$store.commit('setView', 'proposals')"
      >
        Proposals
      </button>
    </div>
    <transition name="fade" mode="out-in">
      <keep-alive>
        <Departments v-if="view == 'departments'" />
        <Proposals v-if="view == 'proposals'" />
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  transition: 'fade',
  computed: {
    ...mapGetters(['view', 'account', 'registeredAccount', 'octoBayOwner']),
    ...mapGetters('github', { githubUser: 'user' }),
  },
  watch: {
    githubUser() {
      if (this.githubUser) {
        // TODO: fetch info from subgraph
      } else {
        this.$store.commit('setRegisteredAccount', null)
      }
    },
  },
  mounted() {
    this.$store.commit('setView', 'departments')
  },
}
</script>
