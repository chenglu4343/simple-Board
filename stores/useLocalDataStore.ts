import { defineStore } from 'pinia'
import { dbService } from '~/dexie/dbService'

export const useLocalDataStore = defineStore('local-data', () => {
  const listData = useLocalStorage<{
    boardIds: number[]
    currentBoardId: number | null
  }>('lists-data', {
    boardIds: [],
    currentBoardId: null,
  })
  const isHideCompleted = useLocalStorage<boolean>('isHideCompleted', true)

  const currentBoardId = computed({
    get: () => listData.value.currentBoardId,
    set: (val) => { listData.value.currentBoardId = val },
  })

  const boardIds = computed({
    get: () => listData.value.boardIds,
    set: (val) => { listData.value.boardIds = val },
  })

  function addBoard() {
    dbService.addBoard(createList()).then((newBoard) => {
      listData.value.boardIds.push(newBoard.id!)
    })
  }

  return {
    currentBoardId,
    isHideCompleted,
    boardIds,
    addBoard,
  }
})
