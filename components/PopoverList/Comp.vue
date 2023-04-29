<script setup lang="ts">
import { array, bool } from 'vue-types'
import type { OperateOption } from '.'

const props = defineProps({
  isShow: bool(),
  operateLists: array<OperateOption>(),
})

const emits = defineEmits<{
  (e: 'update:isShow', val: boolean): void
}>()

defineOptions({
  name: 'PopoverList',
})
</script>

<template>
  <NPopover
    :show="isShow"
    trigger="click"
    :theme-overrides="{
      padding: '2px 5px',
    }"
    @update:show="(val) => emits('update:isShow', val)"
  >
    <template #trigger>
      <div class="i-ant-design:more-outlined cursor-pointer" />
    </template>
    <template #default>
      <ul class="list-none p-0 cursor-pointer">
        <li
          v-for="(item, index) of operateLists"
          :key="index"
          class="hover:bg-gray-1 flex items-center gap-2"
          @click="item.onClick"
        >
          <div :class="{ [item.icon]: true }" />
          <span>{{ item.label }}</span>
        </li>
      </ul>
    </template>
  </NPopover>
</template>
