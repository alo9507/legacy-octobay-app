<template>
  <div>
    <div class="card-body">
      <button
        class="btn btn-lg btn-primary w-100 shadow-sm"
        :disabled="!selectedDepartment"
        @click="newProposal()"
      >
        New Proposal
      </button>
    </div>
    <div class="card-body border-top">
      <select v-model="selectedDepartment" class="custom-select rounded-xl">
        <option :value="null">Select Departments</option>
        <option
          v-for="department in departments"
          :key="department.address"
          :value="department"
        >
          {{ department.name }}
        </option>
      </select>
    </div>
    <div class="card-body pt-0">
      <div
        v-if="selectedDepartment && selectedDepartment.proposals.length"
        class="proposal-list"
      >
        <Proposal
          v-for="proposal in selectedDepartment.proposals"
          :key="proposal.id"
          :proposal="proposal"
        />
      </div>
      <div v-else class="text-center text-muted my-3">
        Currently no proposals.
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['departments']),
    selectedDepartment: {
      get() {
        return this.$store.state.selectedDepartment
      },
      set(value) {
        this.$store.commit('setSelectedDepartment', value)
      },
    },
  },
  methods: {
    newProposal() {
      this.$store.commit('setModalData', null)
      this.$store.commit('setModalComponent', 'ModalNewProposal')
      this.$store.commit('setShowModal', true)
    },
  },
}
</script>

<style lang="sass" scoped>
.proposal-list
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
