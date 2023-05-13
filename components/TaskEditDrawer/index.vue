<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { defineOptions } from 'unplugin-vue-define-options/macros'
import { bool, object } from 'vue-types'
import { useLocalDataStore } from '~/stores/useLocalDataStore'
import type { TaskType } from '~/types'

const props = defineProps({
  show: bool(),
  task: object<TaskType>().isRequired,
})

const emits = defineEmits<{
  (e: 'update:show', val: boolean): void
  (e: 'update:task', task: TaskType): void
}>()

defineOptions({
  name: 'TaskEditDrawer',
})

const show = useVModel(props, 'show', emits)
const { drawerWidth } = storeToRefs(useLocalDataStore())

const handleUpdateTaskTitle = useUpdateObjKey({
  props,
  emits,
  propsKey: 'task',
  updateKey: 'title',
})
const handleUpdateTaskContent = useUpdateObjKey({
  props,
  emits,
  propsKey: 'task',
  updateKey: 'content',
})
</script>

<template>
  <NDrawer v-model:show="show" v-model:width="drawerWidth" placement="right" resizable>
    <div class="box-border h-full grid grid-rows-[auto_1fr] gap-2 p-4">
      <NInput
        :value="task.title"
        placeholder="输入title"
        @update:value="handleUpdateTaskTitle"
      />
      <NInput
        :value="task.content"
        type="textarea"
        placeholder="输入content"
        @update-value="handleUpdateTaskContent"
      />
    </div>
  </NDrawer>
</template>
