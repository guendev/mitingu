<template>
  <div class="user-media relative w-full h-full">
    <div
        class="w-full h-full rounded-lg overflow-hidden relative z-10 transition flex items-center"
        :class="[!hasVideo ? 'opacity-0 bg-gray-400' : 'bg-white']"
    >
      <div class="relative w-full aspect-w-12 aspect-h-7">
        <div ref="videoRef" class="w-full h-full" />
      </div>
    </div>

    <div
        class="z-20 absolute w-[100px] h-[100px] bg-gray-300 top-1/2 left-1/2 rounded-full overflow-hidden transform -translate-x-1/2 -translate-y-1/2 transition"
        :class="[hasVideo ? 'opacity-0 scale-75' : '']"
    >
      <img class="w-full h-full object-cover" alt="" :src="_userDocument?.avatar" />
    </div>

    <div class="z-20 absolute top-0 left-0 w-full h-full border-[2px] border-primary-500 transition transform rounded-lg" :class="[isTalking ? '' : 'opacity-0']"></div>

    <div class="z-20 absolute bottom-0 left-0 flex items-center transform translate-x-4 -translate-y-4 text-white bg-[#03030385] text-[12px] px-3 rounded-2xl py-1">
      <i-ri-user-4-fill />
      <span>
        {{ _userDocument?.name }}
      </span>
    </div>

  </div>
</template>

<script lang="ts" setup>
import {UserDocument} from "@entities/user";
import {IRemoteAudioTrack, IRemoteVideoTrack, UID} from "agora-rtc-sdk-ng";

const agoraStore = useAgoraStore()
const userStore = useUserStore()
const axios = useAxios()

const props = defineProps<{
  uid: UID
  userData?: UserDocument
  video?: Partial<IRemoteVideoTrack>
  audio?: Partial<IRemoteAudioTrack>
  hasVideo?: boolean
  hasAudio?: boolean
}>()

const _userDocument = ref<UserDocument|undefined>()

const videoRef = ref<HTMLDivElement>()

onMounted(() => nextTick(() => {
  props.video?.play?.(videoRef.value!)
}))

const debouncedRebuild = useDebounceFn(() => nextTick(() => props.video?.play?.(videoRef.value!)), 300)

watch(() => props.video, () => debouncedRebuild())

const getUserDetail = async () => {
  const index = agoraStore.mapRemoteUsers.findIndex(user => user.uid === props.uid)
  if (index !== -1) {
    const result: any = await axios.get('/smileeye/detailUser/' + props.uid)
    agoraStore.mapRemoteUsers[index].userData = result
    _userDocument.value = result
  } else {
    _userDocument.value = userStore.user as any
  }
}
onMounted(() => getUserDetail())

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
