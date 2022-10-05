<template>
  <div class="user-media relative h-full w-full">
    <div
      class="relative z-10 flex h-full w-full items-center overflow-hidden rounded-lg transition"
      :class="[
        !userDetail?.isEnableVideo ? 'bg-gray-400 opacity-0' : 'bg-white'
      ]"
    >
      <div class="aspect-w-16 aspect-h-9 relative w-full">
        <div ref="videoRef" class="h-full w-full" />
      </div>
    </div>

    <div
      class="absolute top-1/2 left-1/2 z-20 h-[100px] w-[100px] -translate-x-1/2 -translate-y-1/2 transform overflow-hidden rounded-full bg-gray-300 transition"
      :class="[userDetail?.isEnableVideo ? 'scale-75 opacity-0' : '']"
    >
      <img
        class="h-full w-full object-cover"
        alt=""
        :src="userDetail?.user?.avatar"
      />
    </div>

    <div
      class="absolute top-0 left-0 z-20 h-full w-full transform rounded-lg border-[2px] border-primary-500 transition"
      :class="[isTalking ? '' : 'opacity-0']"
    ></div>

    <div
      class="absolute bottom-0 left-0 z-20 flex translate-x-4 -translate-y-4 transform items-center rounded-2xl bg-[#03030385] px-3 py-1 text-[12px] text-white"
    >
      <i-ri-user-4-fill />
      <span>
        {{ userDetail?.user?.name }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IRemoteAudioTrack, IRemoteVideoTrack, UID } from 'agora-rtc-sdk-ng'
import { onValue } from 'firebase/database'

const agoraStore = useAgoraStore()
const userStore = useUserStore()
const axios = useAxios()
const route = useRoute()

const props = defineProps<{
  uid: UID
  video?: Partial<IRemoteVideoTrack>
  audio?: Partial<IRemoteAudioTrack>
}>()

const userDetail = ref()
const videoRef = ref<HTMLDivElement>()

onMounted(() =>
  nextTick(() => {
    props.video?.play?.(videoRef.value!)
  })
)

const debouncedRebuild = useDebounceFn(
  () => nextTick(() => props.video?.play?.(videoRef.value!)),
  300
)

watch(
  () => props.video,
  () => debouncedRebuild()
)

const debouncedAudio = useDebounceFn(
  () =>
    nextTick(() => {
      if (props.uid !== userStore.user?.id) {
        props.audio?.play?.()
      }
    }),
  300
)

onMounted(() => nextTick(debouncedAudio))
watch(() => props.audio, debouncedAudio)

onUnmounted(() => {
  props.video?.stop?.()
  props.audio?.stop?.()
})

const isTalking = computed(() => {
  return (
    agoraStore.volumes.filter((volume) => volume.id === props.uid)?.[0]?.level >
    5
  )
})

const db = getDatabase()

const debouncedUser = useDebounceFn(async () => {
  const starCountRef = dbRef(db, `room/${route.params.id}/media/${props.uid}/`)
  onValue(starCountRef, (snapshot) => {
    userDetail.value = snapshot.val();
  })
}, 300)

watch(() => props.uid, debouncedUser, { immediate: true })
</script>

<style></style>
