<script setup lang="ts">
import { array, string } from 'vue-types'
import Draggable from 'vuedraggable'
import type { TaskType } from '~/types'

const props = defineProps({
  group: string(),
  tasks: array<TaskType>().def(() => ([])),
})

const emits = defineEmits<{
  (e: 'update:tasks', tasks: TaskType[]): void
}>()

defineOptions({
  name: 'TaskList',
})

function handleTaskChange(task: TaskType, index: number) {
  const newTasks = [...props.tasks]
  newTasks[index] = task
  emits('update:tasks', newTasks)
}
</script>

<template>
  <Draggable :model-value="props.tasks" item-key="index" :group="group" @update:model-value="(val) => emits('update:tasks', val)">
    <template #item="{ element, index }">
      <Task :task="element" @update:task="(val) => handleTaskChange(val, index)" />
    </template>
  </Draggable>
</template>
