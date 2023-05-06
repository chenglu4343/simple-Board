<script setup lang="ts">
import { array, number, string } from 'vue-types'
import Draggable from 'vuedraggable'
import { dbService } from '~/dexie/dbService'
import type { TaskType } from '~/types'

const props = defineProps({
  listId: number().isRequired,
  group: string(),
  groupIndex: number().isRequired,
  taskIds: array<number>().def(() => []),
})

const emits = defineEmits<{
  (e: 'update:taskIds', taskIds: number[]): void
  (e: 'needUpdateList'): void
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
      <Task :task="element" :list-id="listId" :group-index="groupIndex" @update:task="updateTaskArr" @need-update-list="emits('needUpdateList')" />
    </template>
  </Draggable>
</template>
