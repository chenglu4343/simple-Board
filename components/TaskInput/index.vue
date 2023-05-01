<script setup lang="ts">
import type { TaskType } from '~/types'
import { createTask } from '~/utils/createType'

const emits = defineEmits<{
  (e: 'addTask', task: TaskType): void
}>()

defineOptions({
  name: 'TaskInput',
})

const taskInputVal = ref('')

async function handleInputEnter() {
  if (!taskInputVal.value)
    return

  emits('addTask', await createTask(taskInputVal.value))

  taskInputVal.value = ''
}
</script>

<template>
  <NInput v-model:value="taskInputVal" placeholder="新任务" @keyup.enter="handleInputEnter" />
</template>
