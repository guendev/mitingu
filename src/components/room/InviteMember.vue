<template>
  <div class="flex items-center">
    <a
      href="javascript:void(0)"
      class="block h-[30px] w-[30px] overflow-hidden rounded-full"
    >
      <img :src="member.avatar" alt="" />
    </a>

    <div class="ml-2 mr-3">
      <h4 class="mb-0">
        {{
          member.name?.split(' ')?.[String(member.name).split(' ').length - 1]
        }}
      </h4>

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

    <a-button
      type="primary"
      class="ml-auto"
      size="small"
      :disabled="!!skipTime || disabled"
      @click.stop="inviteMember()"
    >
      {{ $t('invite') }}
      <span v-if="skipTime" class="ml-1 text-xs">({{ skipTime }})</span>
    </a-button>
  </div>
</template>

<script lang="ts" setup>
import { UserDocument } from '@entities/user'
import { v4 as uuidv4 } from 'uuid'

const props = withDefaults(
  defineProps<{
    member: UserDocument
    disabled?: boolean
  }>(),
  {
    disabled: false
  }
)

const skipTime = ref(0)

const userStore = useUserStore()
const roomStore = useRoomStore()
const route = useRoute()

const inviteMember = async (single = true) => {
  skipTime.value = 30
  const timer = setInterval(() => {
    skipTime.value--
    if (skipTime.value === 0) {
      clearInterval(timer)
    }
  }, 1000)

  const uid = uuidv4()
  await dbSet(
    dbRef(
      getDatabase(),
      `invites/${props.member.id}/${route.params?.id}/${uid}`
    ),
    {
      id: uid,
      from: {
        id: userStore.user?.id,
        name: userStore.user?.name,
        avatar: userStore.user?.avatar
      },
      to: {
        id: props.member.id,
        name: props.member.name
      },
      goal: {
        id: route.params?.id,
        name: roomStore.goal?.name
      },
      single,
      disabled: false,
      createdAt: Date.now()
    }
  )

  const [goalId, prefix, random] = (route.params.id as string).split('-')

  await dbSet(
    dbRef(
      getDatabase(),
      `meeting-logs/${goalId}/${prefix}/invites/${random}` + uid
    ),
    {
      sender: {
        id: userStore.user?.id,
        name: userStore.user?.name,
        email: userStore.user?.email
      },
      receiver: {
        id: props.member.id,
        name: props.member.name,
        email: props.member.email
      },
      createdAt: Date.now()
    }
  )
}

defineExpose({
  inviteMember
})
</script>

<style scoped></style>
