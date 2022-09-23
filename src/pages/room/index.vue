<template>
  <div
    id="room"
    class="h-screen"
    :class="[roomStore.page === 'room' ? 'bg-primary-50' : '' ]"
  >
    <room-confirm v-if="roomStore.page === 'confirm'" />
    <template v-else-if="roomStore.page === 'room'">
      <room-head />
      <div id="room-body">
        <room-content />
        <room-footer />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
const roomStore = useRoomStore()
</script>

<style scoped>
#room-body {
  @apply flex h-[calc(100vh-60px)] flex-col p-[20px];
}
</style>
