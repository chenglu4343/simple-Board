import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDelayRef } from './useDelayRef'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useDelayRef', () => {
  it('change delay', () => {
    const refVal = useDelayRef(ref(false), { delay: 100 })
    expect(refVal.value).toBe(false)
    refVal.value = true
    expect(refVal.value).toBe(false)
    vi.runAllTimers()
    expect(refVal.value).toBe(true)
  })

  it('change latest', () => {
    const refVal = useDelayRef(ref(1), { delay: 100 })
    refVal.value = 2
    refVal.value = 3
    expect(refVal.value).toBe(1)
    vi.runAllTimers()
    expect(refVal.value).toBe(3)
  })
})
