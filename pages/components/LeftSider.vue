<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { dbService } from '~/dexie/dbService'
import { useLocalListsDataStore } from '~/stores/useLocalListsDataStore'
import type { ListType } from '~/types'

const localListDataStore = useLocalListsDataStore()
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
  <div class="h-full p-2 box-border">
    <NButton type="primary" @click="localListDataStore.addList">
      新建清单
    </NButton>

    <ListItem
      class="mt-2"
      :list="collectionList"
      :is-active="currentListId === -1"
      @click="currentListId = -1"
    />

    <hr v-if="listArr.length > 0">

    <ListItem
      v-for="list of listArr"
      :key="list.id!"
      class="mt-2"
      :list="list"
      :is-active="currentListId === list.id"
      @click="currentListId = list.id!"
    />
  </div>
</template>
