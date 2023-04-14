<script setup lang="ts">
import { NCard } from 'naive-ui'

const msg = ref('Hello World')
</script>

<template>
  <div class="text-red">
    {{ msg }}
  </div>
  <NCard>Hello</NCard>
</template>
