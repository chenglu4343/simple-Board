<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Draggable from 'vuedraggable'
import { useCurrentListStore } from '~/stores/useCurrentListStore'
import type { GroupType } from '~/types'

const { list } = storeToRefs(useCurrentListStore())

const { updateList } = useCurrentListStore()

function handleGroupsChange(groups: GroupType[]) {
  list.value = {
    ...list.value!,
    groups,
  }
}

function handleGroupChange(group: GroupType, index: number) {
  handleGroupsChange([
    ...list.value!.groups.slice(0, index),
    group,
    ...list.value!.groups.slice(index + 1),
  ])
}
function handleAddGroup() {
  handleGroupsChange([
    ...list.value!.groups,
    createGroup(),
  ])
}
function handleInsertLeftGroup(currentIndex: number) {
  handleGroupsChange([
    ...list.value!.groups.slice(0, currentIndex),
    createGroup(),
    ...list.value!.groups.slice(currentIndex),
  ])
}
function handleInsertRightGroup(currentIndex: number) {
  handleGroupsChange([
    ...list.value!.groups.slice(0, currentIndex + 1),
    createGroup(),
    ...list.value!.groups.slice(currentIndex + 1),
  ])
}
function handleDeleteGroup(currentIndex: number) {
  handleGroupsChange([
    ...list.value!.groups.slice(0, currentIndex),
    ...list.value!.groups.slice(currentIndex + 1),
  ])
}
</script>

<template>
  <main class="p-2 h-full box-border bg-gray-1 grid gap-2 grid-rows-[auto_1fr]">
    <header class="flex justify-between items-center">
      <div>
        {{ list?.title }}
      </div>
    </header>

    <Draggable
      v-if="list"
      :model-value="list.groups"
      class="flex items-start gap-2 flex-nowrap overflow-x-scroll scrollbar p-2"
      item-key="uuid"
      @update:model-value="handleGroupsChange"
    >
      <template #item="{ element, index }">
        <Group
          :list-id="list.id!"
          :group-index="index"
          :group="element"
          task-list-group="list-group"
          class="min-w-60 max-w-60"
          @need-update-list="updateList"
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

    <div v-else>
      去新建一个清单吧！
    </div>
  </main>
</template>
