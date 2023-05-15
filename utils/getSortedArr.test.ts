import { describe, expect, it } from 'vitest'

function createIdItem(id: number) {
  return {
    id,
  }
}

describe('getSortedArr', () => {
  const showingArr = [
    createIdItem(1),
    createIdItem(2),
  ]
  const sortedArr = [
    createIdItem(2),
    createIdItem(1),
  ]

  it('move ok', () => {
    const finalArr = getSortedArr({
      showingArr,
      sortedArr,
    })

    expect(finalArr).toEqual(sortedArr)
  })

  it('move ok in hide', () => {
    const finalArr = getSortedArr({
      originArr: [
        createIdItem(3),
        createIdItem(1),
        createIdItem(4),
        createIdItem(2),
        createIdItem(5),
      ],
      showingArr,
      sortedArr,
    })

    expect(finalArr).toEqual([
      createIdItem(3),
      createIdItem(2),
      createIdItem(4),
      createIdItem(1),
      createIdItem(5),
    ])
  })
})
