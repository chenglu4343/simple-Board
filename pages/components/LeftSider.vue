<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { dbService } from '~/dexie/dbService'
import { useCurrentBoardStore } from '~/stores/useCurrentBoardStore'
import { useLocalDataStore } from '~/stores/useLocalDataStore'
import type { BoardType } from '~/types'

const localListDataStore = useLocalDataStore()
const { updateBoard } = useCurrentBoardStore()
const { currentBoardId } = storeToRefs(localListDataStore)

const boardArr = ref<BoardType[]>([])

watchEffect(() => updateTaskArr())

function updateTaskArr() {
  dbService.getBoardsByIds(localListDataStore.boardIds).then((boards) => {
    boardArr.value = boards
  })
}

async function handleUpdateBoard(board: BoardType, index: number) {
  boardArr.value[index] = board
  await dbService.updateBoard(cloneDeep(board))
  if (board.id === currentBoardId.value)
    updateBoard()
}

async function handleDeleteBoard(board: BoardType, index: number) {
  boardArr.value.splice(index, 1)
  await dbService.deleteBoard(board.id!)

  localListDataStore.boardIds = localListDataStore.boardIds.filter(
    id => id !== board.id,
  )
  if (board.id === currentBoardId.value)
    currentBoardId.value = null
}
</script>

<template>
  <div class="h-full p-2 gap-2 box-border grid grid-rows-[auto_1fr]">
    <NButton type="primary" @click="localListDataStore.addBoard">
      新建看板
    </NButton>

    <div class="overflow-y-scroll">
      <BoardItem
        v-for="(board, index) of boardArr"
        :key="board.id!"
        class="mt-2"
        :board="board"
        :is-active="currentBoardId === board.id"
        @update:board="handleUpdateBoard($event, index)"
        @delete-board="handleDeleteBoard(board, index)"
        @click="currentBoardId = board.id!"
      />
    </div>
  </div>
</template>
