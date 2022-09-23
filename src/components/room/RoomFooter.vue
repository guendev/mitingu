<template>
  <div id="room-footer" class="relative flex items-center justify-center">
    <div class="float-group left-[20px]">
      <h1 class="mb-0 text-[17px] text-gray-500">
        {{ time }} : 50025
      </h1>
    </div>

    <button class="base-button">
      <i-ic-round-mic />
    </button>

    <button class="base-button ml-4">
      <i-ic-round-videocam />
    </button>

    <button class="base-button ml-4">
      <i-typcn-user-add />
    </button>

    <button class="base-button ml-4">
      <i-ph-dots-three-outline-vertical-fill />
    </button>

    <button class="w-14 h-10 bg-rose-500 rounded-full flex justify-center items-center text-white ml-4 text-[18px]">
      <i-fluent-call-end-16-filled />
    </button>

    <div class="float-group right-[20px] flex items-center text-gray-500">
      <button
          class="flex items-center justify-center text-[18px] transition"
          :class="[roomStore.sidebar === 'users' ? 'text-primary-500' : 'text-gray-500']"
          @click="roomStore.toogleTab('users')"
      >
        <i-majesticons-users />
      </button>
      <button
          class="flex items-center justify-center text-[18px] ml-6"
          :class="[roomStore.sidebar === 'chat' ? 'text-primary-500' : 'text-gray-500']"
          @click="roomStore.toogleTab('chat')"
      >
        <i-bxs-message-square-dots />
      </button>
      <button
          class="flex items-center justify-center text-[18px] ml-6"
          :class="[roomStore.sidebar === 'settings' ? 'text-primary-500' : 'text-gray-500']"
          @click="roomStore.toogleTab('settings')"
      >
        <i-material-symbols-admin-panel-settings />
      </button>
    </div>

  </div>
</template>

<script lang="ts" setup>
const roomStore = useRoomStore()

const dayjs = useDayjs()
const time = ref(dayjs().format('HH:mm'))

let timer: string | number | NodeJS.Timer | undefined
onMounted(() => {
  timer = setInterval(() => {
    time.value = dayjs().format('HH:mm')
  }, 1000)
})
onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
#room-footer {
  @apply h-[70px] flex-shrink-0 rounded-lg bg-white;
}
.float-group {
  @apply absolute top-1/2 -translate-y-1/2 transform;
}

.base-button {
  @apply w-10 h-10 bg-primary-50 rounded-full flex justify-center items-center text-primary-500 text-[18px];
}
</style>
