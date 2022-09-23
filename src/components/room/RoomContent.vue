<template>
  <div id="room-content">
<!--    <div class="room-title">-->
<!--      <div data-v-15da0977="">-->
<!--        <h1 class="text-[20px] mb-0">50025</h1>-->
<!--        <h3 class="text-[12px] text-gray-500 mb-0">Thu, 22 Sep 2022 06:23:31 GMT</h3>-->
<!--      </div>-->
<!--    </div>-->
    <div class="mate-wrapper">
      <room-layout :count="7" :active="-1">
        <template #default="{ index }">
          <media-item :index="index" />
        </template>
      </room-layout>
    </div>
  </div>
</template>

<script>
export default {
  name: "RoomBody"
}
</script>

<style scoped>
#room-content {
  @apply flex-1 overflow-y-auto flex flex-col;
}
.room-title {
  @apply h-[40px] flex-shrink-0;
}
.mate-wrapper {
  @apply w-full h-full rounded-lg overflow-hidden mb-[20px];
}
</style>
