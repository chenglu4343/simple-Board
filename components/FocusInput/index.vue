<script setup lang="ts">
import type { InputInst, InputProps } from 'naive-ui'

const props = defineProps<{
  inputProps?: InputProps
  isEdit?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:isEdit', val: boolean): void
}>()

defineOptions({
  name: 'FocusInput',
})

const inputRef = ref<InputInst | null>(null)

function handleBlur() {
  emits('update:isEdit', false)
}

watchEffect(() => {
  if (props.isEdit)
    inputRef.value?.focus()
})
</script>

<template>
  <span v-if="!isEdit">{{ inputProps?.value }}</span>
  <NInput v-else ref="inputRef" v-bind="{ ...inputProps }" @blur="handleBlur" />
</template>
