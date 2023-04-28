<script setup lang="ts">
import type { InputInst, InputProps } from 'naive-ui'
import { mergeProps } from 'vue'

const props = withDefaults(defineProps<{
  inputProps?: InputProps
  isEdit?: boolean
  isEnterEndEdit?: boolean
}>(), {
  isEnterEndEdit: true,
})

const emits = defineEmits<{
  (e: 'update:isEdit', val: boolean): void
}>()

defineOptions({
  name: 'FocusInput',
})

const inputRef = ref<InputInst | null>(null)
const computedInputProps = computed(() =>
  mergeProps(props.inputProps || {}, {
    'onBlur': () => emits('update:isEdit', false),
    'onKeyup.enter': () => { props.isEnterEndEdit && emits('update:isEdit', false) },
  }))

watchEffect(() => {
  if (props.isEdit)
    inputRef.value?.focus()
})
</script>

<template>
  <span v-if="!isEdit">{{ inputProps?.value }}</span>
  <NInput
    v-else
    ref="inputRef"
    v-bind="computedInputProps"
    @keyup.enter="computedInputProps['onKeyup.enter']"
  />
</template>
