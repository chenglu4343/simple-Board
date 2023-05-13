<script setup lang="ts">
import { bool } from 'vue-types'

const props = defineProps({
  show: bool(),
})

const emits = defineEmits<{
  (e: 'update:show', val: boolean): void
}>()

const isShowToolPopover = useVModel(props, 'show', emits, {
  passive: true,
})
const toolPopoverX = ref(0)
const toolPopoverY = ref(0)

function handleRightClick(e: MouseEvent) {
  toolPopoverX.value = e.clientX
  toolPopoverY.value = e.clientY
  isShowToolPopover.value = true
}
</script>

<template>
  <div @click.prevent.right="handleRightClick">
    <slot />
  </div>

  <NPopover
    v-model:show="isShowToolPopover"
    trigger="manual"
    :x="toolPopoverX"
    :y="toolPopoverY"
    placement="bottom"
    :theme-overrides="{
      padding: '2px 5px',
    }"
    @clickoutside="isShowToolPopover = false"
  >
    <slot name="popover" />
  </NPopover>
</template>
