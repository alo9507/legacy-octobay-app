<template>
  <div class="card shadow-sm d-flex flex-column" @click.stop>
    <div class="card-body modal-body flex-fill">
      <h5 class="text-center text-muted-light py-3 px-4 m-0">New Proposal</h5>
      <div>
        <b>Link to Discussion on GitHub</b>
        <input
          type="text"
          class="form-control form-control-lg form-control-with-embed mb-2"
          placeholder="https://github.com/..."
        />
      </div>
      <div>
        <small>Governance Department</small>
        <select class="custom-select rounded-xl">
          <option>Octobay Strategy (OSG)</option>
        </select>
      </div>
      <div class="mt-2">
        <div class="d-flex align-items-end">
          <div class="mr-1">
            <small class="d-flex">Start Date</small>
            <input
              type="text"
              class="form-control mb-2"
              placeholder="Mar 29th 2021"
            />
          </div>
          <div class="ml-1">
            <small class="d-flex">End Date</small>
            <input
              type="text"
              class="form-control mb-2"
              placeholder="Apr 29th 2021"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="card-body pt-0">
      <button class="btn btn-lg btn-primary w-100 shadow-sm">
        Create Proposal
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    ...mapGetters(['oracles', 'account']),
  },
}
</script>
