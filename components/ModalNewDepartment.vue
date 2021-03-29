<template>
  <div class="card shadow-sm d-flex flex-column" @click.stop>
    <div class="card-body modal-body flex-fill">
      <h5 class="text-center text-muted-light py-3 px-4 m-0">New Department</h5>
      <div>
        <b>Link to Repository or Organization</b>
        <input
          type="text"
          class="form-control form-control-lg form-control-with-embed mb-2"
          placeholder="https://github.com/..."
        />
      </div>
      <div>
        <b>Token Details</b>
        <div class="d-flex">
          <div class="mr-1">
            <input
              type="text"
              class="form-control form-control-lg form-control-with-embed mb-2"
              placeholder="Name"
            />
          </div>
          <div class="ml-1">
            <input
              type="text"
              class="form-control form-control-lg form-control-with-embed mb-2"
              placeholder="Symbol"
            />
          </div>
        </div>
      </div>
      <div>
        <div class="d-flex align-items-end">
          <div class="mr-1">
            <small class="d-flex">Share to create proposals</small>
            <input
              type="text"
              class="form-control form-control-lg form-control-with-embed mb-2"
              placeholder="1-100 %"
            />
          </div>
          <div class="ml-1">
            <small class="d-flex">Default Quorum</small>
            <input
              type="text"
              class="form-control form-control-lg form-control-with-embed mb-2"
              placeholder="1-100 %"
            />
          </div>
        </div>
      </div>
      <div>
        <b>Permission NFT</b><br />
        <small>This NFT can be copied and handed out to others.</small>
        <div class="d-flex mt-2">
          <input type="checkbox" class="mr-2" />
          <div class="d-flex flex-column">Change Token Settings</div>
        </div>
        <div class="d-flex">
          <input type="checkbox" class="mr-2" />
          <div class="d-flex flex-column">
            Create Proposals
            <small class="text-muted">regardless of token holdings</small>
          </div>
        </div>
        <div class="d-flex">
          <input type="checkbox" class="mr-2" />
          <div class="d-flex flex-column">
            Cast Votes equal to
            <small class="text-muted">regardless of token holdings</small>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body">
      <button class="btn btn-lg btn-primary w-100 shadow-sm">
        Create new Department
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
