<template>
  <div class="flex items-center">
    <a-button type="danger" @click="cancelClick">Huỷ Bỏ</a-button>
    <a-button type="primary" @click="okClick" class="ml-4">
      Tham Gia
    </a-button>
  </div>
</template>

<script lang="ts" setup>
import { notification } from 'ant-design-vue'
const props = defineProps<{
  invite: any,
  inviteKey: string
}>()

const okClick = () => {
  window.location.href = '/room/' + props.invite.goal?.id
}

const cancelClick = () => {
  notification.close(props.inviteKey)
}
</script>
