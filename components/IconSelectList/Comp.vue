<script setup lang="ts">
import { array } from 'vue-types'
import type { OperateOption } from '.'

defineProps({
  // OperateOption
  selectList: array<OperateOption>(),
})

defineOptions({
  name: 'IconSelectList',
})
</script>

<template>
  <ul class="list-none p-0 cursor-pointer my-2">
    <li
      v-for="(item, index) of selectList"
      :key="index"
      class="hover:bg-gray-1 flex items-center gap-2 m-0"
      @click="item.onClick"
    >
      <div :class="{ [item.icon]: true }" />
      <span>{{ item.label }}</span>
    </li>
  </ul>
</template>
