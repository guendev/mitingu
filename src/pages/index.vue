<template>
  <div style="height: 100vh; overflow-y: auto">

    <room-confirm v-if="roomStore.page === 'confirm'" />
    <room-layout v-else-if="roomStore.page === 'room'" :count="10" />

  </div>
</template>

<script lang="ts" setup>
const roomStore = useRoomStore()
</script>

<style scoped></style>
