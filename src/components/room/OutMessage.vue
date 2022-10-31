<template>
  <span v-html="name"></span>
</template>

<script lang="ts" setup>
defineProps<{
  name: string
}>()
</script>
