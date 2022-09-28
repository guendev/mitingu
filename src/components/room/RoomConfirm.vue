<template>
  <div id="confirm" class="w-full h-full">
    <div class="max-w-bootstrap mx-auto w-full h-full md:flex mt-40 md:mt-0 px-4 md:px-0">
      <div class="md:w-1/2 flex items-center justify-center">
        <div class="text-gray-300">
          <h1 class="text-current mb-0 font-medium text-[25px]">
            Phòng học: {{ $route.params.id }}
          </h1>
          <div class="w-full h-full relative md:w-[450px] aspect-w-12 overflow-hidden aspect-h-7 relative mt-3">
            <div
                ref="videoRef"
                class="w-full h-full bg-gray-500 rounded-lg overflow-hidden absolute z-10 top-0 left-0 transition"
                :class="[agoraStore.isEnableVideo ? '' : 'opacity-0']"
            ></div>
            <div class="w-full h-full bg-slate-900">
              <h3
                  v-if="!agoraStore.isEnableVideo"
                  class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-[18px] z-20"
              >Bạn đã tắt camera</h3>
            </div>
          </div>
          <div class="md:w-[400px]">
            <p class="mt-3 text-[11px] opacity-50">Việc làm gia cuộc gọi sẽ coi như bạn sẽ đồng ý với các điều khoản và chính sách của chúng tôi.</p>

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


              <button
                  class="h-10 px-5 font-semibold rounded-full bg-primary-500 flex items-center justify-center text-[12px] text-white ml-4"
                  @click="joinRoom"
              >
                Tham Gia
              </button>

              <button class="h-10 px-5 font-semibold rounded-full bg-rose-500 flex items-center justify-center text-[12px] text-white ml-4">
                Huỷ Bỏ
              </button>

            </div>

          </div>

        </div>
      </div>
      <div class="w-1/2 h-full flex items-center justify-center hidden md:block">
        <img width="600" src="/images/homepage-hero.jpeg" alt="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

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
}

onMounted(() => {
  initAgora()
})

watch(
  () => agoraStore.localTracks.video,
  (val) => {
    nextTick(() => {
      if (videoRef.value) {
        val?.play(videoRef.value)
      }
    })
  }
)

const route = useRoute()
const loading = ref(false)
const joinRoom = async () => {
  loading.value = true
  agoraStore.registerEvent()
  setTimeout(async () => {
    await agoraStore.join(route.params.id as string, userStore.user!.id)
    loading.value = false
    roomStore.page = "room"
  }, 300)
}

</script>

<style scoped>
#confirm {
  @apply flex justify-center items-center bg-[#101c37] ;
}
</style>
