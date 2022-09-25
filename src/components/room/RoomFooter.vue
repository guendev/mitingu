<template>
  <div id="room-footer" class="relative flex items-center justify-center">
    <div class="float-group left-[20px]">
      <h1 class="mb-0 text-[17px] text-gray-500">{{ time }} : 50025</h1>
    </div>

    <button
      class="base-button"
      :class="[agoraStore.isEnableAudio ? 'bg-primary-50 text-primary-500' : 'text-white bg-rose-500']"
      @click="agoraStore.toggleAudio()"
    >
      <i-ic-round-mic v-if="agoraStore.isEnableAudio" />
      <i-mdi-microphone-off v-else />
    </button>

    <button
        class="base-button ml-4"
        :class="[agoraStore.isEnableVideo ? 'bg-primary-50 text-primary-500' : 'text-white bg-rose-500']"
        @click="agoraStore.toggleVideo()"
    >
      <i-ion-videocam v-if="agoraStore.isEnableVideo" />
      <i-ion-videocam-off v-else />
    </button>

    <button class="base-button ml-4 bg-primary-50 text-primary-500">
      <i-typcn-user-add />
    </button>

    <button class="base-button ml-4 bg-primary-50 text-primary-500">
      <i-ph-dots-three-outline-vertical-fill />
    </button>

    <button
      class="ml-4 flex h-10 w-14 items-center justify-center rounded-full bg-rose-500 text-[18px] text-white"
      @click="outRoom"
    >
      <i-fluent-call-end-16-filled />
    </button>

    <div class="float-group right-[20px] flex items-center text-gray-500">
      <button
        class="flex items-center justify-center text-[18px] transition"
        :class="[
          roomStore.sidebar === 'users' ? 'text-primary-500' : 'text-gray-500'
        ]"
        @click="roomStore.toogleTab('users')"
      >
        <i-majesticons-users />
      </button>
      <button
        class="ml-6 flex items-center justify-center text-[18px]"
        :class="[
          roomStore.sidebar === 'chat' ? 'text-primary-500' : 'text-gray-500'
        ]"
        @click="roomStore.toogleTab('chat')"
      >
        <i-bxs-message-square-dots />
      </button>
      <button
        class="ml-6 flex items-center justify-center text-[18px]"
        :class="[
          roomStore.sidebar === 'settings'
            ? 'text-primary-500'
            : 'text-gray-500'
        ]"
        @click="roomStore.toogleTab('settings')"
      >
        <i-material-symbols-admin-panel-settings />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter()

const roomStore = useRoomStore()
const agoraStore = useAgoraStore()

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

const outRoom = async () => {
  await agoraStore.leave()
  await router.push('/')
}
</script>

<style scoped>
#room-footer {
  @apply h-[70px] flex-shrink-0 rounded-lg bg-white;
}
.float-group {
  @apply absolute top-1/2 -translate-y-1/2 transform;
}

.base-button {
  @apply flex h-10 w-10 items-center justify-center rounded-full text-[18px] transition;
}
</style>
