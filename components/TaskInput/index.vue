<script setup lang="ts">
import { number } from 'vue-types'
import { dbService } from '~/dexie/dbService'

const props = defineProps({
  listId: number().isRequired,
  groupIndex: number().isRequired,
})

const emits = defineEmits<{
  (e: 'needUpdateList'): void
}>()

defineOptions({
  name: 'TaskInput',
})

const taskInputVal = ref('')

async function handleInputEnter() {
  if (!taskInputVal.value)
    return

  await dbService.addTask(props.listId, props.groupIndex, createTask(taskInputVal.value))

  taskInputVal.value = ''
  emits('needUpdateList')
}
</script>

<template>
  <NInput v-model:value="taskInputVal" placeholder="新任务" @keyup.enter="handleInputEnter" />
</template>
