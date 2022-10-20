<template>
  <div id="confirm" class="w-full h-full">
    <div class="max-w-bootstrap mx-auto w-full h-full lg:flex mt-40 lg:mt-0 px-4 lg:px-0">
      <div class="lg:w-1/2 flex items-center justify-center">
        <div class="text-gray-300">
          <h1 class="text-current mb-0 font-medium text-[25px]">
            {{ $t('class') }}: {{ $route.params.id }}
          </h1>
          <div class="w-full h-full relative lg:w-[450px] aspect-w-16 overflow-hidden aspect-h-9 relative mt-3">
            <div
                ref="videoRef"
                class="w-full h-full bg-gray-500 rounded-lg overflow-hidden absolute z-10 top-0 left-0 transition"
                :class="[agoraStore.isEnableVideo ? '' : 'opacity-0']"
            ></div>
            <div class="w-full h-full bg-slate-900">
              <h3
                  v-if="!agoraStore.isEnableVideo"
                  class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-[18px] z-20"
              >
                {{ $t('offedCamera') }}
              </h3>
            </div>
          </div>
          <div class="lg:w-[400px] mt-4">
            <div class="flex items-center">

              <button
                  class="w-10 h-10 rounded-full flex items-center justify-center text-[16px] transition"
                  :class="[agoraStore.isEnableAudio ? 'bg-gray-700' : 'bg-rose-500']"
                  @click="agoraStore.toggleAudio()"
              >
                <i-ic-round-mic v-if="agoraStore.isEnableAudio" />
                <i-mdi-microphone-off v-else />
              </button>

              <button
                  class="w-10 h-10 rounded-full flex items-center justify-center text-[16px] ml-4 transition"
                  :class="[agoraStore.isEnableVideo ? 'bg-gray-700' : 'bg-rose-500']"
                  @click="agoraStore.toggleVideo()"
              >
                <i-ion-videocam v-if="agoraStore.isEnableVideo" />
                <i-ion-videocam-off v-else />
              </button>

              <a-button
                  type="danger"
                  class="!rounded-full ml-4"
                  @click="$router.push('/')"
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
      <div class="w-1/2 h-full items-center justify-center hidden lg:block relative">
        <img class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" src="/images/homepage-hero.jpeg" alt="" />
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
    video,
  }

  const joined = window.localStorage.getItem('joined-' + route.params.id as string)
  if (joined && Number(joined) > Date.now() - (1000 * 60 * 10)) {
    await joinRoom()
  }
}

onMounted(() => {
  initAgora()
})

watch(
  () => agoraStore.localTracks.video,
  (val) => {
    nextTick(() => {
      if (videoRef.value) {
        val?.play(videoRef.value, { fit: 'contain'} )
      }
    })
  }
)

const loading = ref(false)
const joinRoom = async () => {
  loading.value = true
  agoraStore.registerEvent()
  setTimeout(async () => {
    window.localStorage.setItem('joined-' + route.params.id as string, Date.now().toString())
    await agoraStore.join(route.params.id as string, userStore.user!.id)
    loading.value = false
    roomStore.page = "room"
  }, 500)
}

</script>

<style scoped>
#confirm {
  @apply flex justify-center items-center bg-[#101c37] ;
}
</style>
