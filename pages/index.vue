<script setup lang="ts">
import LeftSider from './components/LeftSider.vue'
import RightPanel from './components/RightPanel.vue'
</script>

<template>
  <NLayout has-sider class="h-100vh">
    <NLayoutSider show-trigger="arrow-circle" bordered collapse-mode="transform" :collapsed-width="10">
      <LeftSider />
    </NLayoutSider>

    <NLayoutContent>
      <RightPanel />
    </NLayoutContent>
  </NLayout>
</template>
