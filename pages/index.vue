<script setup lang="ts">
import LeftSider from './components/LeftSider.vue'
import RightPanel from './components/RightPanel.vue'
</script>

<template>
  <NLayout has-sider>
    <NLayoutSider show-trigger="arrow-circle" bordered collapse-mode="transform">
      <LeftSider />
    </NLayoutSider>

    <NLayoutContent>
      <RightPanel />
    </NLayoutContent>
  </NLayout>
</template>
