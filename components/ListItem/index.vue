<script setup lang="ts">
import { bool, object } from 'vue-types'
import type { ListType } from '~/types'

const props = defineProps({
  list: object<ListType>().isRequired,
  isActive: bool(),
})
</script>

<template>
  <div
    class="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-3 p-2 rounded-2"
    :class="{
      'bg-gray-3': isActive,
    }"
  >
    <div
      :class="{
        'i-ant-design:inbox-outlined': list.icon === 'collection',
        'i-ant-design:menu-outlined': list.icon === 'list',
      }"
    />

    <span
      :class="{
        'text-blue-500': isActive,
      }"
    >{{ list.title }}</span>
  </div>
</template>
