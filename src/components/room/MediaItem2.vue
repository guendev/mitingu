<template>
  <div class="user-media relative w-full h-full">
    <div
        class="w-full h-full rounded-lg overflow-hidden relative z-10 transition"
        :class="[!hasVideo ? 'opacity-0 bg-gray-400' : 'bg-white']"
    >
      <div ref="videoRef" class="w-full h-full" />
    </div>

    <div
        class="z-20 absolute w-[100px] h-[100px] bg-gray-300 top-1/2 left-1/2 rounded-full overflow-hidden transform -translate-x-1/2 -translate-y-1/2 transition"
        :class="[hasVideo ? 'opacity-0 scale-75' : '']"
    >
      <img class="w-full h-full object-cover" alt="" :src="_userDocument?.avatar" />
    </div>

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
import {UID} from "agora-rtc-sdk-ng";

const agoraStore = useAgoraStore()
const userStore = useUserStore()
const axios = useAxios()

interface MediaProtocol {
  play: (element?: HTMLElement) => void
}

const props = defineProps<{
  uid: UID
  userData?: UserDocument
  video?: MediaProtocol
  audio?: MediaProtocol
  hasVideo?: boolean
  hasAudio?: boolean
}>()

const _userDocument = ref<UserDocument|undefined>()

const videoRef = ref<HTMLDivElement>()

onMounted(() => nextTick(() => {
  props.video?.play(videoRef.value!)
}))

const debouncedRebuild = useDebounceFn(() => nextTick(() => props.video?.play(videoRef.value!)), 300)

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
  console.log('debouncedAudio')
  if (props.uid !== userStore.user?.id) {
    props.video?.play(videoRef.value!)
  }
}), 300)

onMounted(() => nextTick(debouncedAudio))
watch(() => props.audio, debouncedAudio)

</script>

<style></style>
