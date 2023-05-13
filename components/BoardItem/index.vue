<script setup lang="ts">
import { bool, object } from 'vue-types'
import type { OperateOption } from '../IconSelectList'
import type { BoardType } from '~/types'

defineProps({
  board: object<BoardType>().isRequired,
  isActive: bool(),
})

const selectList: OperateOption[] = [
  {
    icon: 'i-ant-design:pic-left-outlined',
    label: '重命名board',
    onClick: () => {
      // TODO
    },
  },
  {
    icon: 'i-ant-design:delete-outlined',
    label: '删除board',
    onClick: () => {
      // TODO
    },
  },
]
</script>

<template>
  <div>
    <RightClickManualPopover>
      <template #default>
        <div
          class="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-3 p-2 rounded-2"
          :class="{
            'bg-gray-3': isActive,
          }"
        >
          <div class="i-ant-design:menu-outlined" />

          <span
            :class="{
              'text-blue-500': isActive,
            }"
          >{{ board.title }}</span>
        </div>
      </template>

      <template #popover>
        <IconSelectList :select-list="selectList" />
      </template>
    </RightClickManualPopover>
  </div>
</template>
