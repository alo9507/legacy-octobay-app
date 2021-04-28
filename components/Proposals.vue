<template>
  <div>
    <div class="card-body">
      <ConnectActionButton
        :action="() => openModal('ModalNewProposal')"
        :required="['wallet']"
        size="lg"
      >
        New Proposal
      </ConnectActionButton>
    </div>
    <div class="card-body border-top">
      <select v-model="selectedDepartment" class="custom-select rounded-xl">
        <option :value="null">Select Department</option>
        <option
          v-for="department in ownDepartments"
          :key="department.address"
          :value="department"
        >
          {{ department.name }}
        </option>
      </select>
    </div>
    <div class="card-body pt-0">
      <div v-if="filteredProposals.length" class="proposal-list">
        <Proposal
          v-for="proposal in filteredProposals"
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
import helpers from '@/mixins/helpers'

export default {
  mixins: [helpers],
  computed: {
    ...mapGetters(['ownDepartments']),
    selectedDepartment: {
      get() {
        return this.$store.state.selectedDepartment
      },
      set(value) {
        this.$store.commit('setSelectedDepartment', value)
      },
    },
    filteredProposals() {
      if (this.selectedDepartment) {
        return this.selectedDepartment.proposals
      } else {
        return this.ownDepartments.reduce(
          (proposals, department) => [...proposals, ...department.proposals],
          []
        )
      }
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
