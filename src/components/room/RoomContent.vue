<template>
  <div id="room-content">
    <div
        class="mate-wrapper relative"
        :class="[roomStore.sidebar ? 'mate-wrapper--sidebar md:pr-[340px]' : '']"
    >
      <room-layout :count="6" :active="-1">
        <template #default="{ index }">
          <media-item :uid="index" :data-index="index" />
        </template>
      </room-layout>

      <div v-if="roomStore.sidebar" class="absolute right-0 w-full md:w-[325px] h-full top-0 bg-white rounded-lg p-4">
        <div class="w-full h-full relative">
          <messages-tab v-if="roomStore.sidebar === 'chat' " />
          <members-tab v-else-if="roomStore.sidebar === 'users'" />
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import {UID} from "agora-rtc-sdk-ng";
import MessagesTab from "@components/tabs/MessagesTab.vue";

const agoraStore = useAgoraStore()
const roomStore = useRoomStore()
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
