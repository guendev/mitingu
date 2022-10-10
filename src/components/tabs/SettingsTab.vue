<template>
  <div class="relative flex h-full w-full flex-col">

    <div class="flex items-center mb-5">
      <h4 class="flex-shrink-0 text-[18px] text-gray-700 mb-0">
        {{ $t('setting') }}
      </h4>
      <button
          class="bg-rose-500 text-white text-[18px] p-1 rounded-full transform bottom-2 md:hidden relative ml-5"
          @click="roomStore.toogleTab('settings')"
      >
        <i-material-symbols-close />
      </button>
    </div>

    <div class="flex-full relative overflow-y-auto" id="members-tab">
      <div>
        <h5 class="text-gray-500">
          {{ $t('displayMode') }}
        </h5>

        <div class="flex items-center">
          <div class="flex items-center cursor-pointer" @click="roomStore.mode = 'scroll'">
            <div
                class="w-4 h-4 custom-checkbox"
                :class="{'_checked': roomStore.mode === 'scroll'}"
            >
              <i-material-symbols-check-small class="check-icon opacity-0 relative z-20 transform transition scale-0" />
            </div>
            <span class="text-[14px] ml-1">
              {{ $t('scroll') }}
            </span>
          </div>

          <div class="flex items-center cursor-pointer ml-5" @click="roomStore.mode = 'flexible'">
            <div
                class="w-4 h-4 custom-checkbox"
                :class="{'_checked': roomStore.mode === 'flexible'}"
            >
              <i-material-symbols-check-small class="check-icon opacity-0 relative z-20 transform transition scale-0" />
            </div>
            <span class="text-[14px] ml-1">
              {{ $t('grid') }}
            </span>
          </div>
        </div>

      </div>

      <div class="mt-5">
        <h5 class="text-gray-500">
          {{ $t('languages') }}
        </h5>

        <div class="flex items-center">

          <button
              class="text-[25px] transition"
              :class="[$i18n.locale === 'vi' ? '' : 'opacity-50']"
              @click="$i18n.locale = 'vi'"
          >
            <i-twemoji-flag-vietnam />
          </button>

          <button
              class="text-[25px] transition ml-4" @click="$i18n.locale = 'jp'"
              :class="[$i18n.locale === 'jp' ? '' : 'opacity-50']"
          >
            <i-twemoji-flag-japan />
          </button>
        </div>
      </div>


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

<style scoped lang="scss">
#chat-tab {
  height: calc(100% - 28px - 10px);
}

.custom-checkbox {
  @apply border-2 rounded border-primary-500 flex items-center justify-center relative transition text-white overflow-hidden;
  &._checked {
    .check-icon {
      @apply opacity-100 scale-100;
    }
  }
}
.custom-checkbox:before {
  content: '';
  @apply absolute w-full h-full top-0 left-0 bg-primary-500 transition z-10;
  transform: rotate(100deg);
  transform-origin: 100% 100%;
}

.custom-checkbox._checked:before {
  transform: rotate(0deg);
}

</style>
