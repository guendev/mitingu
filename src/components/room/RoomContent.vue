<template>
  <div id="room-content">
    <div
        class="mate-wrapper relative"
        :class="[roomStore.sidebar ? 'mate-wrapper--sidebar md:pr-[340px]' : '']"
    >
      <!-- Array(10).fill('') -->
      <room-layout2 :items="users" :active="-1">
        <template #default="{ item }">
          <media-item2
              :uid="item.uid"
              :user-data="item.userData"
              :video="item.videoTrack"
              :audio="item.audioTrack"
              :has-video="userStore.user?.id === item.uid ? agoraStore.isEnableVideo : !!item.videoTrack"
              :has-audio="userStore.user?.id === item.uid ? agoraStore.isEnableAudio : !!item.audioTrack"
          />
        </template>
      </room-layout2>

      <div v-if="roomStore.sidebar" class="absolute right-0 w-full md:w-[325px] h-full top-0 bg-white rounded-lg p-4">
        <div class="w-full h-full relative">
          <messages-tab v-if="roomStore.sidebar === 'chat' " />
          <members-tab v-else-if="roomStore.sidebar === 'users'" />
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import {UID} from "agora-rtc-sdk-ng"
import MessagesTab from "@components/tabs/MessagesTab.vue"

const route = useRoute()

const agoraStore = useAgoraStore()
const roomStore = useRoomStore()
const userStore = useUserStore()
const usersID = computed<UID[]>(() => [userStore.user!.id, ...Object.keys(agoraStore.mapRemoteUsers).map((key) => Number(key))])
const users = computed(() => [{
  uid: userStore.user!.id,
  userData: userStore.user,
  videoTrack: agoraStore.localTracks.video,
  audioTrack: agoraStore.localTracks.audio
}, ...agoraStore.mapRemoteUsers])

// đánh giấu lời mời
const checkInvite = async () => {
  // đánh giấu tất cả lời mời thuộc phòng hiện tại
  const docRef = await dbGet(dbRef(getDatabase(), `invites/${userStore.user?.id}/${route.params.id}`))
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
      roomStore.members.map(async member => {
        const docRef = await dbGet(dbRef(getDatabase(), `invites/${member.id}/${route.params.id || chanel}`))
        if (docRef.exists()) {
          const invites2 = Object.values(docRef.val())
          await Promise.all([
            invites2.filter(e => !e.disabled).map(async (invite: any) => {
              await dbSet(dbRef(getDatabase(), `invites/${member.id}/${route.params.id || chanel}/${invite.id}`), {
                ...invite,
                disabled: true
              })
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

</script>

<style scoped>
#room-content {
  @apply flex-1 overflow-y-auto flex flex-col;
}
.room-title {
  @apply h-[40px] flex-shrink-0;
}
.mate-wrapper {
  @apply w-full h-full rounded-lg overflow-hidden mb-[20px];
}
</style>
