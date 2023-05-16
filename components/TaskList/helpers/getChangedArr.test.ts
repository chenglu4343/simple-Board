import { describe, expect, it } from 'vitest'
import { getInsertIndexAndItem, getRemovedId } from './getChangedArr'

describe('getRemovedId', () => {
  it('should getRemoveId', () => {
    const originalArr = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const newArr = [{ id: 1 }, { id: 2 }]
    expect(getRemovedId(originalArr, newArr)).toBe(3)
  })
})

describe('getInsertIndexAndItem', () => {
  it('should getInsertIndexAndItem', () => {
    const originalArr = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const showingArr = [{ id: 1 }, { id: 2 }]
    const newArr = [{ id: 1 }, { id: 4 }, { id: 2 }]

    const { insertIndex, insertItem } = getInsertIndexAndItem(originalArr, showingArr, newArr)
    expect(insertIndex).toBe(1)
    expect(insertItem).toEqual({ id: 4 })
  })
  it('should insert final when insert final', () => {
    const originalArr = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const showingArr = [{ id: 1 }]
    const newArr = [{ id: 1 }, { id: 4 }]

    const { insertIndex, insertItem } = getInsertIndexAndItem(originalArr, showingArr, newArr)
    expect(insertIndex).toBe(3)
    expect(insertItem).toEqual({ id: 4 })
  })
})
