import { defineStore, storeToRefs } from 'pinia'
import { cloneDeep } from 'lodash-es'
import { useLocalListsDataStore } from './useLocalListsDataStore'
import type { ListType } from '~/types'
import { dbService } from '~/dexie/dbService'

export const useCurrentListStore = defineStore('current-list', () => {
  const { currentListId: listId } = storeToRefs(useLocalListsDataStore())

  const currentList = ref<ListType | null>(createList())

  watch(() => listId.value, () => {
    updateList()
  }, {
    immediate: true,
  })

  /**
     * 存在同时变更list数据时(例如从一个group拖拽到另外一个group)，
     * 如果采取直接发送给dbService存储再使用updateList更新list数据，第二次变更拿到的并不是第一次变更之后的list数据
     * 因此，变更将新的list直接存到本地副本，等待一个promise之后统一更新到dexie
     */
  const saveListToDexie = usePromiseDoOnce(async () => {
    /** clone，因为groups是reactive数据 */
    await dbService.updateList(cloneDeep(currentList.value!))
  })

  /** dexie中数据已经更改时调用，更新list数据 */
  function updateList() {
    if (listId.value === null) {
      currentList.value = null
      return
    }
    dbService.getListById(listId.value).then((queryList) => {
      currentList.value = queryList!
    })
  }

  return {
    /**
     * !!!必须对list进行整体赋值，否则无法触发set函数保存到dexie中
     * */
    list: computed({
      get: () => currentList.value,
      set: (val) => {
        currentList.value = val
        saveListToDexie()
      },
    }),
    updateList,
  }
})
