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

    <a-dropdown placement="topLeft" trigger="click">
      <button class="base-button ml-4 bg-primary-50 text-primary-500">
        <i-typcn-user-add />
      </button>

      <template #overlay>
        <a-menu :key="notInRoom.length">
          <a-menu-item>
            <div>
              <div class="flex items-center justify-between pb-2">
                <div class="mr-3 flex items-center">
                  <h4 class="mb-0 text-[17px] font-semibold">
                    {{ $t('online') }}
                  </h4>

                  <span>({{ notInRoom.length }})</span>
                </div>

                <a-button
                  type="primary"
                  class="ml-auto"
                  size="small"
                  :disabled="!!skipTime"
                  @click.stop="inviteAll"
                >
                  {{ $t('sendRandomInvitation') }}
                  <span v-if="skipTime" class="ml-1 text-xs"
                    >({{ skipTime }})</span
                  >
                </a-button>
              </div>

              <div>
                <input
                  v-model="keyword"
                  class="w-full rounded-lg bg-gray-100 px-3 py-1.5 focus:bg-white focus:outline-0"
                  type="text"
                  :placeholder="$t('search')"
                  @click.stop
                />
              </div>
            </div>
          </a-menu-item>

          <div
            :key="searchResult.length"
            class="h-[60vh] overflow-y-auto pt-1 scrollbar-hide"
          >
            <a-menu-item v-for="member in searchResult" :key="member.id">
              <invite-member :member="member" :disabled="!!skipTime" />
            </a-menu-item>
          </div>
        </a-menu>
      </template>
    </a-dropdown>

    <!--    <button class="base-button ml-4 bg-primary-50 text-primary-500">-->
    <!--      <i-ph-dots-three-outline-vertical-fill />-->
    <!--    </button>-->

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
const router = useRouter()

const roomStore = useRoomStore()
const userStore = useUserStore()
const agoraStore = useAgoraStore()

const dayjs = useDayjs()
const time = ref(dayjs().format('HH:mm'))

const onlines = useRTDB(dbRef(getDatabase(), `online`))

const meettings = useRTDB(dbRef(getDatabase(), `meettings`))

const _meeting = computed(() =>
  Object.values(meettings?.value || {}).filter(
    (user: any) => user.time > Date.now() - 3000
  )
)

const _onlines = computed(() =>
  Object.values(onlines?.value || {}).filter(
    (user: any) => user.time > Date.now() - 3000
  )
)

const notInRoom = computed(() =>
  roomStore.members
    .filter(
      (member) =>
        Number(userStore.user?.id) !== Number(member.id) &&
        agoraStore.mapRemoteUsers.findIndex(
          (e) => Number(e.uid) === Number(member.id)
        ) === -1
    )
    .filter(
      (member) =>
        _onlines.value.findIndex(
          (e: any) => Number(e.id) === Number(member.id)
        ) !== -1
    )
    .filter(
      (member) =>
        _meeting.value.findIndex(
          (e: any) => Number(e.id) === Number(member.id)
        ) === -1
    )
)

let timer: string | number | NodeJS.Timer | undefined
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

const inviteAll = async () => {
  skipTime.value = 30
  const timer = setInterval(() => {
    skipTime.value--
    if (skipTime.value === 0) {
      clearInterval(timer)
    }
  }, 1000)

  const getRandom = (users: any[], x: number): any => {
    if (users.length >= x) {
      return users
    }

    const _users = notInRoom.value.filter(
      (u) => users.findIndex((uu) => uu.id === u.id) === -1
    )
    const random = _users[Math.floor(Math.random() * _users.length)]
    if (!random) {
      return users
    }
    users.push(random)
    return getRandom(users, x)
  }

  const users = getRandom([], 5)

  await Promise.all(
    users.map(async (member: any) => {
      const uid = uuidv4()
      await dbSet(
        dbRef(getDatabase(), `invites/${member.id}/${route.params?.id}/${uid}`),
        {
          id: uid,
          from: {
            id: userStore.user?.id,
            name: userStore.user?.name,
            avatar: userStore.user?.avatar
          },
          to: {
            id: member.id,
            name: member.name
          },
          goal: {
            id: route.params?.id,
            name: roomStore.goal?.name
          },
          disabled: false,
          createdAt: Date.now()
        }
      )

      const [goalId, prefix, random] = (route.params.id as string).split('-')

      await dbSet(
          dbRef(getDatabase(), `meetting-logs/${goalId}/${prefix}/invites/${random}` + uid),
          {
            sender: {
              id: userStore.user?.id,
              name: userStore.user?.name,
              email: userStore.user?.email,
            },
            receiver: {
              id: member.id,
              name: member.name,
              email: member.email,
            },
          }
      )

    })
  )
}

const skipTime = ref(0)

const keyword = ref('')

const searchResult = computed(() => {
  if (!keyword.value) {
    return notInRoom.value
  }
  return notInRoom.value.filter((member) =>
    member.name?.toLowerCase().includes(keyword.value.toLowerCase())
  )
})

let timer2: string | number | NodeJS.Timer | undefined
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
let timer3: string | number | NodeJS.Timer | undefined
onMounted(() => {
  if (/^\d*-\d*-\d*/.test(route.params.id as string)) {
    // goalid - user - name
    const [goalId, prefix, random] = (route.params.id as string).split('-')
    startTime.value = Date.now()
    const uid = uuidv4()
    timer3 = setInterval(async () => {
      await dbSet(
        dbRef(getDatabase(), `meetting-logs/${goalId}/${prefix}/logs/${random}` + uid),
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
const logs = useRTDB(dbRef(getDatabase(), `meetting-logs/${goalId}/${prefix}`))

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
