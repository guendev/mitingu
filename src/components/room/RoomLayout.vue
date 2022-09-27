<template>
  <div
      ref="layoutRef"
      class="w-full h-full overflow-y-auto scrollbar-hide"
      :class="['_' + count]"
  >

    <grid-layout
        v-if="ready"
        id="gridLayout"
        ref="gridRef"
        class="w-full mx-auto"
        :layout="layout"
        :style="style"
        :col-num="12"
        v-bind="options"
        :use-css-transforms="true"
    >
      <grid-item
          v-for="(item, index) in layout"
          :key="item.i"
          :static="item.static"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
      >
        <slot :index="index"></slot>
      </grid-item>
    </grid-layout>
  </div>
</template>

<script lang="ts" setup>
import { CSSProperties } from 'vue'

const props = defineProps<{
  count: number
  active?: number
}>()

const layout = ref<any[]>([])
const options = reactive({
  isDraggable: false,
  isResizable: false,
  responsive: false,
  rowHeight: 0,
  margin: [0, 0],
})

// tính toán kích c
const layoutRef = ref<HTMLElement>()
const { width, height } = useElementSize(layoutRef)

const style = computed(() => {
  const style: CSSProperties = {}
  if (width.value && height.value) {
    if(props.count === 1) {
      style.maxWidth = '800px'
      style.width = '100%'
    } else if (width.value > height.value * 1.5 && props.count >= 3 && props.count <= 4) {
      style.width = height.value * 1.7 + 'px'
    }
  }
  return style
})

const calculateRowHeight = () => {
  options.rowHeight = layoutRef.value!.clientHeight / 12
}
onMounted(() => nextTick(() => calculateRowHeight()))

// tính toán bố cục
const autoLayout = () => {
  const getItemConfig = (i: number, w: number, h: number) => ({
    x: props.active === i ? 12 : (i * w) % 12,
    y: 0,
    w: props.active === i ? 12 : w,
    h: props.active === i ? 12 : h,
    i: i.toString(),
  })

  let _primaryLayout
  if (width.value >= 768) {
    // layout gốc
    _primaryLayout = Array(props.count)
        .fill('')
        .map((_, i) => {
          if (props.count === 1) {
            return getItemConfig(i, 12, 12)
          } else if (props.count === 2) {
            return getItemConfig(i, 6, 12)
            // 3-4
          } else if (props.count <= 4) {
            return getItemConfig(i, 6, 6)
          }

          return getItemConfig(i, 4, 6)
        })
  } else {
    _primaryLayout = Array(props.count)
        .fill('')
        .map((_, i) => {
          if (props.count === 1) {
            return getItemConfig(i, 12, 12)
          } else if (props.count === 2) {
            return getItemConfig(i, 12, 6)
            // 3-4
          } else if (props.count === 3) {
            return getItemConfig(i, 6, 6)
          } else if (props.count == 4) {
            return getItemConfig(i, 6, 6)
          }

          return getItemConfig(i, 6, 6)
        })
  }

  // Tính xuống hangf
  for (let i = 0; i < _primaryLayout.length; i++) {

    if (i === props.active) {
      _primaryLayout[i].y = 0
      _primaryLayout[i].h = 12
      _primaryLayout[i].w = 12
      _primaryLayout[i].x = 0
    } else {
      _primaryLayout[i].y = 12
    }
  }

  layout.value = _primaryLayout
}

// khi nào thì show
const ready = computed(() => !!options.rowHeight)


const debouncedRebuild = useDebounceFn(() => {
  autoLayout()
  calculateRowHeight()
}, 500)

watch(width, () => {
  if (layoutRef.value) {
    debouncedRebuild()
  }
})

watch(() => props.count, () => {
  if (layoutRef.value) {
    debouncedRebuild()
  }
})

</script>
