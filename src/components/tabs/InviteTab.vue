<template>
  <div class="">
    <div>
      <div class="flex items-center md:flex-row flex-row-reverse justify-between pb-2">
        <div class="mr-3 items-center hidden md:flex">
          <h4 class="mb-0 text-[17px] font-semibold">
            {{ $t('online') }}
          </h4>

          <span>({{ notInRoom.length }})</span>
        </div>

        <button
            class="bg-gray-100 text-gray-500 text-[18px] p-1 rounded-full transform md:hidden relative ml-auto"
            @click="roomStore.toogleTab('invite')"
        >
          <i-material-symbols-close />
        </button>

        <a-button
            type="primary"
            class="md:ml-5"
            size="small"
            :disabled="!!skipTime"
            @click.stop="inviteAll"
        >
          {{ $t('sendRandomInvitation') }}
          <span v-if="skipTime" class="ml-1 text-xs">({{ skipTime }})</span>
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

    <div
        class="overflow-y-auto pt-1 scrollbar-hide"
    >
      <div v-for="member in searchResult" :key="member.id" class="py-2">
        <invite-member ref="invitesRef" :member="member" :disabled="!!skipTime" />
      </div>
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

const keyword = ref('')

const onlines = useRTDB(dbRef(getDatabase(), `online`))

const talkings = useRTDB(dbRef(getDatabase(), `talkings`))

// danh sách nhưng bạn trong phòng và phòng có hơn 2 người
const _takings = computed(() =>
  Object.values(talkings?.value || {})
    .filter((t: any) => t.count >= 2 && t.date > Date.now() - 3000)
    .map((t: any) => t.id)
)

const _onlines = computed(() =>
  Object.values(onlines?.value || {}).filter(
    (user: any) => user.time > Date.now() - 3000
  )
)

const skipTime = ref(0)
const notInRoom = computed(() =>
  roomStore.members
    .filter(
      (member) =>
        Number(userStore.user?.id) !== Number(member.id) &&
        agoraStore.mapRemoteUsers.findIndex(
          (e) => Number(e.uid) === Number(member.id)
        ) === -1
    )
    // lọc những bạn onlines
    .filter(
      (member) =>
        _onlines.value.findIndex(
          (e: any) => Number(e.id) === Number(member.id)
        ) !== -1
    )
    // lọc những bạn đang trong phòng học
    // và phòng đó có tối thiếu 2 ng
    // => _takings là danh sách
    .filter((member) => _takings.value.indexOf(member.id) === -1)
)

const invitesRef = ref<any>()
const inviteAll = async () => {
  skipTime.value = 15
  const timer = setInterval(() => {
    skipTime.value--
    if (skipTime.value <= 0) {
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

  users.forEach((user: any) => {
    const index = notInRoom.value.findIndex((_user) => Number(_user.id) === Number(user.id))
    invitesRef.value?.[index]?.inviteMember(false)
  })
}

const searchResult = computed(() => {
  if (!keyword.value) {
    return notInRoom.value
  }
  return notInRoom.value.filter((member) =>
      member.name?.toLowerCase().includes(keyword.value.toLowerCase())
  )
})
</script>

<style scoped></style>
