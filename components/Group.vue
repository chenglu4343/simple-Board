<script setup lang="ts">
import TaskList from './TaskList.vue'
import type { Group, Task } from '~/types'

const props = defineProps<{
  group: Group
}>()

const emits = defineEmits<{
  (e: 'update:group', group: Group): void
}>()

function handleTasksChange(tasks: Task[]) {
  emits('update:group', { ...props.group, tasks })
}

function handleAddTask(task: Task) {
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
