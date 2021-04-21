<template>
  <div>
    <div class="card-body pb-0">
      <div v-if="ownDepartments.length" class="department-list">
        <Department
          v-for="department in ownDepartments"
          :key="department.address"
          :department="department"
        />
      </div>
      <div v-else class="text-center text-muted my-3">
        You have not created any<br />departments yet.
      </div>
    </div>
    <div class="card-body">
      <ConnectActionButton :action="newDepartment" :required="['wallet']">
        New Department
      </ConnectActionButton>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['ownDepartments']),
    ...mapGetters('github', {
      githubUser: 'user',
      githubAuthUrl: 'authUrl',
    }),
  },
  mounted() {
    this.$store.dispatch('updateDepartments')
  },
  methods: {
    newDepartment() {
      this.$store.commit('setModalData', null)
      this.$store.commit('setModalComponent', 'ModalNewDepartment')
      this.$store.commit('setShowModal', true)
    },
  },
}
</script>

<style lang="sass" scoped>
.department-list
  margin: 0 -1.25rem
  > a
    border: solid 1px eee
    color: #333
    &:hover
      border-color: transparent
      background: #0366d6
      color: white
      .text-muted,
      .text-danger
        color: white !important
      .badge-pill
        background: white
        color: #0366d6
</style>
