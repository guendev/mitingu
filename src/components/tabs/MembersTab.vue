<template>
  <div class="relative flex h-full w-full flex-col">

    <div class="flex items-center mb-5">
      <h4 class="flex-shrink-0 text-[18px] text-gray-700 mb-0">Danh Sách Lớp</h4>
      <div class="flex flex-col items-end ml-auto">
        <div>
          <a-switch v-model:checked="isOnlyRoom" />
        </div>
        <span class="text-[11px] text-gray-500">Chỉ hiện học sinh Online</span>
      </div>

      <button
          class="bg-rose-500 text-white text-[18px] p-1 rounded-full transform bottom-2 md:hidden relative ml-5"
          @click="roomStore.toogleTab('users')"
      >
        <i-material-symbols-close />
      </button>
    </div>

    <div class="flex-full relative overflow-y-auto" id="members-tab">
      <ul>
        <li
          v-for="member in listUser"
          :key="member.id"
          class="border-b border-gray-100 py-3 first:pt-0 last:border-0 last:pb-0 cursor-pointer"
        >
          <div class="flex items-center">
            <a-avatar :src="member.avatar" size="large" />
            <div class="ml-3">
              <h4 class="mb-0.5">{{ member.name }}</h4>
              <template v-if="['owner', 'coach'].includes(member.type)">
                <span
                  v-if="member.type === 'owner'"
                  class="rounded-lg bg-orange-500 px-1.5 py-px text-[11px] text-white"
                >
                  {{ member.type }}
                </span>

                <span
                  v-else
                  class="rounded-lg bg-primary-600 px-1.5 py-px text-[11px] text-white"
                >
                  {{ member.type }}
                </span>
              </template>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {UID} from "agora-rtc-sdk-ng";

const roomStore = useRoomStore()
const userStore = useUserStore()
const agoraStore = useAgoraStore()

const isOnlyRoom = ref(false)

const usersID = computed<UID[]>(() => [userStore.user!.id, ...Object.keys(agoraStore.mapRemoteUsers).map((key) => Number(key))])

const listUser = computed(() => {
  if (isOnlyRoom.value) {
    return roomStore.members.filter((member) => usersID.value.includes(Number(member.id)))
  }
  return roomStore.members
})
</script>

<style scoped>
#chat-tab {
  height: calc(100% - 28px - 10px);
}
</style>
