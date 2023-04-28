<script setup lang="ts">
import type { GroupType, TaskType } from '~/types'

const props = defineProps<{
  group: GroupType
  taskListGroup?: string
}>()

const emits = defineEmits<{
  (e: 'update:group', val: GroupType): void
}>()

function handleUpdateTask(tasks: TaskType[]) {
  emits('update:group', {
    ...props.group,
    tasks,
  })
}
</script>

<template>
  <NCollapseItem :title="group.title">
    <TaskList :tasks="group.tasks" :group="taskListGroup" @update:tasks="handleUpdateTask" />
  </NCollapseItem>
</template>
