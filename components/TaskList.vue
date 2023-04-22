<script setup lang="ts">
import Draggable from 'vuedraggable'
import TaskCom from './Task.vue'
import type { Task } from '~/types'

const props = defineProps<{
  tasks: Task[]
}>()

const emits = defineEmits<{
  (e: 'update:tasks', tasks: Task[]): void
}>()

function handleTaskChange(task: Task, index: number) {
  const newTasks = [...props.tasks]
  newTasks[index] = task
  emits('update:tasks', newTasks)
}
</script>

<template>
  <Draggable :model-value="props.tasks" item-key="index" @update:model-value="(val) => emits('update:tasks', val)">
    <template #item="{ element, index }">
      <TaskCom :task="element" @update:task="(val) => handleTaskChange(val, index)" />
    </template>
  </Draggable>
</template>
