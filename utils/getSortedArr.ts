/**
 * 适用于拖拽排序后获取改变后的数组
 */
export function getSortedArr<T extends { id: number }>(options: {
  /**
   * 原始的数组
   * 不传则与 showingArr 相同
   */
  originArr?: T[]

  /**
   * 展示的用于排序的数组
   */
  showingArr: T[]

  /**
   * 展示的数组被排序过后的数组
   */
  sortedArr: T[]
}): T[] {
  const { showingArr, sortedArr } = options
  const originArr = options.originArr || showingArr

  const idMap = new Map<number, number>()
  showingArr.forEach((item, index) => {
    item.id! !== sortedArr[index].id! && idMap.set(item.id!, sortedArr[index].id!)
  })

  return originArr.map((item) => {
    const replaceId = idMap.get(item.id)
    if (replaceId)
      return originArr.find(item => item.id === replaceId)!

    return item
  })
}
