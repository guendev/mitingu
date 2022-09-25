<template>
  <div id="room-content">
    <div class="mate-wrapper">
      <room-layout :count="usersID.length" :active="-1">
        <template #default="{ index }">
          <media-item :uid="usersID[index]" :data-index="index" />
        </template>
      </room-layout>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {UID} from "agora-rtc-sdk-ng";

const agoraStore = useAgoraStore()
const userStore = useUserStore()
const usersID = computed<UID[]>(() => [userStore.user!.id, ...Object.keys(agoraStore.mapRemoteUsers).map((key) => Number(key))])
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
