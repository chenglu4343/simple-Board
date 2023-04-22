<script setup lang="ts">
import Draggable from 'vuedraggable'
import type { TaskType } from '~/types'
import Task from '~/components/Task.vue'

const props = defineProps<{
  tasks: TaskType[]
}>()

const emits = defineEmits<{
  (e: 'update:tasks', tasks: TaskType[]): void
}>()

function handleTaskChange(task: TaskType, index: number) {
  const newTasks = [...props.tasks]
  newTasks[index] = task
  emits('update:tasks', newTasks)
}
</script>

<template>
  <Draggable :model-value="props.tasks" item-key="index" @update:model-value="(val) => emits('update:tasks', val)">
    <template #item="{ element, index }">
      <Task :task="element" @update:task="(val) => handleTaskChange(val, index)" />
    </template>
  </Draggable>
</template>
