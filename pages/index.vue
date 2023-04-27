<script setup lang="ts">
import Draggable from 'vuedraggable'
import { useListMode } from './composables/useListMode'
import type { GroupType, ListType, TaskType } from '~/types'
import { createList } from '~/utils/createType'
import Group from '~/components/Group.vue'
import TaskInput from '~/components/TaskInput.vue'
import TaskList from '~/components/TaskList.vue'

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
</script>

<template>
  <main class="p-2">
    <header>
      {{ isBoard ? '看板模式' : '清单模式' }}
      <NSwitch :value="isBoard" :on-update-value="handleSwitchModeChange" />
    </header>

    <TaskInput v-if="isList" class="my-2" @add-task="handleAddTask" />

    <template v-if="isList && list.groups.length === 1">
      <TaskList v-model:tasks="list.groups[0].tasks" />
    </template>

    <template v-else-if="isBoard">
      <Draggable v-model="list.groups" class="group-container" item-key="index">
        <template #item="{ element, index }">
          <Group :group="element" task-list-group="list-group" @update:group="(val) => handleGroupChange(val, index)" />
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

<style scoped>
.group-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
}
</style>
