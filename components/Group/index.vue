<script setup lang="ts">
import { useDialog } from 'naive-ui'
import { object, string } from 'vue-types'
import type { OperateOption } from '../PopoverList'
import type { GroupType, TaskType } from '~/types'

const props = defineProps({
  group: object<GroupType>().isRequired,
  taskListGroup: string(),
})

const emits = defineEmits<{
  (e: 'update:group', group: GroupType): void
  (e: 'insertLeftGroup'): void
  (e: 'insertRightGroup'): void
  (e: 'deleteGroup'): void
}>()

defineOptions({
  name: 'Group',
})

const dialog = useDialog()
const isTitleEdit = ref(false)
const isShowOperatePopover = ref(false)

const operateLists: OperateOption[] = [
  {
    icon: 'i-ant-design:edit-filled',
    label: '重命名',
    onClick: () => {
      isShowOperatePopover.value = false
      isTitleEdit.value = true
    },
  },
  {
    icon: 'i-ant-design:insert-row-left-outlined',
    label: '左侧添加分组',
    onClick: () => {
      isShowOperatePopover.value = false
      emits('insertLeftGroup')
    },
  },
  {
    icon: 'i-ant-design:insert-row-right-outlined',
    label: '右侧添加分组',
    onClick: () => {
      isShowOperatePopover.value = false
      emits('insertRightGroup')
    },
  },
  {
    icon: 'i-ant-design:delete-filled',
    label: '删除',
    onClick: () => {
      dialog.warning({
        title: '警告',
        content: '你确定？',
        positiveText: '确定',
        negativeText: '不确定',
        onPositiveClick: () => {
          emits('deleteGroup')
        },
      })
    },
  },
]

function handleAddTask(task: TaskType) {
  emits('update:group', { ...props.group, taskIds: [task.id!, ...props.group.taskIds] })
}

function handleUpdateGroupTitle(val: string) {
  emits('update:group', { ...props.group, title: val })
}

function handleUpdateTaskIds(taskIds: number[]) {
  emits('update:group', { ...props.group, taskIds })
}
</script>

<template>
  <div class="bg-white p-2 rounded grid grid-rows-[auto_auto_1fr] gap-2 max-h-full box-border">
    <div class="flex justify-between">
      <FocusInput
        v-model:is-edit="isTitleEdit"
        :input-props="{
          value: group.title,
          onUpdateValue: handleUpdateGroupTitle,
        }"
      />
      <PopoverList v-model:isShow="isShowOperatePopover" :operate-lists="operateLists" />
    </div>
    <TaskInput @add-task="handleAddTask" />
    <TaskList :task-ids="group.taskIds" :group="taskListGroup" class="m-h-0 overflow-y-scroll" @update:task-ids="handleUpdateTaskIds" />
  </div>
</template>
