<template>
  <div
    v-if="!$web3"
    class="alert alert-info border-0 my-3"
    style="max-width: 330px"
  >
    You need an Ethereum compatible browser to use this service.
  </div>
</template>
