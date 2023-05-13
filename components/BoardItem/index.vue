<script setup lang="ts">
import { bool, object } from 'vue-types'
import type { OperateOption } from '../IconSelectList'
import type { ListType } from '~/types'

defineProps({
  list: object<ListType>().isRequired,
  isActive: bool(),
})

const selectList: OperateOption[] = [
  {
    icon: 'i-ant-design:pic-left-outlined',
    label: '重命名list,等引入dir再看看',
    onClick: () => {
      // TODO
    },
  },
  {
    icon: 'i-ant-design:delete-outlined',
    label: '删除list,等引入dir再看看',
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
          >{{ list.title }}</span>
        </div>
      </template>

      <template #popover>
        <IconSelectList :select-list="selectList" />
      </template>
    </RightClickManualPopover>
  </div>
</template>
