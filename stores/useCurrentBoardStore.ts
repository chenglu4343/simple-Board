import { defineStore, storeToRefs } from 'pinia'
import { useLocalDataStore } from './useLocalDataStore'
import { useGroupsChange } from './helpers/useGroupsChange'
import { useCurrentBoard } from './helpers/useCurrentBoard'

export const useCurrentBoardStore = defineStore('current-board', () => {
  const { currentBoardId } = storeToRefs(useLocalDataStore())
  const { writeBoard, currentBoard, updateBoard } = useCurrentBoard(currentBoardId)

  /**
   * 对外暴露的groups数据，使用computed，可以在set函数中触发保存到board中
   */
  const groups = computed({
    get: () => currentBoard.value?.groups || [],
    set: (val) => {
      writeBoard.value = {
        ...writeBoard.value!,
        groups: val,
      }
    },
  })

  return {
    board: writeBoard,
    groups,
    updateBoard,
    ...useGroupsChange(groups),
  }
})
