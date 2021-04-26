<template>
  <div class="content card overflow-hidden border-0 shadow-lg">
    <div class="d-flex justify-content-around mt-4 px-2 font-weight-bold">
      <a
        href="#"
        :class="'mx-2 text-' + (view === 'send' ? 'primary' : 'muted')"
        @click="$store.commit('setView', 'send')"
        >Send</a
      >
      <a
        href="#"
        :class="'mx-2 text-' + (view === 'issues' ? 'primary' : 'muted')"
        @click="$store.commit('setView', 'issues')"
        >Pinboard</a
      >
      <a
        href="#"
        :class="'mx-2 text-' + (view === 'claim' ? 'primary' : 'muted')"
        @click="$store.commit('setView', 'claim')"
        >Claim</a
      >
      <a
        v-if="account && (account === octobayOwner || octobayAdmin)"
        href="#"
        :class="'mx-2 text-' + (view === 'admin' ? 'primary' : 'muted-light')"
        @click="$store.commit('setView', 'admin')"
      >
        <font-awesome-icon :icon="['fas', 'sliders-h']" />
      </a>
    </div>
    <transition name="fade" mode="out-in">
      <keep-alive>
        <SendForm v-if="view == 'send'" />
        <IssuesList v-else-if="view == 'issues'" />
        <Claim v-else-if="view == 'claim'" />
        <Admin
          v-else-if="
            account &&
            (account === octobayOwner || octobayAdmin) &&
            view == 'admin'
          "
        />
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  transition: 'fade',
  computed: {
    ...mapGetters(['view', 'account', 'octobayOwner', 'octobayAdmin']),
    ...mapGetters('github', { githubUser: 'user' }),
  },
  mounted() {
    this.$store.commit('setView', 'send')
  },
}
</script>
