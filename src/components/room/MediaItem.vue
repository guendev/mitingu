<template>
  <div class="user-media">
    <div class="w-full h-full bg-white rounded-lg overflow-hidden">
      <div ref="videoRef" class="w-full h-full" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const agoraStore = useAgoraStore()
const props = defineProps<{
  index: number
}>()

const videoRef = ref<HTMLDivElement>()

const videoTrack = computed(() => {
  if(props.index === 0) {
    return agoraStore.localTracks.video
  } else {
    return agoraStore.mapRemoteUsers[props.index].videoTrack
  }
})

onMounted(() => nextTick(() => {
  videoTrack.value?.play(videoRef.value!)
}))

</script>

<style>
.user-media {
  @apply w-full h-full rounded-lg p-1.5
}
</style>
