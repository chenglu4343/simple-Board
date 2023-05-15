<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Draggable from 'vuedraggable'
import { useCurrentBoardStore } from '~/stores/useCurrentBoardStore'
import { useLocalDataStore } from '~/stores/useLocalDataStore'

const mainRef = ref<HTMLElement | null>(null)
const draggableRef = ref<InstanceType<typeof Draggable> | null>(null)

const { isHideCompleted, boardIds } = storeToRefs(useLocalDataStore())
const { board, groups } = storeToRefs(useCurrentBoardStore())
const { addBoard } = useLocalDataStore()
const {
  updateBoard,
  addGroup,
  changeGroup,
  insertLeftGroup,
  insertRightGroup,
  deleteGroup,
} = useCurrentBoardStore()

const { pressed } = useClickDrag({
  clickRef: mainRef,
  scrollElement: () => draggableRef.value?.$el,
})

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
      v-model="groups"
      class="flex items-start gap-2 flex-nowrap overflow-x-scroll scrollbar p-2"
      item-key="uuid"
    >
      <template #item="{ element, index }">
        <Group
          :board-id="board.id!"
          :group-index="index"
          :group="element"
          task-list-group="list-group"
          class="min-w-60 max-w-60"
          @need-update-board="updateBoard"
          @update:group="(val) => changeGroup(index, val)"
          @insert-left-group="insertLeftGroup(index)"
          @insert-right-group="insertRightGroup(index)"
          @delete-group="deleteGroup(index)"
        />
      </template>
      <template #footer>
        <NButton type="primary" @click="addGroup">
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
