<script setup lang="ts">
import { storeToRefs } from 'pinia'
import BoardView from './BoardView.vue'
import MultiGroupListView from './MultiGroupListView.vue'
import type { GroupType } from '~/types'
import { useCurrentListStore } from '~/stores/useCurrentListStore'
import { useLocalListsDataStore } from '~/stores/useLocalListsDataStore'

const { list, isList, isBoard } = storeToRefs(useCurrentListStore())
const { currentListId } = storeToRefs(useLocalListsDataStore())
const { updateList } = useCurrentListStore()

function handleSwitchModeChange(val: boolean) {
  list.value = {
    ...list.value!,
    showingMode: val ? 'board' : 'list',
  }
}
function handleFirstGroupTaskIdsChange(taskIds: number[]) {
  handleGroupsChange([
    {
      ...list.value!.groups[0],
      taskIds,
    },
  ])
}
function handleGroupsChange(groups: GroupType[]) {
  list.value = {
    ...list.value!,
    groups,
  }
}
</script>

<template>
  <main
    class="p-2 h-100vh box-border bg-gray-1 grid gap-2"
    :class="{
      'grid-rows-[auto_auto_1fr]': isList,
      'grid-rows-[auto_1fr]': isBoard,
    }"
  >
    <header class="flex justify-between items-center">
      <div>
        {{ list?.title }}
      </div>
      <div v-if="!list?.disableChangeMode">
        {{ isBoard ? '看板模式' : '清单模式' }}
        <NSwitch :value="isBoard" :on-update-value="handleSwitchModeChange" />
      </div>
    </header>

    <TaskInput v-if="isList" :list-id="currentListId" :group-index="0" @need-update-list="updateList" />

    <template v-if="isList && list?.groups.length === 1">
      <TaskList :list-id="currentListId" :group-index="0" :task-ids="list.groups[0].taskIds" @need-update-list="updateList" @update:task-ids="handleFirstGroupTaskIdsChange" />
    </template>

    <MultiGroupListView v-else-if="isList && list!.groups.length > 1" />

    <BoardView v-else-if="isBoard" />
  </main>
</template>
