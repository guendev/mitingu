<template>
  <div id="room-content">
    <div class="mate-wrapper">
      <room-layout :count="usersID.length + 1" :active="-1">
        <template #default="{ index }">
          <media-item :index="index" />
        </template>
      </room-layout>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {UID} from "agora-rtc-sdk-ng";

const agoraStore = useAgoraStore()
const usersID = computed<UID[]>(() => Object.keys(agoraStore.mapRemoteUsers))
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
