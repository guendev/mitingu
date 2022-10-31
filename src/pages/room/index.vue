<template>
  <div
    id="room"
    class="h-screen relative"
    :class="[roomStore.page === 'room' ? 'bg-primary-50' : '' ]"
  >

    <div v-if="roomStore.page === 'confirm'" class='absolute top-5 right-5'>
      <div class="flex items-center">

        <button
            class="text-[18px] transition"
            :class="[$i18n.locale === 'vi' ? '' : 'opacity-50']"
            @click="$i18n.locale = 'vi'"
        >
          <i-twemoji-flag-vietnam />
        </button>

        <button
            class="text-[16px] transition ml-4" @click="$i18n.locale = 'jp'"
            :class="[$i18n.locale === 'jp' ? '' : 'opacity-50']"
        >
          <i-twemoji-flag-japan />
        </button>

        <button
            class="text-[16px] transition ml-4 mr-5" @click="$i18n.locale = 'en'"
            :class="[$i18n.locale === 'en' ? '' : 'opacity-50']"
        >
          <i-flagpack-us />
        </button>

        <current-user
            v-if="userStore.auth"
        />
      </div>
    </div>


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
  if(/^\d*-\d*-\d*/.test(route.params.id as string)) {
    const [goalId, prefix, random] = (route.params.id as string).split('-')
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

// check chủ lời mời online
onMounted( () => {
  setTimeout(async () => {
    try {
      if(roomStore.from) {
        const result = await dbGet(dbRef(getDatabase(), '/online/' + roomStore.from))
        if(!result.exists()) {
          return
        }
        const user = result.val()
        if(user.time < Date.now() - 3000) {
          console.log('1234567', 'đã out')
          message.warn(`Thành viên ${user.name} mời bạn đã out!!!`)
        }
        roomStore.from = ''
      }
    } catch (e) {
      //
    }
  }, 1000)
})
</script>

<style scoped>
#room-body {
  @apply flex flex-col p-[20px];
}

#room-body {
  height: v-bind(color);
}
</style>

<style src='node_modules/ant-design-vue/es/message/style/index.css'></style>
