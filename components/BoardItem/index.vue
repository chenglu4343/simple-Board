<script setup lang="ts">
import { bool, object } from 'vue-types'
import type { OperateOption } from '../IconSelectList'
import type { BoardType } from '~/types'

defineProps({
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
          class="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-3 rounded-2"
          :class="{
            'bg-gray-3': isActive,
          }"
        >
          <div class="i-ant-design:menu-outlined" />

          <FocusInput
            v-model:is-edit="isTitleEdit"
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
