<template>
  <nav id="room-head" class="flex items-center">
    <router-link to="/" class="mr-auto block w-[40px]">
      <img src="/images/logo.svg" alt="logo" class="h-full w-full" />
    </router-link>
    <button v-if="false" class="mr-7 text-[20px] text-gray-500">
      <i-bx-video-recording />
    </button>
    <current-user />
  </nav>
</template>

<script lang="ts" setup>
import { useRTDB } from '@vueuse/firebase'
import { notification } from 'ant-design-vue'
import CallBar from '@components/room/CallBar.vue'

const userStore = useUserStore()

const invites = useRTDB(dbRef(getDatabase(), `invites/${userStore.user?.id}`))

const invite = computed(
  () =>
    Object.values(invites.value || {})
      .flatMap((invites: any) => Object.values<any>(invites))
      .filter((e) => !e.disabled)
      .sort((a, b) => b.createdAt - a.createdAt)[0]
)

const route = useRoute()
watch(invite, (invite: any) => {
  if (
    invite?.createdAt + 1000 * 30 > Date.now() &&
    invite.goal?.id !== route.params.id
  ) {
    const key = `open${Date.now()}`
    notification.open({
      message: 'Thông Báo Cuộc Gọi',
      description: invite.single
        ? `${invite.from.name} is inviting you to practice ${invite.goal?.name}`
        : `${invite.from.name} is inviting you to join room to practice ${invite.goal?.name}.`,
      duration: 30,
      key: key,
      btn: () =>
        h(CallBar, {
          invite,
          inviteKey: key,
          path: `invites/${invite.to.id}/${route.params?.id}/${invite.id}`,
        })
    })
  }
})
</script>

<style scoped>
#room-head {
  height: 60px;
  background-color: #fff;
  @apply px-[20px];
}
</style>
