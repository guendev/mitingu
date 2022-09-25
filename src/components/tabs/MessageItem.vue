<template>

  <div
    class='chat-item'
    :class='{
      _current: message.user.id === userStore.user?.id,
    }'
  >
    <div class='flex items-center'>
      <div class='rounded-lg w-[40px] h-[40px] bg-gray-100 rounded-lg overflow-hidden'>
        <img :src='message.user.avatar' alt='' />
      </div>

      <div class='mx-4'>
        <h5 class='mb-0 text-[14px] font-semibold text-gray-500'>{{ message.user.name }}</h5>
      </div>

    </div>
    <div class='flex'>
      <div class='w-[40px] mr-4'></div>
      <div class='text-[13px] px-2.5 py-1 bg-gray-100 rounded-lg content'>
        {{ message.content }}
      </div>
    </div>
  </div>

</template>

<script lang='ts' setup>
import { MessageDocument } from '@entities/message'

defineProps<{
  message: MessageDocument
}>()

const userStore = useUserStore()
</script>

<style scoped>
.chat-item._current > .flex {
  flex-direction: row-reverse;
}
.chat-item._current .content {
  @apply text-white bg-primary-500
}
</style>
