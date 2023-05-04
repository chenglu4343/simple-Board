<script setup lang="ts">
import Draggable from 'vuedraggable'
import { storeToRefs } from 'pinia'
import type { GroupType, TaskType } from '~/types'
import { useListStore } from '~/stores/useListStore'

const { list, isBoard, isList } = storeToRefs(useListStore())

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

function handleDeleteGroup(currentIndex: number) {
  list.value.groups.splice(currentIndex, 1)
}

function handleSwitchModeChange(val: boolean) {
  list.value.showingMode = val ? 'board' : 'list'
}
</script>

<template>
  <NLayout has-sider>
    <NLayoutSider show-trigger="arrow-circle" bordered collapse-mode="transform">
      这是个清单列表
    </NLayoutSider>

    <NLayoutContent>
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
          <TaskList v-model:task-ids="list.groups[0].taskIds" />
        </template>

        <template v-else-if="isList && list.groups.length > 1">
          <Draggable
            v-model="list.groups"
            class="overflow-y-scroll"
            item-key="index" tag="n-collapse"
            :component-data="{
              themeOverrides: {
                dividerColor: '#6B6B77FF',
              },
              defaultExpandedNames: list.groups.map((item, index) => `${index}-${item.title}`),
            }"
          >
            <template #item="{ element, index }">
              <CollapseGroup
                :group="element"
                preset="operate-group"
                task-list-group="collaspe-group"
                :collapse-item-name="`${index}-${element.title}`"
                @update:group="(val) => handleGroupChange(val, index)"
                @insert-top-group="handleInsertLeftGroup(index)"
                @insert-bottom-group="handleInsertRightGroup(index)"
                @delete-group="handleDeleteGroup(index)"
              />
            </template>
          </Draggable>
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
                @delete-group="handleDeleteGroup(index)"
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
    </NLayoutContent>
  </NLayout>
</template>
