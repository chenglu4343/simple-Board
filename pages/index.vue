<script setup lang="ts">
import { NInput, NSwitch } from 'naive-ui'
import { useListMode } from './composables/useListMode'
import type { List } from '~/types'
import { createList } from '~/utils/createType'

const { isBoard, isList, handleSwithModeChange } = useListMode()

const title = ref('')
const list = ref<List>(createList())

function handleTitleInputEnter() {
  if (!title.value)
    return

  addTask2List(list.value, createTask(title.value))
  title.value = ''
}
</script>

<template>
  <main class="p-2">
    <header>
      {{ isBoard ? '看板模式' : '清单模式' }}
      <NSwitch :value="isBoard" :on-update-value="handleSwithModeChange" />
    </header>

    <NInput v-model:value="title" placeholder="输入标题" class="mt-2" @keyup.enter="handleTitleInputEnter" />

    <template v-if="isList && list.groups.length === 1">
      <div v-for="(task, index) of list.groups[0].tasks" :key="index">
        {{ task.title }}
      </div>
    </template>
  </main>
</template>
