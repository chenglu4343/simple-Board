<script setup lang="ts">
import type { GroupType, TaskType } from '~/types'
import TaskInput from '~/components/TaskInput'
import TaskList from '~/components/TaskList'

const props = defineProps<{
  group: GroupType
  taskListGroup?: string
}>()

const emits = defineEmits<{
  (e: 'update:group', group: GroupType): void
}>()

const isTitleEdit = ref(false)
const isShowOperatePopover = ref(false)

function handleTasksChange(tasks: TaskType[]) {
  emits('update:group', { ...props.group, tasks })
}

function handleAddTask(task: TaskType) {
  emits('update:group', { ...props.group, tasks: [task, ...props.group.tasks] })
}

function handleUpdateGroupTitle(val: string) {
  emits('update:group', { ...props.group, title: val })
}

function handleRename() {
  isShowOperatePopover.value = false
  isTitleEdit.value = true
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
      <NPopover
        v-model:show="isShowOperatePopover"
        trigger="click"
        :theme-overrides="{
          padding: '2px 5px',
        }"
      >
        <template #trigger>
          <div class="i-ant-design:more-outlined cursor-pointer" />
        </template>
        <template #default>
          <ul class="list-none p-0 cursor-pointer">
            <li class="hover:bg-gray-1 operate-item" @click="handleRename">
              <div class="i-ant-design:edit-filled" />
              <span>重命名</span>
            </li>
            <li class="hover:bg-gray-1 operate-item">
              <div class="i-ant-design:insert-row-left-outlined" />
              <span>左侧添加分组</span>
            </li>
            <li class="hover:bg-gray-1 operate-item">
              <div class="i-ant-design:insert-row-right-outlined" />
              <span>右侧添加分组</span>
            </li>
            <li class="hover:bg-gray-1 operate-item">
              <div class="i-ant-design:delete-filled" />
              <span>删除</span>
            </li>
          </ul>
        </template>
      </NPopover>
    </div>
    <TaskInput @add-task="handleAddTask" />
    <TaskList :tasks="group.tasks" :group="taskListGroup" class="m-h-0 overflow-y-scroll" @update:tasks="(val) => handleTasksChange(val)" />
  </div>
</template>

<style scoped>
.operate-item{
  display: flex;
  align-items: center;
  gap: 2px;
}
</style>
