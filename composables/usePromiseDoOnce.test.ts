import { describe, expect, it, vi } from 'vitest'
import { usePromiseDoOnce } from './usePromiseDoOnce'

describe('test usePromiseDoOnce', () => {
  it('call ok', async () => {
    const func = vi.fn()
    const resultFunc = usePromiseDoOnce(func)
    resultFunc()

    await Promise.resolve()
    expect(func).toBeCalledTimes(1)
  })

  it('call only one', async () => {
    const func = vi.fn()
    const resultFunc = usePromiseDoOnce(func)
    resultFunc()
    resultFunc()
    resultFunc()

    await Promise.resolve()
    expect(func).toBeCalledTimes(1)
  })
})
