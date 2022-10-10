import { createApp } from 'vue'
import App from './App.vue'
import './firebase'
import './assets/tailwind.css'

import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import VueLottie from '@nguyenshort/vue-lottie'
import VueCookies from 'vue-cookies'
import VueLoadingIndicator from '@nguyenshort/vue3-loading-indicator'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import VueMitter from '@nguyenshort/vue3-mitt'


import router from './routes'
import utils from "@plugins/utils";
import axios from "@plugins/axios";
import animejs from "@plugins/animejs";
import dayjs from "@plugins/dayjs";
import {i18n} from "@plugins/i18n";

const app = createApp(App)

app.use(i18n)
app.use(createPinia())
app.use(router)
/**
 * Tự động apply basic animation
 * @link https://auto-animate.formkit.com/
 */
app.use(autoAnimatePlugin)
app.use(VueMitter)

app.use(VueLoadingIndicator, {
    autoFinish: true,
    stepGap: 100
})
app.use(VueCookies)
app.use(MotionPlugin)
app.use(VueLottie)

app.use(dayjs)
app.use(animejs)
app.use(axios)
app.use(utils)

app.mount('#app')

window.$vue = app
