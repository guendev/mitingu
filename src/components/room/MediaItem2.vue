<template>
  <div class="user-media relative w-full h-full">
    <div
        class="w-full h-full rounded-lg overflow-hidden relative z-10 transition flex items-center"
        :class="[!userDetail?.isEnableVideo ? 'opacity-0 bg-gray-400' : 'bg-white']"
    >
      <div class="relative w-full aspect-w-16 aspect-h-9">
        <div ref="videoRef" class="w-full h-full" />
      </div>
    </div>

    <div
        class="z-20 absolute w-[100px] h-[100px] bg-gray-300 top-1/2 left-1/2 rounded-full overflow-hidden transform -translate-x-1/2 -translate-y-1/2 transition"
        :class="[userDetail?.isEnableVideo ? 'opacity-0 scale-75' : '']"
    >
      <img class="w-full h-full object-cover" alt="" :src="userDetail?.user?.avatar" />
    </div>

    <div class="z-20 absolute top-0 left-0 w-full h-full border-[2px] border-primary-500 transition transform rounded-lg" :class="[isTalking ? '' : 'opacity-0']"></div>

    <div class="z-20 absolute bottom-0 left-0 flex items-center transform translate-x-4 -translate-y-4 text-white bg-[#03030385] text-[12px] px-3 rounded-2xl py-1">
      <i-ri-user-4-fill />
      <span>
        {{ userDetail?.user?.name }}
      </span>
    </div>

  </div>
</template>

<script lang="ts" setup>
import {IRemoteAudioTrack, IRemoteVideoTrack, UID} from "agora-rtc-sdk-ng";
import {useRTDB} from "@vueuse/firebase/useRTDB";

const agoraStore = useAgoraStore()
const userStore = useUserStore()
const axios = useAxios()
const route = useRoute()

const props = defineProps<{
  uid: UID
  video?: Partial<IRemoteVideoTrack>
  audio?: Partial<IRemoteAudioTrack>
}>()

const userDetail = useRTDB(dbRef(getDatabase(), `room/${route.params.id}/media/${props.uid}/`))
const videoRef = ref<HTMLDivElement>()

onMounted(() => nextTick(() => {
  props.video?.play?.(videoRef.value!)
}))

const debouncedRebuild = useDebounceFn(() => nextTick(() => props.video?.play?.(videoRef.value!)), 300)

watch(() => props.video, () => debouncedRebuild())

const debouncedAudio = useDebounceFn(() => nextTick(() => {
  if (props.uid !== userStore.user?.id) {
    props.audio?.play?.()
  }
}), 300)

onMounted(() => nextTick(debouncedAudio))
watch(() => props.audio, debouncedAudio)

onUnmounted(() => {
  props.video?.stop?.()
  props.audio?.stop?.()
})

const isTalking = computed(() => {
  return agoraStore.volumes.filter(volume => volume.id === props.uid)?.[0]?.level > 5
})
</script>

<style></style>
