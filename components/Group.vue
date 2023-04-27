<script setup lang="ts">
import type { GroupType, TaskType } from '~/types'
import TaskInput from '~/components/TaskInput.vue'
import TaskList from '~/components/TaskList.vue'

const props = defineProps<{
  group: GroupType
  taskListGroup?: string
}>()

const emits = defineEmits<{
  (e: 'update:group', group: GroupType): void
}>()

function handleTasksChange(tasks: TaskType[]) {
  emits('update:group', { ...props.group, tasks })
}

function handleAddTask(task: TaskType) {
  emits('update:group', { ...props.group, tasks: [task, ...props.group.tasks] })
}
</script>

<template>
  <div class="bg-white p-2 rounded grid grid-rows-[auto_auto_1fr]">
    <div>{{ group.title }}</div>
    <TaskInput class="mt-2" @add-task="handleAddTask" />
    <TaskList :tasks="group.tasks" class="mt-2" :group="taskListGroup" @update:tasks="(val) => handleTasksChange(val)" />
  </div>
</template>
