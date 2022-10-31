<template>
  <div id="confirm" class="h-full w-full opacity-0">
    <div
      class="mx-auto mt-40 h-full w-full max-w-bootstrap px-4 lg:mt-0 lg:flex lg:px-0"
    >
      <div class="flex items-center justify-center lg:w-1/2">
        <div class="text-gray-300">
          <h1 class="mb-0 text-[25px] font-medium text-current">
            {{ $t('class') }}: {{ $route.params.id }}
          </h1>
          <div
            class="aspect-w-16 aspect-h-9 relative relative mt-3 h-full w-full overflow-hidden lg:w-[450px]"
          >
            <div
              ref="videoRef"
              class="absolute top-0 left-0 z-10 h-full w-full overflow-hidden rounded-lg bg-gray-500 transition"
              :class="[agoraStore.isEnableVideo ? '' : 'opacity-0']"
            ></div>
            <div class="h-full w-full bg-slate-900">
              <h3
                v-if="!agoraStore.isEnableVideo"
                class="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform text-[18px] text-white"
              >
                {{ $t('offedCamera') }}
              </h3>
            </div>
          </div>
          <div class="mt-4 lg:w-[400px]">
            <div class="flex items-center">
              <button
                class="flex h-10 w-10 items-center justify-center rounded-full text-[16px] transition"
                :class="[
                  agoraStore.isEnableAudio ? 'bg-gray-700' : 'bg-rose-500'
                ]"
                @click="agoraStore.toggleAudio()"
              >
                <i-ic-round-mic v-if="agoraStore.isEnableAudio" />
                <i-mdi-microphone-off v-else />
              </button>

              <button
                class="ml-4 flex h-10 w-10 items-center justify-center rounded-full text-[16px] transition"
                :class="[
                  agoraStore.isEnableVideo ? 'bg-gray-700' : 'bg-rose-500'
                ]"
                @click="agoraStore.toggleVideo()"
              >
                <i-ion-videocam v-if="agoraStore.isEnableVideo" />
                <i-ion-videocam-off v-else />
              </button>

              <a-button
                type="danger"
                class="ml-4 !rounded-full"
                @click="leaveRoom"
              >
                {{ $t('cancel') }}
              </a-button>

              <a-button
                type="primary"
                class="ml-4 !rounded-full"
                :loading="loading"
                @click="joinRoom"
              >
                {{ $t('join') }}
              </a-button>
            </div>
          </div>
        </div>
      </div>
      <div
        class="relative hidden h-full w-1/2 items-center justify-center lg:block"
      >
        <img
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform"
          src="/images/homepage-hero.jpeg"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const agoraStore = useAgoraStore()
const userStore = useUserStore()
const roomStore = useRoomStore()

const videoRef = ref<HTMLDivElement>()

const initAgora = async () => {
  await agoraStore.init()
  const [audio, video] = await window.AgoraRTC.createMicrophoneAndCameraTracks()
  agoraStore.localTracks = {
    audio,
    video
  }

  // const joined = window.localStorage.getItem(
  //   ('joined-' + route.params.id) as string
  // )
  // if (joined && Number(joined) > Date.now() - 1000 * 60 * 10) {
    await joinRoom()
  //}
}

onMounted(async () => {
  await dbSet(dbRef(getDatabase(), `talkings/${userStore.user?.id}`), {
    id: userStore.user?.id,
    count: 0,
    date: Date.now()
  })

  await initAgora()
})

watch(
  () => agoraStore.localTracks.video,
  (val) => {
    nextTick(() => {
      if (videoRef.value) {
        val?.play(videoRef.value, { fit: 'contain' })
      }
    })
  }
)

const loading = ref(false)
const joinRoom = async () => {
  loading.value = true
  agoraStore.registerEvent()
  setTimeout(async () => {
    window.localStorage.setItem(
      ('joined-' + route.params.id) as string,
      Date.now().toString()
    )
    await agoraStore.join(route.params.id as string, userStore.user!.id)
    loading.value = false
    roomStore.page = 'room'
  }, 500)
}

const leaveRoom = async () => {
  await agoraStore.leave()
  window.close()
  window.location.href = 'https://smileeye.edu.vn/'
}
</script>

<style scoped>
#confirm {
  @apply flex items-center justify-center bg-[#101c37];
}
</style>
