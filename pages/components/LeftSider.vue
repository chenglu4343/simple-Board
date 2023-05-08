<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { dbService } from '~/dexie/dbService'
import { useLocalListsDataStore } from '~/stores/useLocalListsDataStore'
import type { ListType } from '~/types'

const localListDataStore = useLocalListsDataStore()
const { currentListId } = storeToRefs(localListDataStore)

const listArr = ref<ListType[]>([])

watchEffect(() => updateTaskArr())

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

    <div
      class="p-2 cursor-pointer"
      :class="{
        'text-blue-500': currentListId === -1,
      }"
      @click="currentListId = -1"
    >
      收集箱
    </div>

    <hr v-if="listArr.length > 0">

    <div
      v-for="list of listArr"
      :key="list.id!"
      class="p-2 cursor-pointer"
      :class="{
        'text-blue-500': currentListId === list.id,
      }"
      @click="currentListId = list.id!"
    >
      {{ list.title }}
    </div>
  </div>
</template>
