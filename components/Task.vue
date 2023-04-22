<script setup lang="ts">
import { NCheckbox } from 'naive-ui'
import type { TaskType } from '~/types'

const props = defineProps<{
  task: TaskType
}>()

const emits = defineEmits<{
  (e: 'update:task', task: TaskType): void
}>()

function handleTaskStatusChange(val: boolean) {
  emits('update:task', {
    ...props.task,
    status: val ? 'done' : 'todo',
  })
}
</script>

<template>
  <div>
    <NCheckbox :checked="task.status === 'done'" @update:checked="handleTaskStatusChange" />
    <span>
      {{ task.title }}
    </span>
  </div>
</template>
