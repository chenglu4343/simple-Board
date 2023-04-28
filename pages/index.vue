<script setup lang="ts">
import Draggable from 'vuedraggable'
import { useListMode } from './composables/useListMode'
import type { GroupType, ListType, TaskType } from '~/types'
import { createList } from '~/utils/createType'
import Group from '~/components/Group'
import TaskInput from '~/components/TaskInput'
import TaskList from '~/components/TaskList'

const { isBoard, isList, handleSwitchModeChange } = useListMode()

const list = ref<ListType>(createList())

function handleAddGroup() {
  list.value.groups.push(createGroup())
}

function handleGroupChange(group: GroupType, index: number) {
  list.value.groups[index] = group
}

function handleAddTask(task: TaskType) {
  addTask2List(list.value, task)
}

function handleInsertLeftGroup(currentIndex: number) {
  list.value.groups.splice(currentIndex, 0, createGroup())
}

function handleInsertRightGroup(currentIndex: number) {
  list.value.groups.splice(currentIndex + 1, 0, createGroup())
}
</script>

<template>
  <main
    class="p-2 h-100vh box-border bg-gray-1 grid gap-2" :class="{
      'grid-rows-[auto_auto_1fr]': isList,
      'grid-rows-[auto_1fr]': isBoard,
    }"
  >
    <header>
      {{ isBoard ? '看板模式' : '清单模式' }}
      <NSwitch :value="isBoard" :on-update-value="handleSwitchModeChange" />
    </header>

    <TaskInput v-if="isList" @add-task="handleAddTask" />

    <template v-if="isList && list.groups.length === 1">
      <TaskList v-model:tasks="list.groups[0].tasks" />
    </template>

    <template v-else-if="isBoard">
      <Draggable
        v-model="list.groups"
        class="flex items-start gap-2 flex-nowrap overflow-x-scroll scrollbar"
        item-key="index"
      >
        <template #item="{ element, index }">
          <Group
            :group="element"
            task-list-group="list-group"
            class="min-w-60 max-w-60"
            @update:group="(val) => handleGroupChange(val, index)"
            @insert-left-group="handleInsertLeftGroup(index)"
            @insert-right-group="handleInsertRightGroup(index)"
          />
        </template>
        <template #footer>
          <NButton type="primary" @click="handleAddGroup">
            添加分组
          </NButton>
        </template>
      </Draggable>
    </template>
  </main>
</template>
