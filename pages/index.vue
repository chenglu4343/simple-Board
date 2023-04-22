<script setup lang="ts">
import { NInput, NSwitch } from 'naive-ui'
import { useListMode } from './composables/useListMode'
import type { List } from '~/types'
import { createList } from '~/utils/createType'
import TaskList from '~/components/TaskList.vue'

const { isBoard, isList, handleSwitchModeChange } = useListMode()

const titleInput = ref('')
const list = ref<List>(createList())

function handleTitleInputEnter() {
  if (!titleInput.value)
    return

  addTask2List(list.value, createTask(titleInput.value))
  titleInput.value = ''
}
</script>

<template>
  <main class="p-2">
    <header>
      {{ isBoard ? '看板模式' : '清单模式' }}
      <NSwitch :value="isBoard" :on-update-value="handleSwitchModeChange" />
    </header>

    <NInput
      v-model:value="titleInput"
      placeholder="输入标题"
      class="mt-2"
      @keyup.enter="handleTitleInputEnter"
    />

    <template v-if="isList && list.groups.length === 1">
      <TaskList v-model:tasks="list.groups[0].tasks" />
    </template>
  </main>
</template>
