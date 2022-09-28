<template>
  <div
      ref="containerRef"
      class="grid-container w-full h-full overflow-y-auto scrollbar-hide"
      :class="['_' + count]"
  >

    <div
        ref="layoutRef"
        class="dynamic-layout flex flex-wrap h-full justify-around items-center -m-2"
        :class="['_' + count]"
    >
      <div
          v-for="(item, index) in items"
          :key="index"
          class="relative item"
          :class="['_' + index]"
          :style="itemStyle"
      >
        <div class="w-full h-full p-2">
          <div class="w-full h-full bg-white rounded-lg overflow-hidden">
            <slot :item="item"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {UID} from "agora-rtc-sdk-ng";

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
  if(!containerHeight.value || !containerWidth.value) {
    return {}
  }
  if(count.value === 1) {
    // if(containerWidth.value > containerHeight.value) {
    //   return {
    //     width: containerHeight.value + 'px',
    //     height: containerHeight.value * 7 / 12 + 'px',
    //   }
    // } else {
    //   return {
    //     width: containerWidth.value + 'px',
    //     height: containerWidth.value * 12 / 7 + 'px',
    //   }
    // }
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
