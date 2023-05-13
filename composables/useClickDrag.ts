import type { MaybeRefOrGetter } from '@vueuse/core'
import { toValue } from '@vueuse/core'

/**
 * 实现点击空白处拖拽滚动条功能
 */
export function useClickDrag(options: {
  /** 点击区域 */
  clickRef?: Ref<HTMLElement | null | undefined>

  /** 滚动区域 */
  scrollElement: MaybeRefOrGetter<HTMLElement | undefined>
}) {
  const { clickRef, scrollElement } = options

  const { pressed } = useMousePressed({
    target: clickRef,
    touch: false,
  })
  const { x } = useMouse({
    target: clickRef,
    touch: false,
  })

  const recordX = ref(0)
  const recordScrollLeft = ref(0)

  const { resume, pause } = watchPausable(() => x.value, () => {
    if (pressed.value) {
      toValue(scrollElement)!.scroll({
        left: recordScrollLeft.value + (x.value - recordX.value) * 2,
      })
    }
  })

  watch(() => pressed.value, (val) => {
    if (val) {
      recordX.value = x.value
      recordScrollLeft.value = toValue(scrollElement)!.scrollLeft
      resume()
    }
    else {
      pause()
    }
  }, {
    immediate: true,
  })

  return {
    pressed,
  }
}
