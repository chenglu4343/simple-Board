<script setup lang="ts">
import Draggable from 'vuedraggable'
import { storeToRefs } from 'pinia'
import { useGroupsChange } from '../composables/useGroupsChange'
import BoardView from './BoardView.vue'
import type { GroupType } from '~/types'
import { useCurrentListStore } from '~/stores/useCurrentListStore'
import { useLocalListsDataStore } from '~/stores/useLocalListsDataStore'

const { list, isList, isBoard } = storeToRefs(useCurrentListStore())
const { currentListId } = storeToRefs(useLocalListsDataStore())
const { updateList } = useCurrentListStore()

const {
  getGroupsChange,
  getGroupsInsertLeft,
  getGroupsInsertRight,
  getGroupsDelete,
} = useGroupsChange(computed(() => list.value.groups ?? []))

function handleSwitchModeChange(val: boolean) {
  list.value = {
    ...list.value!,
    showingMode: val ? 'board' : 'list',
  }
}
function handleGroupChange(group: GroupType, index: number) {
  handleGroupsChange(getGroupsChange(group, index))
}
function handleInsertTopGroup(currentIndex: number) {
  handleGroupsChange(getGroupsInsertLeft(currentIndex))
}
function handleInsertBottomGroup(currentIndex: number) {
  handleGroupsChange(getGroupsInsertRight(currentIndex))
}
function handleDeleteGroup(currentIndex: number) {
  handleGroupsChange(getGroupsDelete(currentIndex))
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

    <template v-else-if="isList && list!.groups.length > 1">
      <Draggable
        :model-value="list!.groups"
        class="overflow-y-scroll"
        item-key="index"
        tag="n-collapse"
        :component-data="{
          themeOverrides: {
            dividerColor: '#6B6B77FF',
          },
          defaultExpandedNames: list!.groups.map((item, index) => `${index}-${item.title}`),
        }"
        @update:model-value="handleGroupsChange"
      >
        <template #item="{ element, index }">
          <CollapseGroup
            :list-id="currentListId"
            :group-index="index"
            :group="element" preset="operate-group" task-list-group="collaspe-group"
            :collapse-item-name="`${index}-${element.title}`"
            @update:group="(val) => handleGroupChange(val, index)"
            @insert-top-group="handleInsertTopGroup(index)"
            @insert-bottom-group="handleInsertBottomGroup(index)"
            @delete-group="handleDeleteGroup(index)"
            @need-update-list="updateList"
          />
        </template>
      </Draggable>
    </template>

    <BoardView v-else-if="isBoard" />
  </main>
</template>
