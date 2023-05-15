import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { useGroupsChange } from './useGroupsChange'
import type { GroupType } from '~/types'
import { createGroup } from '~/utils/createType'

function useGroups(getValue: GroupType[] = []) {
  const innerValue = ref(getValue)
  const groups = computed({
    get: () => innerValue.value,
    set: (value) => {
      innerValue.value = value
    },
  })

  return {
    groups,
    innerValue,
  }
}

beforeAll(() => {
  vi.stubGlobal('createGroup', createGroup)
})

afterAll(() => {
  vi.unstubAllGlobals()
})

describe('useGroupsChange', () => {
  it('should add group', () => {
    const { groups } = useGroups([createGroup('分组一')])
    const { addGroup } = useGroupsChange(groups)
    addGroup()

    expect(groups.value.length).toBe(2)
    expect(groups.value[0].title).toBe('分组一')
  })

  it('should insert left group', () => {
    const { groups } = useGroups([createGroup('分组一'), createGroup('分组二')])
    const { insertLeftGroup } = useGroupsChange(groups)
    insertLeftGroup(1)

    expect(groups.value.length).toBe(3)
    expect(groups.value[0].title).toBe('分组一')
    expect(groups.value[2].title).toBe('分组二')
  })

  it('should insert right group', () => {
    const { groups } = useGroups([createGroup('分组一'), createGroup('分组二')])
    const { insertRightGroup } = useGroupsChange(groups)
    insertRightGroup(0)

    expect(groups.value.length).toBe(3)
    expect(groups.value[0].title).toBe('分组一')
    expect(groups.value[2].title).toBe('分组二')
  })

  it('should delete group', () => {
    const { groups } = useGroups([createGroup('分组一'), createGroup('分组二')])
    const { deleteGroup } = useGroupsChange(groups)
    deleteGroup(0)

    expect(groups.value.length).toBe(1)
    expect(groups.value[0].title).toBe('分组二')
  })

  it('should change group', () => {
    const { groups } = useGroups([createGroup('分组一'), createGroup('分组二')])
    const { changeGroup } = useGroupsChange(groups)
    changeGroup(0, createGroup('分组三'))

    expect(groups.value.length).toBe(2)
    expect(groups.value[0].title).toBe('分组三')
  })
})
