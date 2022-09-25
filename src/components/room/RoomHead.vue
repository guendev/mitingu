<template>
  <nav id="room-head" class="flex items-center">
    <router-link to="/" class="w-[40px] block mr-auto">
      <img src="/images/logo.svg" alt="logo" class="w-full h-full" />
    </router-link>

    <button class="text-gray-500 mr-7 text-[20px]">
      <i-material-symbols-android-contacts />
    </button>
    <button class="text-gray-500 mr-7 text-[20px]">
      <i-bx-video-recording />
    </button>
    <a-avatar :src="userStore.user?.avatar" />
  </nav>
</template>

<script lang="ts" setup>
const userStore = useUserStore()
</script>

<style scoped>
#room-head {
  height: 60px;
  background-color: #fff;
  @apply px-[20px]
}
</style>
