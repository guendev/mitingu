<template>
  <div
    id="room"
    class="h-screen"
    :class="[roomStore.page === 'room' ? 'bg-primary-50' : '' ]"
  >
    <room-confirm v-if="roomStore.page === 'confirm'" />
    <template v-else-if="roomStore.page === 'room'">
      <room-head />
      <div id="room-body">
        <room-content />
        <room-footer />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
const roomStore = useRoomStore()
const userStore = useUserStore()
const agoraStore = useAgoraStore()

const axios = useAxios()
const route = useRoute()

const getMembers = async () => {
  try {
    const [goalId, prefix] = (route.params.id as string).split('-')
    roomStore.members = await axios.get(`/smileeye/list-member/goal_root_id=${goalId}`)
  } catch (e) {
    //
  }
}

const checkRoomAsync = async () => {
  if(/^\d*-\d*/.test(route.params.id as string)) {
    const [goalId, prefix] = (route.params.id as string).split('-')
    try {
      const result: any = await axios.get(`/smileeye/detail-goal/goal_id=${goalId}`)
      if(result) {
        roomStore.goal = result
        await getMembers()
      }
    } catch (e) {
      //
    }
  }
}

onMounted(() => nextTick(() => checkRoomAsync()))


const { height } = useWindowSize()

const color = ref('0px')


const debouncedRebuild = useDebounceFn(() => {
  color.value = height.value - 60 + 'px'
}, 500)

const debouncedUpdateMedia = useDebounceFn(async () => {
  await dbSet(dbRef(getDatabase(), `room/${route.params.id}/media/${userStore.user?.id}`),{
    user: {
      id: userStore.user?.id,
      name: userStore.user?.name,
      avatar: userStore.user?.avatar
    },
    isEnableAudio: agoraStore.isEnableAudio,
    isEnableVideo: agoraStore.isEnableVideo,
  })
}, 10)

watch(height, () => {
  debouncedRebuild()
}, { immediate: true })

watch([() => userStore.user, () => agoraStore.isEnableAudio, () => agoraStore.isEnableVideo], () => {
  debouncedUpdateMedia()
}, { immediate: true })
</script>

<style scoped>
#room-body {
  @apply flex flex-col p-[20px];
}

#room-body {
  height: v-bind(color);
}
</style>
