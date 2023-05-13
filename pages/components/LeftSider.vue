<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { dbService } from '~/dexie/dbService'
import { useLocalDataStore } from '~/stores/useLocalDataStore'
import type { ListType } from '~/types'

const localListDataStore = useLocalDataStore()
const { currentListId } = storeToRefs(localListDataStore)

const collectionList = ref(createList())
const listArr = ref<ListType[]>([])

watchEffect(() => updateTaskArr())
dbService.getListById(-1).then((list) => {
  collectionList.value = list!
})

function updateTaskArr() {
  dbService.getListsByIds(localListDataStore.listIds).then((lists) => {
    listArr.value = lists
  })
}
</script>

<template>
  <div class="h-full p-2 gap-2 box-border grid grid-rows-[auto_1fr]">
    <NButton type="primary" @click="localListDataStore.addList">
      新建看板
    </NButton>

    <div class="overflow-y-scroll">
      <BoardItem
        v-for="list of listArr"
        :key="list.id!"
        class="mt-2"
        :list="list"
        :is-active="currentListId === list.id"
        @click="currentListId = list.id!"
      />
    </div>
  </div>
</template>
