export function useListMode() {
  const mode = ref<'list' | 'board'>('list')
  const isList = computed(() => mode.value === 'list')
  const isBoard = computed(() => mode.value === 'board')

  const handleSwitchModeChange = (val: boolean) => {
    mode.value = val ? 'board' : 'list'
  }

  return {
    mode,
    isList,
    isBoard,
    handleSwitchModeChange,
  }
}
