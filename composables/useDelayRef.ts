export interface useDelayRefOption<T> {
  delay?: number
  isDelay?: (val: T) => boolean
}

export function useDelayRef<T>(source: Ref<T>, options?: useDelayRefOption<T>) {
  const { delay = 100, isDelay = () => true } = options || {}
  let preTimer: NodeJS.Timeout | null = null

  return computed({
    get: () => source.value,
    set: (val) => {
      if (preTimer) {
        clearTimeout(preTimer)
        preTimer = null
      }

      if (isDelay(val)) {
        preTimer = setTimeout(() => {
          source.value = val
          preTimer = null
        }, delay)
      }
      else {
        source.value = val
      }
    },
  })
}
