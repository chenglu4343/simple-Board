export function useDraggableIsDrag() {
  /** isDrag直接结束有闪烁效果 */
  const isDrag = useDelayRef(ref(false), { delay: 100 })

  return {
    isDrag,
    draggableProps: {
      onStart: () => {
        isDrag.value = true
      },
      onEnd: () => {
        /** @hack 拖拽结束时会使拖拽元素的起始位置处于hover状态，强制取消 */
        document.body.click()
        isDrag.value = false
      },
    },
  }
}
