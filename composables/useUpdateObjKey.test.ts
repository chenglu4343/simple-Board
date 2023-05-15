import { describe, expect, it, vi } from 'vitest'

describe('useUpdateObjKey', () => {
  it('should update props', () => {
    const emits = vi.fn()
    const updateObjKey = useUpdateObjKey({
      props: {
        obj: { name: 'foo', other: { abc: 123 } },
      },
      propsKey: 'obj',
      updateKey: 'name',
      emits,
    })

    updateObjKey('bar')

    expect(emits).toHaveBeenCalledWith('update:obj', {
      name: 'bar',
      other: { abc: 123 },
    })
  })
})
