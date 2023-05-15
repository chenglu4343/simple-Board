import { cloneDeep } from 'lodash-es'
import type { MaybeRefOrGetter } from '@vueuse/core'
import { toValue } from '@vueuse/core'
import { dbService } from '~/dexie/dbService'
import type { BoardType } from '~/types'

export function useCurrentBoard(boardId: MaybeRefOrGetter<number | null>) {
  const currentBoard = ref<BoardType | null>(createBoard())

  /**
   * 存在同时变更board数据时(例如从一个group拖拽到另外一个group)，
   * 如果采取直接发送给dbService存储再使用updateBoard更新board数据，第二次变更拿到的并不是第一次变更之后的board数据
   * 因此，变更将新的board直接存到本地副本，等待一个promise之后统一更新到dexie
   */
  const saveBoardToDexie = usePromiseDoOnce(async () => {
    /** clone，因为groups是reactive数据 */
    await dbService.updateBoard(cloneDeep(currentBoard.value!))
  })

  /**
   * 对外暴露的board数据，使用computed，可以在set函数中触发保存到dexie
   * !!!必须对board进行整体赋值，否则无法触发set函数保存到dexie中
   * */
  const writeBoard = computed({
    get: () => currentBoard.value,
    set: (val) => {
      currentBoard.value = val
      saveBoardToDexie()
    },
  })

  watch(() => toValue(boardId), () => {
    updateBoard()
  }, {
    immediate: true,
  })

  return {
    currentBoard,
    writeBoard,
    updateBoard,
  }

  /** dexie中数据已经更改时调用，更新board数据 */
  function updateBoard() {
    if (toValue(boardId) === null) {
      currentBoard.value = null
      return
    }
    dbService.getBoardById(toValue(boardId)!).then((queryBoard) => {
      currentBoard.value = queryBoard!
    })
  }
}
