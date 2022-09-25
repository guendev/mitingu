<template>
  <div class="user-media relative">
    <div class="w-full h-full bg-white rounded-lg overflow-hidden relative z-10">
      <div ref="videoRef" class="w-full h-full" />
    </div>

    <div class="z-20 absolute bottom-0 left-0 flex items-center transform translate-x-4 -translate-y-4 text-white bg-[#03030385] text-[12px] px-3 rounded-2xl py-1">
      <i-ri-user-4-fill />
      <span>
        {{ userName }}
      </span>
    </div>

  </div>
</template>

<script lang="ts" setup>
const agoraStore = useAgoraStore()
const userStore = useUserStore()
const axios = useAxios()

const props = defineProps<{
  uid: number
}>()

const videoRef = ref<HTMLDivElement>()

const videoTrack = computed(() => {
  if(!agoraStore.mapRemoteUsers[props.uid]) {
    return agoraStore.localTracks.video
  } else {
    return agoraStore.mapRemoteUsers[props.uid].videoTrack
  }
})

const userName = computed(() => {
  if(!agoraStore.mapRemoteUsers[props.uid]) {
    return userStore.user?.name
  } else {
    return agoraStore.mapRemoteUsers[props.uid].userData?.name
  }
})

onMounted(() => nextTick(() => {
  videoTrack.value?.play(videoRef.value!)
}))

const getUserDetail = async () => {
  const result: any = await axios.get('/smileeye//detailUser/' + props.uid)
  if (agoraStore.mapRemoteUsers[props.uid]) {
    agoraStore.mapRemoteUsers[props.uid].userData = result
  }
}
onMounted(() => nextTick(() => getUserDetail()))

watch(videoTrack, (track: any) => {
  nextTick(() => {
    track?.play(videoRef.value!)
  })
})
</script>

<style>
.user-media {
  @apply w-full h-full rounded-lg p-1.5
}
</style>
