<template>
  <div id="room-footer" class="relative flex items-center md:justify-center">
    <div class="float-group left-[20px] hidden md:block">
      <h1 class="mb-0 text-[17px] text-gray-500">
        {{ time
        }}<span class="hidden lg:inline">
          : {{ roomStore.goal?.name || $route.params.id }}</span
        >
      </h1>
    </div>

    <button
      class="base-button ml-4 md:ml-0"
      :class="[
        agoraStore.isEnableAudio
          ? 'bg-primary-50 text-primary-500'
          : 'bg-rose-500 text-white'
      ]"
      @click="agoraStore.toggleAudio()"
    >
      <i-ic-round-mic v-if="agoraStore.isEnableAudio" />
      <i-mdi-microphone-off v-else />
    </button>

    <button
      class="base-button ml-4"
      :class="[
        agoraStore.isEnableVideo
          ? 'bg-primary-50 text-primary-500'
          : 'bg-rose-500 text-white'
      ]"
      @click="agoraStore.toggleVideo()"
    >
      <i-ion-videocam v-if="agoraStore.isEnableVideo" />
      <i-ion-videocam-off v-else />
    </button>

    <a-popconfirm
      :title="$t('leaveConfirm')"
      ok-text="Yes"
      cancel-text="No"
      @confirm="outRoom"
    >
      <button
        class="ml-4 flex h-9 w-14 items-center justify-center rounded-full bg-rose-500 text-[18px] text-white md:h-10"
      >
        <i-fluent-call-end-16-filled />
      </button>
    </a-popconfirm>

    <div class="float-group right-[20px] flex items-center text-gray-500">
      <button
          class="ml-4 flex items-center justify-center text-[18px] transition md:ml-6"
          :class="[
          roomStore.sidebar === 'invite' ? 'text-primary-500' : 'text-gray-500'
        ]"
          @click="roomStore.toogleTab('invite')"
      >
        <i-typcn-user-add />
      </button>
      <button
        class="ml-4 flex items-center justify-center text-[18px] transition md:ml-6"
        :class="[
          roomStore.sidebar === 'users' ? 'text-primary-500' : 'text-gray-500'
        ]"
        @click="roomStore.toogleTab('users')"
      >
        <i-majesticons-users />
      </button>
      <button
        class="ml-4 flex items-center justify-center text-[18px] md:ml-6"
        :class="[
          roomStore.sidebar === 'chat' ? 'text-primary-500' : 'text-gray-500'
        ]"
        @click="roomStore.toogleTab('chat')"
      >
        <i-bxs-message-square-dots />
      </button>
      <button
        class="ml-4 flex items-center justify-center text-[18px] md:ml-6"
        :class="[
          roomStore.sidebar === 'settings'
            ? 'text-primary-500'
            : 'text-gray-500'
        ]"
        @click="roomStore.toogleTab('settings')"
      >
        <i-material-symbols-admin-panel-settings />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRTDB } from '@vueuse/firebase'
import { v4 as uuidv4 } from 'uuid'

const route = useRoute()

const roomStore = useRoomStore()
const userStore = useUserStore()
const agoraStore = useAgoraStore()

const dayjs = useDayjs()
const time = ref(dayjs().format('HH:mm'))


let timer: any
onMounted(() => {
  timer = setInterval(() => {
    time.value = dayjs().format('HH:mm')
  }, 1000)
})
onUnmounted(() => {
  clearInterval(timer)
})

const outRoom = async () => {
  await agoraStore.leave()
  window.close()
  window.location.href = 'https://smileeye.edu.vn/'
}

let timer2: any
onMounted(() => {
  timer2 = setInterval(async () => {
    await dbSet(dbRef(getDatabase(), `meettings/${userStore.user?.id}`), {
      id: userStore.user?.id,
      time: Date.now()
    })
  }, 1000)
})
onUnmounted(() => {
  clearInterval(timer2)
})

const startTime = ref(0)
let timer3: any
onMounted(() => {
  if (/^\d*-\d*-\d*/.test(route.params.id as string)) {
    // goalid - user - name
    const [goalId, prefix, random] = (route.params.id as string).split('-')
    startTime.value = Date.now()
    const uid = uuidv4()
    timer3 = setInterval(async () => {
      await dbSet(
        dbRef(
          getDatabase(),
          `meeting-logs/${goalId}/${prefix}/logs/${random}` + uid
        ),
        {
          id: userStore.user?.id,
          start: startTime.value,
          end: Date.now(),
          user: {
            id: userStore.user?.id,
            name: userStore.user?.name,
            avatar: userStore.user?.avatar
          }
        }
      )
    }, 1000)
  }
})
onUnmounted(() => {
  clearInterval(timer3)
})

const [goalId, prefix, random] = (route.params.id as string).split('-')
const logs = useRTDB(dbRef(getDatabase(), `meeting-logs/${goalId}/${prefix}`))

// gi số ng trong
let timer4: any
onMounted(() => {
  timer4 = setInterval(async () => {
    await dbSet(dbRef(getDatabase(), `talkings/${userStore.user?.id}`), {
      id: userStore.user?.id,
      count: agoraStore.mapRemoteUsers.length + 1,
      date: Date.now()
    })
  }, 1000)
})
onUnmounted(() => {
  clearInterval(timer4)
})

let timer5: any
onMounted(() => {
  timer2 = setInterval(async () => {
    await dbSet(dbRef(getDatabase(), `online/${userStore.user?.id}`), {
      id: userStore.user?.id,
      name: userStore.user?.name,
      time: Date.now()
    })
  }, 1000)
})
onUnmounted(() => {
  clearInterval(timer5)
})
</script>

<style scoped>
#room-footer {
  @apply h-[70px] flex-shrink-0 rounded-lg bg-white;
}
.float-group {
  @apply absolute top-1/2 -translate-y-1/2 transform;
}

.base-button {
  @apply flex h-6 w-6 items-center justify-center rounded-full text-[18px] transition md:h-10 md:w-10;
}
</style>
