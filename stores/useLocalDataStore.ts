import { defineStore } from 'pinia'
import { dbService } from '~/dexie/dbService'

export const useLocalDataStore = defineStore('local-data', () => {
  const listData = useLocalStorage<{
    boardIds: number[]
    currentBoardId: number | null
  }>('lists-data', {
    boardIds: [],
    currentBoardId: null,
  }, {
    listenToStorageChanges: false,
  })
  const isHideCompleted = useLocalStorage<boolean>('isHideCompleted', true)
  const drawerWidth = useLocalStorage<number | undefined>('drawerWidth', undefined)

  const currentBoardId = computed({
    get: () => listData.value.currentBoardId,
    set: (val) => { listData.value.currentBoardId = val },
  })

  const boardIds = computed({
    get: () => listData.value.boardIds,
    set: (val) => { listData.value.boardIds = val },
  })

  function addBoard() {
    dbService.addBoard(createBoard()).then((newBoard) => {
      listData.value.boardIds.push(newBoard.id!)
      currentBoardId.value = newBoard.id!
    })
  }

  return {
    currentBoardId,
    isHideCompleted,
    boardIds,
    drawerWidth,
    addBoard,
  }
})
