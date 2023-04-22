<script setup lang="ts">
import { NCheckbox } from 'naive-ui'
import type { Task } from '~/types'

const props = defineProps<{
  task: Task
}>()

const emits = defineEmits<{
  (e: 'update:task', task: Task): void
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
