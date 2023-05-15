import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCurrentBoard } from './useCurrentBoard'
import { awaitAll } from '~/utils/awaitAll'
import { dbService } from '~/dexie/dbService'

beforeEach(() => {
  vi.mock('~/dexie/dbService', () => ({
    dbService: {
      updateBoard: vi.fn(),
      getBoardById: (boardId: number) => {
        return Promise.resolve(createBoard(`看板${boardId}`))
      },
    },
  }))

  return () => {
    vi.unmock('~/dexie/dbService')
  }
})

describe('useCurrentBoard', () => {
  it('get board', async () => {
    const boardId = ref(1)
    const { currentBoard } = useCurrentBoard(boardId)
    await awaitAll()

    expect(currentBoard.value?.title).toBe('看板1')

    boardId.value = 2
    await awaitAll()
    expect(currentBoard.value?.title).toBe('看板2')
  })

  it('updateBoard', async () => {
    const boardId = ref(1)
    const { writeBoard } = useCurrentBoard(boardId)
    await awaitAll()

    expect(dbService.updateBoard).toBeCalledTimes(0)

    writeBoard.value = {
      ...writeBoard.value!,
      title: '看板1-1',
    }
    expect(writeBoard.value?.title).toBe('看板1-1')

    const finalBoard = {
      ...writeBoard.value!,
      title: '看板1-2',
    }
    writeBoard.value = finalBoard

    await awaitAll()
    expect(dbService.updateBoard).toBeCalledTimes(1)
    expect(dbService.updateBoard).toBeCalledWith(finalBoard)
  })
})
