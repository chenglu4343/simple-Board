export function useDraggableIsDrag() {
  const isDrag = ref(false)

  return {
    isDrag,
    draggableProps: {
      onStart: () => isDrag.value = true,
      onEnd: () => isDrag.value = false,
    },
  }
}
