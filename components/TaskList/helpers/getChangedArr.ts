export function getRemovedId<T extends { id: number }>(originalArr: T[], newArr: T[]) {
  return originalArr.find(originItem =>
    newArr.every(item => item.id !== originItem.id))!.id
}

/**
 *
 * @param originalArr 初始的数组
 * @param showingArr 过滤后展示的数组
 * @param newArr 展示的数组被插入了一个新的元素后的数组
 * @returns insertIndex,insertItem
 */
export function getInsertIndexAndItem<T extends { id: number }>(originalArr: T[], showingArr: T[], newArr: T[]) {
  /** 插入的元素在newArr中的索引 */
  const newItemIndex = newArr.findIndex(newItem =>
    showingArr.every(showingItem => showingItem.id !== newItem.id))
  const insertItem = newArr[newItemIndex]

  /** newArr.length == showingArr.length+1 */
  if (newItemIndex === showingArr.length) {
    return {
      insertIndex: originalArr.length,
      insertItem,
    }
  }
  else {
    /**
     * 新的元素插入在showingArr的newItemIndex位置
     * 在originalArr中找到被showingArr插入的元素的位置作为insertIndex
     */
    const insertIndex = originalArr.findIndex(originItem => originItem.id === showingArr[newItemIndex].id)
    return {
      insertIndex,
      insertItem,
    }
  }
}
