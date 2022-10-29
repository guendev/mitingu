<template>
  <div>
    <div class="w-[45px] mb-3">
      <img
        src="/images/logo.svg"
        alt="logo"
        class="h-full w-full"
      />
    </div>
    <div>
      <b>{{ invite.from.name }}</b>
      {{
        invite.single
          ? `is inviting you to practice.`
          : `is inviting you to join room to practice.`
      }}
      <b>{{ invite.goal?.name }}</b>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  invite: any
}>()
</script>

<style scoped></style>
