<template>
  <div
      ref="containerRef"
      class="grid-container w-full h-full overflow-y-auto scrollbar-hide relative z-10"
      :class="['_' + count]"
  >

    <div
        ref="layoutRef"
        class="dynamic-layout flex-wrap h-full justify-center items-center"
        :class="['_' + count, roomStore.mode]"
    >
      <div
          v-for="(item, index) in items"
          :key="index"
          class="relative item"
          :class="['_' + index]"
          :style="itemStyle"
      >
        <div class="w-full h-full">
          <div class="w-full h-full bg-white rounded-lg overflow-hidden">
            <slot :item="item"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {UID} from "agora-rtc-sdk-ng"

const roomStore = useRoomStore()

const props = defineProps<{
  items: (any & {
    uid: UID
  })[]
  active?: number
}>()

const count = computed(() => props.items.length)

const layoutRef = ref<HTMLDivElement>()
const containerRef = ref<HTMLDivElement>()
const { width: containerWidth, height: containerHeight } = useElementSize(containerRef)

const itemStyle = computed(() => {
  /**
   * Tính theo coonng thức
   * Gọi x là nhiều rộng: containerWidth
   * Gọi y là chiều cao: containerHeight
   * => Diện thích S = x * y
   *
   * Gọi n là số phần tử: props.items.length
   * => Diện tích mỗi phần là s = S/n
   *
   * Gọi a và b lầ lượt là chiều dài và chiều rộng mỗi phần tử
   * Ta có hệ 2 phương trình 3 ẩn như sau
   * 1. a * b = s
   * 2. a/b xấp xỉ bằng R
   * Với R là tỉ lệ 2 cạnh. Chiều dài / chiều rộng
   * => a = s/b
   * => R xấp xỉ bằng s/b^2
   * => b xấp xỉ bằng sqrt(s/r)
   */

  /**
   * @param r là tỉ lệ a/b
   */
  const autoFit = (r: number) => {
    // Tổng hiện tích
    const S = containerWidth.value * containerHeight.value
    // Số người/phần tử
    const n = props.items.length
    // => diện tích của mỗi ng
    const s = S/n
    // Dùng công thức có được từ phía trên => chiều dài... cạnh trên dưới
    const b = Math.sqrt(s/r)

    return {
      a: s / b,
      b
    }
  }

  const data = autoFit(1)

  // return {
  //   height: data.a + 'px',
  //   width: data.b + 'px'
  // }

  if (roomStore.mode === 'grid') {
    return {}
  }


  if(!containerHeight.value || !containerWidth.value) {
    return {}
  }
  if(count.value === 1) {
    if(containerWidth.value > containerHeight.value) {
      return {
        width: containerHeight.value * 12 / 7 + 'px',
        height: containerHeight.value + 'px',
      }
    }
    return {
      width: containerWidth.value + 'px',
      height: containerHeight.value + 'px',
    }
  } else if(count.value === 2) {
    // 2 chiều trên PC & đổi chiều trên mobile
    if(containerWidth.value > containerHeight.value) {
      return {
        height: containerHeight.value + 'px',
        width: (containerWidth.value / 2) + 'px'
      }
    } else {
      return {
        height: (containerHeight.value / 2) + 'px',
        width: containerWidth.value + 'px'
      }
    }
  } else {

    if(containerWidth.value <= 640) {
      const _sizeBase = containerWidth.value / 2
      return {
        width: _sizeBase + 'px',
        height: _sizeBase + 'px'
      }
    }

    //  chia 4 theo tỉ lệ 7/12
    if(containerWidth.value > containerHeight.value) {
      const _sizeBase = containerHeight.value / 2
      return {
        width: _sizeBase * 12 / 7 + 'px',
        height: _sizeBase + 'px'
      }
    } else {
      const _sizeBase = containerWidth.value / 2
      return {
        width: _sizeBase * 12 / 7 + 'px',
        height: _sizeBase + 'px'
      }
    }
  }
})

</script>
