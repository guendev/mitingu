<template>
  <div id="confirm" class="w-full h-full min-h-screen relative">

    <div class='absolute top-5 right-5'>
      <div class="flex items-center">

        <button
            class="text-[18px] transition"
            :class="[$i18n.locale === 'vi' ? '' : 'opacity-50']"
            @click="$i18n.locale = 'vi'"
        >
          <i-twemoji-flag-vietnam />
        </button>

        <button
            class="text-[16px] transition ml-4 mr-5" @click="$i18n.locale = 'jp'"
            :class="[$i18n.locale === 'jp' ? '' : 'opacity-50']"
        >
          <i-twemoji-flag-japan />
        </button>

        <current-user
            v-if="userStore.auth"
        />
      </div>
    </div>

    <div class="max-w-bootstrap mx-auto w-full h-full flex flex-col-reverse md:flex-row px-3 md:px-0">
      <div class="w-full md:w-1/2 flex items-center justify-center">
        <div class="text-gray-300">


          <template v-if="!userStore.auth">
            <h3 class="text-[27px] text-gray-200">
              {{ $t('login') }}
            </h3>
            <a-form
                :model="formState"
                name="basic"
                layout="vertical"
                autocomplete="off"
                class="w-[300px]"
                @finish="onFinish"
            >
              <a-form-item
                  label="Email"
                  name="email"
                  :rules="[{ required: true, message: $t('errorEmail') }]"
              >
                <a-input v-model:value="formState.email" />
              </a-form-item>

              <a-form-item
                  label="Password"
                  name="password"
                  :rules="[{ required: true, message: $t('Mật khẩu là bắt buộc') }]"
              >
                <a-input-password v-model:value="formState.password" />
              </a-form-item>

              <a-form-item>
                <a-button type="primary" html-type="submit">
                  {{ $t('login') }}
                </a-button>
              </a-form-item>
            </a-form>
          </template>

          <template v-else>
            <h3 class="text-[27px] text-gray-200">
              {{ $t('welcome') }}
            </h3>

            <div class="md:flex items-center">
              <a-button type="danger" size='large' @click="newRoom">
                <template #icon>
                  <i-bx-bxs-video-recording class='inline mr-2' />
                </template>
                {{ $t('newRoom') }}
              </a-button>

              <a-input
                  v-model:value='roomID'
                  :placeholder='$t("enterRoomID")'
                  class='md:ml-4 mt-4 md:mt-0'
                  @keyup.enter='toRoom(roomID.toString())'
              >
                <template #prefix>
                  <i-material-symbols-video-chat-rounded />
                </template>
              </a-input>
            </div>
          </template>

        </div>
      </div>
      <div class="w-full md:w-1/2 h-full flex items-center justify-center">
        <img width="600" src="/images/homepage-hero.jpeg" alt="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const userStore = useUserStore()

import { v4 as uuidv4 } from 'uuid'


interface FormState {
  email: string
  password: string
}

const axios = useAxios()
const cookies = useCookies()
const router = useRouter()

const formState = reactive<FormState>({
  email: '',
  password: ''
})

/**
 * Lưu token vào cookie
 * Gi token vào store vad redirect đến trang chủ
 */
const onFinish = async () => {
  try {
    const { data } = await axios.post('/smileeye/ppe-core/auth/login', toRaw(formState))
    cookies?.set('_token', data.token)
    userStore.setToken(data.token)
    userStore.setUser(data)
    message.success('Đăng nhập thành công')
  } catch (e) {
    message.error('Kiểm tra thông tin của bạn')
  }
}

const roomID = ref('')

const toRoom = (id: string) => {
  if(!id) {
    return
  }
  router.push(`/room/${id}`)
}

const newRoom = () => {
  toRoom(uuidv4().replace(/-/g, '').substring(0, 6))
}

</script>

<style scoped>
#confirm {
  @apply flex justify-center items-center bg-[#101c37] ;
}
</style>
