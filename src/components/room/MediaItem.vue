<template>
  <div class="user-media">
    <div class="w-full h-full bg-white rounded-lg overflow-hidden">
      <div ref="videoRef" class="w-full h-full" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const agoraStore = useAgoraStore()
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
