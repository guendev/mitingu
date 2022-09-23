<template>
  <div :id='$route.meta.layout || "default"' class='text-gray-600'>
    <component :is="layout" :key="layout" />
  </div>
  <vue-loading-indicator />
</template>

<script lang='ts' setup>
import { useLoadingIndicator } from '@nguyenshort/vue3-loading-indicator'

const router = useRouter()
const route = useRoute()
// Init app
// Rename from vueClientInit
const vueClientInit = async  () => {
  //
}
await vueClientInit()

const layouts = shallowRef<Record<string, ReturnType<typeof defineComponent>>>({})

const allowedLayouts = ['default']
const asyncLayout = () => {
  allowedLayouts.forEach(layout => {
    layouts.value[layout] = defineAsyncComponent(() => import(`../../layouts/${layout}.vue`))
  })
}

asyncLayout()

const layout = computed(() => {
  // lấy layout từ router
  const _name = allowedLayouts.includes(route.meta.layout || 'default') ? route.meta.layout || 'default' : 'default'
  return layouts.value[_name]
})

// setup progress bar
const $loading = useLoadingIndicator()
const setupProgressLoading = () => {
  $loading?.start()
  router.beforeEach((to, from, next) => {
    //  does the page we want to go to have a meta.progress object
    //  start the progress bar
    $loading?.start()
    //  continue to next page
    next();
  })
  router.afterEach(() => {
    //  finish the progress bar
    $loading?.finish()
  })
}

setupProgressLoading()

onMounted(() => {
  $loading?.finish()
})
</script>

<style>
@import "@nguyenshort/vue3-loading-indicator/dist/style.css";

.vue-process-bar ._process {
  transition: 200ms linear;
}
</style>
