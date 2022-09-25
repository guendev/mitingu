<template>
  <div id="room-footer" class="relative flex items-center md:justify-center">
    <div class="float-group left-[20px] hidden md:block">
      <h1 class="mb-0 text-[17px] text-gray-500">
        {{ time }}<span class="hidden lg:inline"> : {{ roomStore.goal?.name || $route.params.id }}</span>
      </h1>
    </div>

    <button
      class="base-button md:ml-0 ml-4"
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
                  <h4 class="mb-0 text-[17px] font-semibold">Thành Viên</h4>

                  <span>({{ notInRoom.length }})</span>
                </div>

                <a-button
                  type="primary"
                  class="ml-auto"
                  size="small"
                  :disabled="!!skipTime"
                  @click.stop="inviteAll"
                >
                  Mời Ngẫu Nhiên
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
                  placeholder="Tìm kiếm..."
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

    <button
      class="ml-4 flex h-9 md:h-10 w-14 items-center justify-center rounded-full bg-rose-500 text-[18px] text-white"
      @click="outRoom"
    >
      <i-fluent-call-end-16-filled />
    </button>

    <div class="float-group right-[20px] flex items-center text-gray-500">
      <button
        class="ml-4 md:ml-6 flex items-center justify-center text-[18px] transition"
        :class="[
          roomStore.sidebar === 'users' ? 'text-primary-500' : 'text-gray-500'
        ]"
        @click="roomStore.toogleTab('users')"
      >
        <i-majesticons-users />
      </button>
      <button
        class="ml-4 md:ml-6 flex items-center justify-center text-[18px]"
        :class="[
          roomStore.sidebar === 'chat' ? 'text-primary-500' : 'text-gray-500'
        ]"
        @click="roomStore.toogleTab('chat')"
      >
        <i-bxs-message-square-dots />
      </button>
      <button
        class="ml-4 md:ml-6 flex items-center justify-center text-[18px]"
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
const router = useRouter()

const roomStore = useRoomStore()
const agoraStore = useAgoraStore()

const dayjs = useDayjs()
const time = ref(dayjs().format('HH:mm'))

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
  await router.push('/')
}

const inviteAll = async () => {
  skipTime.value = 30
  const timer = setInterval(() => {
    skipTime.value--
    if(skipTime.value === 0) {
      clearInterval(timer)
    }
  }, 1000)

  await Promise.all(
      notInRoom.value.map(async (member) => {
        //
      })
  )
}


const skipTime = ref(0)

const notInRoom = computed(() => roomStore.members)
const keyword = ref('')

const searchResult = computed(() => {
  if (!keyword.value) {
    return notInRoom.value
  }
  return notInRoom.value.filter((member) =>
    member.name?.toLowerCase().includes(keyword.value.toLowerCase())
  )
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
  @apply flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full text-[18px] transition;
}
</style>
