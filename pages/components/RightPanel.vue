<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Draggable from 'vuedraggable'
import { useCurrentBoardStore } from '~/stores/useCurrentBoardStore'
import { useLocalDataStore } from '~/stores/useLocalDataStore'
import type { GroupType } from '~/types'

const mainRef = ref<HTMLElement | null>(null)
const draggableRef = ref<InstanceType<typeof Draggable> | null>(null)
const { isHideCompleted, boardIds } = storeToRefs(useLocalDataStore())
const { board } = storeToRefs(useCurrentBoardStore())
const { addBoard } = useLocalDataStore()
const { updateBoard } = useCurrentBoardStore()
const { pressed } = useClickDrag({
  clickRef: mainRef,
  scrollElement: () => draggableRef.value?.$el,
})

function handleGroupsChange(groups: GroupType[]) {
  board.value = {
    ...board.value!,
    groups,
  }
  pressed.value = false
}

function handleGroupChange(group: GroupType, index: number) {
  handleGroupsChange([
    ...board.value!.groups.slice(0, index),
    group,
    ...board.value!.groups.slice(index + 1),
  ])
}
function handleAddGroup() {
  handleGroupsChange([
    ...board.value!.groups,
    createGroup(),
  ])
}
function handleInsertLeftGroup(currentIndex: number) {
  handleGroupsChange([
    ...board.value!.groups.slice(0, currentIndex),
    createGroup(),
    ...board.value!.groups.slice(currentIndex),
  ])
}
function handleInsertRightGroup(currentIndex: number) {
  handleGroupsChange([
    ...board.value!.groups.slice(0, currentIndex + 1),
    createGroup(),
    ...board.value!.groups.slice(currentIndex + 1),
  ])
}
function handleDeleteGroup(currentIndex: number) {
  handleGroupsChange([
    ...board.value!.groups.slice(0, currentIndex),
    ...board.value!.groups.slice(currentIndex + 1),
  ])
}

function handleClickText() {
  if (boardIds.value.length === 0)
    addBoard()
}
</script>

<template>
  <main
    ref="mainRef" class="p-4 h-full box-border bg-gray-1 grid gap-2 grid-rows-[auto_1fr]"
    :class="{
      'select-none': pressed,
    }"
  >
    <header class="flex justify-between items-center min-w-full">
      <div class="min-w-0 whitespace-nowrap text-ellipsis overflow-x-hidden">
        {{ board?.title }}
      </div>

      <div class="min-w-max flex items-center gap-2">
        <span>隐藏已完成</span>
        <NSwitch v-model:value="isHideCompleted" />
      </div>
    </header>

    <Draggable
      v-if="board"
      ref="draggableRef"
      :model-value="board.groups"
      class="flex items-start gap-2 flex-nowrap overflow-x-scroll scrollbar p-2"
      item-key="uuid"
      @update:model-value="handleGroupsChange"
    >
      <template #item="{ element, index }">
        <Group
          :board-id="board.id!"
          :group-index="index"
          :group="element"
          task-list-group="list-group"
          class="min-w-60 max-w-60"
          @need-update-board="updateBoard"
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

    <div v-else class="h-full text-xl flex font-bold">
      <div class="cursor-pointer m-auto" @click="handleClickText">
        去{{ boardIds.length > 0 ? '选择' : '新建' }}一个看板吧！
      </div>
    </div>
  </main>
</template>
