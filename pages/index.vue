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
      <!-- <a href="#" :class="'mx-2 text-' + (view === 'contributors' ? 'primary' : 'muted')" @click="$store.commit('setView', 'contributors')">Contributors</a> -->
      <a
        v-if="registeredAccount === account"
        href="#"
        :class="'mx-2 text-' + (view === 'claim' ? 'primary' : 'muted')"
        @click="$store.commit('setView', 'claim')"
        >Claim</a
      >
      <a
        v-else
        href="#"
        :class="'mx-2 text-' + (view === 'register' ? 'primary' : 'muted')"
        @click="$store.commit('setView', 'register')"
        >Register</a
      >
      <a
        v-if="account && account === octoBayOwner"
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
        <Contributors v-else-if="view == 'contributors'" />
        <Claim v-else-if="view == 'claim'" />
        <Register v-else-if="view == 'register'" />
        <Admin
          v-else-if="account && account === octoBayOwner && view == 'admin'"
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
    ...mapGetters(['view', 'account', 'registeredAccount', 'octoBayOwner']),
    ...mapGetters('github', { githubUser: 'user' }),
  },
}
</script>
