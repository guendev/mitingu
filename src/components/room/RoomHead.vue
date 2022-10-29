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
import InviteDescription from '@components/room/InviteDescription.vue'


const userStore = useUserStore()

const invites = useRTDB(dbRef(getDatabase(), `invites/${userStore.user?.id}`))

const invite = computed(
  () =>
    Object.values(invites.value || {})
      .flatMap((invites: any) => Object.values<any>(invites))
      .filter((e) => e.createdAt + 1000 * 30 >= Date.now())
      .sort((a, b) => b.createdAt - a.createdAt)[0]
)

const route = useRoute()
watch(invite, (invite: any) => {
  const key = `invite-${invite?.id}`
  if (invite && invite?.goal?.id !== route.params.id && !invite?.disabled) {
    notification.open({
      message: '',
      description: () => h(InviteDescription, {
        invite: toRaw(invite)
      }),
      duration: 30,
      style: {
        borderRadius: '10px',
      },
      key: key,
      btn: () =>
        h(CallBar, {
          invite: toRaw(invite),
          inviteKey: key,
          path: `invites/${invite.to.id}/${route.params?.id}/${invite.id}`
        })
    })
  } else {
    notification.close(key)
  }
})

onMounted(() => {
  window.addEventListener('afterClickCancelInvite', async ({ detail }: any) => {
    const key = `invite-${detail.invite?.id}`
    notification.close(key)
    await dbSet(dbRef(getDatabase(), detail.path), {
      ...detail.invite,
      disabled: true
    })
  })
})
</script>

<style scoped>
#room-head {
  height: 60px;
  background-color: #fff;
  @apply px-[20px];
}
</style>
