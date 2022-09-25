<template>
  <div id="confirm" class="w-full h-full min-h-screen relative">

    <div v-if="userStore.auth" class='absolute top-5 right-5'>
      <current-user />
    </div>

    <div class="max-w-bootstrap mx-auto w-full h-full flex">
      <div class="w-1/2 flex items-center justify-center">
        <div class="text-gray-300">


          <template v-if="!userStore.auth">
            <h3 class="text-[27px] text-gray-200">Đăng Nhập</h3>
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
                  :rules="[{ required: true, message: 'Please input your username!' }]"
              >
                <a-input v-model:value="formState.email" />
              </a-form-item>

              <a-form-item
                  label="Password"
                  name="password"
                  :rules="[{ required: true, message: 'Please input your password!' }]"
              >
                <a-input-password v-model:value="formState.password" />
              </a-form-item>

              <a-form-item>
                <a-button type="primary" html-type="submit">Submit</a-button>
              </a-form-item>
            </a-form>
          </template>

          <template v-else>
            <h3 class="text-[27px] text-gray-200">Tham gia một cuộc hội thoại</h3>

            <div class="flex items-center">
              <a-button type="danger" size='large' @click="newRoom">
                <template #icon>
                  <i-bx-bxs-video-recording class='inline mr-2' />
                </template>
                Cuộc Họp Mới
              </a-button>

              <a-input
                  v-model:value='roomID'
                  placeholder='Hoặc nhập ID phòng'
                  class='ml-4'
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
      <div class="w-1/2 h-full flex items-center justify-center">
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
