<template>
  <div class="user-media">
    <div class="w-full h-full bg-white rounded-lg overflow-hidden">
      <div ref="videoRef" class="w-full h-full" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const agoraStore = useAgoraStore()
// const userStore = useUserStore()

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

const getUserDetail = () => {
  console.log(agoraStore.mapRemoteUsers)
}
onMounted(() => nextTick(() => getUserDetail()))

</script>

<style>
.user-media {
  @apply w-full h-full rounded-lg p-1.5
}
</style>
