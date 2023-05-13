<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { storeToRefs } from 'pinia'
import Draggable from 'vuedraggable'
import { dbService } from '~/dexie/dbService'
import { useCurrentBoardStore } from '~/stores/useCurrentBoardStore'
import { useLocalDataStore } from '~/stores/useLocalDataStore'
import type { BoardType } from '~/types'

const { updateBoard } = useCurrentBoardStore()
const { addBoard } = useLocalDataStore()
const { currentBoardId, boardIds } = storeToRefs(useLocalDataStore())

const boardArr = ref<BoardType[]>([])
const boardArrModel = computed({
  get: () => boardArr.value,
  set: (val) => {
    const idMap = new Map<number, number>()
    boardArr.value.forEach((item, index) => {
      idMap.set(item.id!, val[index].id!)
    })

    boardArr.value = boardArr.value.map((item) => {
      const replaceId = idMap.get(item.id!)
      if (replaceId)
        return boardArr.value.find(item => item.id === replaceId)!

      return item
    })
    boardIds.value = boardArr.value.map(item => item.id!)
  },
})

watchEffect(() => updateTaskArr())

function updateTaskArr() {
  dbService.getBoardsByIds(boardIds.value).then((boards) => {
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

  boardIds.value = boardIds.value.filter(
    id => id !== board.id,
  )
  if (board.id === currentBoardId.value)
    currentBoardId.value = null
}
</script>

<template>
  <div class="h-full p-2 gap-2 box-border grid grid-rows-[auto_1fr]">
    <NButton type="primary" @click="addBoard">
      新建看板
    </NButton>

    <Draggable
      v-model="boardArrModel"
      class="overflow-y-scroll"
      item-key="id"
    >
      <template #item="{ element, index }">
        <BoardItem
          class="mt-2"
          :board="element"
          :is-active="currentBoardId === element.id"
          @update:board="handleUpdateBoard($event, index)"
          @delete-board="handleDeleteBoard(element, index)"
          @click="currentBoardId = element.id!"
        />
      </template>
    </Draggable>
  </div>
</template>
