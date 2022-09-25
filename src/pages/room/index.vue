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

const axios = useAxios()
const route = useRoute()

const getMembers = async () => {
  try {
    roomStore.members = await axios.get(`/smileeye/list-member/goal_root_id=${route.params.id}`)
  } catch (e) {
    //
  }
}

const checkRoomAsync = async () => {
  try {
    const result: any = await axios.get(`/smileeye/detail-goal/goal_id=${route.params.id}`)
    if(result) {
      roomStore.goal = result
      await getMembers()
    }
  } catch (e) {
    //
  }
}

onMounted(() => nextTick(() => checkRoomAsync()))
</script>

<style scoped>
#room-body {
  @apply flex h-[calc(100vh-60px)] flex-col p-[20px];
}
</style>
