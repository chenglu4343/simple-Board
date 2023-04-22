<script setup lang="ts">
import type { GroupType, TaskType } from '~/types'

const props = defineProps<{
  group: GroupType
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
  <div>
    <div>{{ group.title }}</div>
    <TaskInput class="mt-2" @add-task="handleAddTask" />
    <TaskList :tasks="group.tasks" class="mt-2" @update:tasks="(val) => handleTasksChange(val)" />
  </div>
</template>
