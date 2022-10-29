<template>
  <div id="room-content">
    <div
      class="mate-wrapper relative"
      :class="[roomStore.sidebar ? 'mate-wrapper--sidebar md:pr-[340px]' : '']"
    >
      <!-- Array(20).fill({}) -->
      <room-layout2 :items="users" :active="-1">
        <template #default="{ item }">
          <media-item2
            :uid="item.uid"
            :video="item.videoTrack"
            :audio="item.audioTrack"
            :meta="usersDetail?.[item.uid]"
          />
        </template>
      </room-layout2>

      <div
        v-if="roomStore.sidebar"
        class="absolute right-0 top-0 z-20 h-full w-full md:w-[325px]"
        :class="[roomStore.sidebar !== 'invite' ? 'bg-white rounded-lg p-4' : '']"
      >
        <div class="relative h-full w-full">
          <messages-tab v-if="roomStore.sidebar === 'chat'" />
          <members-tab v-else-if="roomStore.sidebar === 'users'" />
          <settings-tab v-else-if="roomStore.sidebar === 'settings'" />
          <div v-else class="w-full h-full">
            <div class="w-full h-full flex">
              <div class="w-1/3 h-full md:hidden" @click="roomStore.toogleTab('invite')"></div>
              <invite-tab class="w-full h-full bg-white rounded-lg p-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRTDB } from '@vueuse/firebase'

const route = useRoute()

const agoraStore = useAgoraStore()
const roomStore = useRoomStore()
const userStore = useUserStore()
const users = computed(() => [
  ...agoraStore.mapRemoteUsers,
  {
    uid: userStore.user!.id,
    videoTrack: agoraStore.localTracks.video,
    audioTrack: agoraStore.localTracks.audio
  }
])

// đánh giấu lời mời
const checkInvite = async () => {
  // đánh giấu tất cả lời mời thuộc phòng hiện tại
  const docRef = await dbGet(
    dbRef(getDatabase(), `invites/${userStore.user?.id}/${route.params.id}`)
  )
  // kiểm tra user có phải là primary user hay ko bằng cách kiểm tra from của lời mười gâần rất của room
  if (docRef.exists()) {
    // const invites: InviteDocument[] = Object.values<InviteDocument>(docRef.val())
    //   .filter(invite => invite.from.id === userStore.user?.id)
    // const lastInvite = invites.sort((a, b) => b.createdAt - a.createdAt)[0]

    // User hiện tại là primary user
    // if(lastInvite?.from?.id === userStore.user?.id) {
    //   return
    // }
    // Đánh giấu tất cả các lời mời của mn trong phòng
    await checkDisabled()
  }
}

const checkDisabled = async (chanel = '') => {
  await Promise.all(
    roomStore.members.map(async (member) => {
      const docRef = await dbGet(
        dbRef(
          getDatabase(),
          `invites/${member.id}/${route.params.id || chanel}`
        )
      )
      if (docRef.exists()) {
        const invites2 = Object.values(docRef.val())
        await Promise.all([
          invites2
            .filter((e: any) => !e.disabled)
            .map(async (invite: any) => {
              await dbSet(
                dbRef(
                  getDatabase(),
                  `invites/${member.id}/${route.params.id || chanel}/${
                    invite.id
                  }`
                ),
                {
                  ...invite,
                  disabled: true
                }
              )
            })
        ])
      }
    })
  )
}

onMounted(async () => {
  if (roomStore.goal) {
    await checkInvite()
  }
})

const usersDetail = useRTDB(
  dbRef(getDatabase(), `room/${route.params.id}/media/`)
)
</script>

<style scoped>
#room-content {
  @apply flex flex-1 flex-col overflow-y-auto;
}
.room-title {
  @apply h-[40px] flex-shrink-0;
}
.mate-wrapper {
  @apply mb-[20px] h-full w-full overflow-hidden rounded-lg;
}
</style>
