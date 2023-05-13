import { defineStore } from 'pinia'
import { dbService } from '~/dexie/dbService'

export const useLocalListsDataStore = defineStore('local-lists-data', () => {
  const listData = useLocalStorage<{
    listIds: number[]
    currentListId: number | null
  }>('lists-data', {
    listIds: [],
    currentListId: null,
  })

  const currentListId = computed({
    get: () => listData.value.currentListId,
    set: (val) => { listData.value.currentListId = val },
  })

  const listIds = computed({
    get: () => listData.value.listIds,
    set: (val) => { listData.value.listIds = val },
  })

  function addList() {
    dbService.addList(createList()).then((newList) => {
      listData.value.listIds.push(newList.id!)
    })
  }

  return {
    currentListId,
    listIds,
    addList,
  }
})
