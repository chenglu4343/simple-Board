<script setup lang="ts">
import { object } from 'vue-types'
import { dbService } from '~/dexie/dbService'
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

async function handleTaskStatusChange(val: boolean) {
  const newTask: TaskType = {
    ...props.task,
    status: val ? 'done' : 'todo',
  }
  await dbService.updateTask(newTask)
  emits('update:task', newTask)
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
