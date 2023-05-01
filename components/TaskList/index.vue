<script setup lang="ts">
import { array, string } from 'vue-types'
import Draggable from 'vuedraggable'
import { dbService } from '~/dexie/dbService'
import type { TaskType } from '~/types'

const props = defineProps({
  group: string(),
  taskIds: array<number>().def(() => []),
})

const emits = defineEmits<{
  (e: 'update:taskIds', taskIds: number[]): void
}>()

defineOptions({
  name: 'TaskList',
})

const tasksArr = ref<TaskType[]>([])

watchEffect(() => updateTaskArr())

function updateTaskArr() {
  dbService.getTasksByIds(props.taskIds).then((tasks) => {
    tasksArr.value = tasks
  })
}
</script>

<template>
  <Draggable
    :model-value="tasksArr"
    item-key="id"
    :group="group"
    @update:model-value="(val:TaskType[]) => emits('update:taskIds', val.map(item => item.id!))"
  >
    <template #item="{ element }">
      <Task :task="element" @update:task="updateTaskArr" />
    </template>
  </Draggable>
</template>
