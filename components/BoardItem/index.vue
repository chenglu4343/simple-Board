<script setup lang="ts">
import { bool, object } from 'vue-types'
import type { OperateOption } from '../IconSelectList'
import type { BoardType } from '~/types'

defineProps({
  isDrag: bool(),
  board: object<BoardType>().isRequired,
  isActive: bool(),
})

const emits = defineEmits<{
  (e: 'updateBoardTitle', val: string): void
  (e: 'deleteBoard'): void
}>()

const isShowPopover = ref(false)
const isTitleEdit = ref(false)

const selectList: OperateOption[] = [
  {
    icon: 'i-ant-design:pic-left-outlined',
    label: '重命名',
    onClick: () => {
      isTitleEdit.value = true
      isShowPopover.value = false
    },
  },
  {
    icon: 'i-ant-design:delete-outlined',
    label: '删除',
    onClick: () => {
      emits('deleteBoard')
      isShowPopover.value = false
    },
  },
]
</script>

<template>
  <div>
    <RightClickManualPopover v-model:show="isShowPopover">
      <template #default>
        <div
          class="grid gap-2 p-2 cursor-pointer rounded-2 box-border grid-cols-[auto_1fr] items-center"
          :class="{
            'bg-gray-3': isActive,
            'hover:bg-gray-3': !isDrag,
          }"
        >
          <div class="i-ant-design:menu-outlined w-10" />

          <FocusInput
            v-model:is-edit="isTitleEdit"
            class="min-w-0 whitespace-nowrap text-ellipsis overflow-x-hidden"
            :class="{
              'text-blue-500': isActive,
            }"
            :input-props="{
              'value': board.title,
              'placeholder': '看板名称',
              'onUpdate:value': (val: string) => {
                emits('updateBoardTitle', val)
              },
            }"
          />
        </div>
      </template>

      <template #popover>
        <IconSelectList :select-list="selectList" />
      </template>
    </RightClickManualPopover>
  </div>
</template>
