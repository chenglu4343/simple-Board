<script setup lang="ts">
import LeftSider from './components/LeftSider.vue'
import RightPanel from './components/RightPanel.vue'
import { dbService } from '~/dexie/dbService'

const listData = useLocalStorage<{
  listIds: number[]
  currentListId: number
}>('listData', {
  listIds: [],
  currentListId: -1,
})

function handleAddList() {
  dbService.addList(createList()).then((newList) => {
    listData.value.listIds.push(newList.id!)
  })
}
</script>

<template>
  <NLayout has-sider>
    <NLayoutSider show-trigger="arrow-circle" bordered collapse-mode="transform">
      <LeftSider
        v-model:currentListId="listData.currentListId"
        :list-ids="listData.listIds"
        @add-list="handleAddList"
      />
    </NLayoutSider>

    <NLayoutContent>
      <RightPanel :list-id="listData.currentListId" />
    </NLayoutContent>
  </NLayout>
</template>
