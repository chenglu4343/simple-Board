<script setup lang="ts">
import { object } from 'vue-types'
import type { TaskType } from '~/types'

const props = defineProps({
  task: object<TaskType>().isRequired,
})

const emits = defineEmits<{
  (e: 'update:task', task: TaskType): void
}>()

defineOptions({
  name: 'Task',
})

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
