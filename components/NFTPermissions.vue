<template>
  <div class="d-flex justify-content-around align-items-center px-2">
    <div class="text-center w-25">
      <font-awesome-icon
        v-if="(nft && nft.permissions.includes('MINT')) || perms[0]"
        :icon="['fas', 'check']"
        class="text-success"
      />
      <font-awesome-icon v-else :icon="['fas', 'ban']" class="text-danger" />
    </div>
    <div class="text-center w-25">
      <font-awesome-icon
        v-if="(nft && nft.permissions.includes('TRANSFER')) || perms[1]"
        :icon="['fas', 'check']"
        class="text-success"
      />
      <font-awesome-icon v-else :icon="['fas', 'ban']" class="text-danger" />
    </div>
    <div class="text-center w-25">
      <font-awesome-icon
        v-if="
          (nft && nft.permissions.includes('SET_ISSUE_GOVTOKEN')) || perms[2]
        "
        :icon="['fas', 'check']"
        class="text-success"
      />
      <font-awesome-icon v-else :icon="['fas', 'ban']" class="text-danger" />
    </div>
    <div class="text-center w-25">
      <font-awesome-icon
        v-if="(nft && nft.permissions.includes('CREATE_PROPOSAL')) || perms[3]"
        :icon="['fas', 'check']"
        class="text-success"
      />
      <font-awesome-icon v-else :icon="['fas', 'ban']" class="text-danger" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    nft: {
      type: Object,
      default: null,
    },
    perms: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
