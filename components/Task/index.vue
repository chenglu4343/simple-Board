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

const isShowEditDrawer = ref(false)

async function handleUpdateTask(newTask: TaskType) {
  await dbService.updateTask(newTask)
  emits('update:task', newTask)
}

async function handleTaskStatusChange(val: boolean) {
  const newTask: TaskType = {
    ...props.task,
    status: val ? 'done' : 'todo',
  }
  await handleUpdateTask(newTask)
}

function handleEditTask() {
  isShowEditDrawer.value = true
}
</script>

<template>
  <div class="cursor-pointer" @click="handleEditTask">
    <NCheckbox
      :checked="task.status === 'done'"
      @update:checked="handleTaskStatusChange"
      @click.stop="() => {}"
    />
    <span>
      {{ task.title }}
    </span>

    <TaskEditDrawer v-model:show="isShowEditDrawer" :task="task" @update:task="handleUpdateTask" />
  </div>
</template>
