<script setup lang="ts">
import { NInput, NSwitch } from 'naive-ui'
import { useListMode } from './composables/useListMode'
import type { List, Task } from '~/types'
import { createList } from '~/utils/createType'
import TaskCom from '~/components/Task.vue'

const { isBoard, isList, handleSwithModeChange } = useListMode()

const titleInput = ref('')
const list = ref<List>(createList())

function handleTitleInputEnter() {
  if (!titleInput.value)
    return

  addTask2List(list.value, createTask(titleInput.value))
  titleInput.value = ''
}

function handleTaskChange(task: Task, index: number) {
  list.value.groups[0].tasks[index] = task
}
</script>

<template>
  <main class="p-2">
    <header>
      {{ isBoard ? '看板模式' : '清单模式' }}
      <NSwitch :value="isBoard" :on-update-value="handleSwithModeChange" />
    </header>

    <NInput
      v-model:value="titleInput"
      placeholder="输入标题"
      class="mt-2"
      @keyup.enter="handleTitleInputEnter"
    />

    <template v-if="isList && list.groups.length === 1">
      <TaskCom
        v-for="(task, index) of list.groups[0].tasks"
        :key="index"
        :task="task"
        @update:task="(val) => handleTaskChange(val, index)"
      />
    </template>
  </main>
</template>
