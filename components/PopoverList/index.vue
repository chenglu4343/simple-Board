<script setup lang="ts">
import { array, bool, func } from 'vue-types'
import type { OperateOption } from '../IconSelectList'

defineProps({
  isShow: bool(),
  operateLists: array<OperateOption>(),
  handleIconClick: func<(e: MouseEvent) => void>().def(() => {}),
})

const emits = defineEmits<{
  (e: 'update:isShow', val: boolean): void
}>()
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
      <div class="i-ant-design:more-outlined cursor-pointer" @click="handleIconClick" />
    </template>
    <template #default>
      <IconSelectList :select-list="operateLists" />
    </template>
  </NPopover>
</template>
