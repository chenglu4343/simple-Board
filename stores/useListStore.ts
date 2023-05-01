import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useListStore = defineStore('listStore', () => {
  const list = useLocalStorage('list-data', createList())

  return {
    list,
    isList: computed(() => list.value.showingMode === 'list'),
    isBoard: computed(() => list.value.showingMode === 'board'),
  }
})
