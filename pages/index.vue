<script setup lang="ts">
import { NInput, NSwitch } from 'naive-ui'
import { useListMode } from './composables/useListMode'
import type { List } from '~/types'
import { createList } from '~/utils/createType'

const { isBoard, handleSwithModeChange } = useListMode()

const title = ref('')
const list = ref<List>(createList())

function handleTitleInputEnter() {

}
</script>

<template>
  <main class="p-2">
    <header>
      {{ isBoard ? '看板模式' : '清单模式' }}<NSwitch :value="isBoard" :on-update-value="handleSwithModeChange" />
    </header>

    <NInput v-model:value="title" placeholder="输入标题" class="mt-2" @enter="handleTitleInputEnter" />
  </main>
</template>
