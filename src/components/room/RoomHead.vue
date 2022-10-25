<template>
  <nav id="room-head" class="flex items-center">
    <router-link to="/" class="mr-auto block w-[40px]">
      <img src="/images/logo.svg" alt="logo" class="h-full w-full" />
    </router-link>
    <button class="mr-7 text-[20px] text-gray-500">
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
watch(invite, (invite) => {
  if (invite?.createdAt + 1000 * 30 > Date.now() && invite.goal?.id !== route.params.id) {
    const key = `open${Date.now()}`;
    notification.open({
      message: 'Thông Báo Cuộc Gọi',
      description: `Do you want to practice ${invite.from?.name} with ${invite.from.name}?`,
      duration: 30,
      key: key,
      btn: () =>
        h(
          CallBar,
          {
            invite,
            inviteKey: key,
          }
        )
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
