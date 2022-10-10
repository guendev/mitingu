<template>
  <a-dropdown placement="bottomRight" trigger='click'>
    <a-avatar :src='userStore.user?.avatar'></a-avatar>

    <template #overlay>
      <a-menu>
        <a-menu-item @click='leaveRoom'>
          <div class='flex items-center transition'>
            <i-uim-signout />
            <span class='text-[14px] ml-2'>
              {{ $t('logout') }}
              </span>
          </div>
        </a-menu-item>
      </a-menu>
    </template>

  </a-dropdown>
</template>

<script lang='ts' setup>

const router = useRouter()
const agoraStore = useAgoraStore()
const userStore = useUserStore()
const cookies = useCookies()

const leaveRoom = async () => {
  cookies?.remove('_token')
  await agoraStore.leave()
  userStore.logout()
  await router.push('/')
}

</script>

<style scoped>

</style>
