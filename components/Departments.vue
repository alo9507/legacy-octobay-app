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
      <ConnectActionButton
        :action="() => openModal('ModalNewDepartment')"
        size="lg"
      >
        New Department
      </ConnectActionButton>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import helpers from '@/mixins/helpers'

export default {
  mixins: [helpers],
  computed: {
    ...mapGetters(['ownDepartments']),
  },
  mounted() {
    this.$store.dispatch('updateDepartments')
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
