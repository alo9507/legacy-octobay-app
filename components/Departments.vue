<template>
  <div>
    <div class="card-body pb-0">
      <div v-if="departments.length" class="department-list">
        <Department
          v-for="department in departments"
          :key="department.address"
          :department="department"
        />
      </div>
      <div v-else class="text-center text-muted my-3">No departments.</div>
    </div>
    <div class="card-body">
      <button
        class="btn btn-lg btn-primary w-100 shadow-sm"
        @click="newDepartment()"
      >
        New Department
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['departments']),
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
