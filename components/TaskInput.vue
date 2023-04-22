<script setup lang="ts">
import { NInput } from 'naive-ui'
import type { Task } from '~/types'

const emits = defineEmits<{
  (e: 'addTask', task: Task): void
}>()

const taskInputVal = ref('')

function handleInputEnter() {
  if (!taskInputVal.value)
    return

  emits('addTask', createTask(taskInputVal.value))

  taskInputVal.value = ''
}
</script>

<template>
  <NInput v-model:value="taskInputVal" placeholder="新任务" @keyup.enter="handleInputEnter" />
</template>
