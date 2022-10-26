<template>
  <div class="flex items-center">
    <a-button type="danger" @click="cancelClick">Huỷ</a-button>
    <a-button type="primary" class="ml-4" @click="okClick"> Tham Gia </a-button>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  invite: any
  inviteKey: string
  path: string
}>()

const okClick = () => {
  window.location.href = '/room/' + props.invite.goal?.id
}


const cancelClick = async () => {
  window.dispatchEvent(new CustomEvent('afterClickCancelInvite', {
    detail: {
      invite: props.invite,
      path: props.path
    }
  }))

}
</script>
