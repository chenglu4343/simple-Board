<script setup lang="ts">
import LeftSider from './components/LeftSider.vue'
import RightPanel from './components/RightPanel.vue'
import { useLocalListsDataStore } from '~/stores/useLocalListsDataStore'

const localListDataStore = useLocalListsDataStore()
</script>

<template>
  <NLayout has-sider>
    <NLayoutSider show-trigger="arrow-circle" bordered collapse-mode="transform">
      <LeftSider />
    </NLayoutSider>

    <NLayoutContent>
      <RightPanel :list-id="localListDataStore.currentListId" />
    </NLayoutContent>
  </NLayout>
</template>
