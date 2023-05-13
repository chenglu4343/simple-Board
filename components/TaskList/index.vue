<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { array, number, string } from 'vue-types'
import Draggable from 'vuedraggable'
import { dbService } from '~/dexie/dbService'
import { useLocalDataStore } from '~/stores/useLocalDataStore'
import type { TaskType } from '~/types'

const props = defineProps({
  boardId: number().isRequired,
  group: string(),
  groupIndex: number().isRequired,
  taskIds: array<number>().def(() => []),
})

const emits = defineEmits<{
  (e: 'update:taskIds', taskIds: number[]): void
  (e: 'needUpdateBoard'): void
}>()

const { isHideCompleted } = storeToRefs(useLocalDataStore())

defineOptions({
  name: 'TaskList',
})

const tasksArr = ref<TaskType[]>([])
const taskArrModel = computed({
  get: () => {
    return isHideCompleted.value ? tasksArr.value.filter(item => item.status !== 'done') : tasksArr.value
  },
  set: (val) => {
    const idMap = new Map<number, number>()
    taskArrModel.value.forEach((item, index) => {
      idMap.set(item.id!, val[index].id!)
    })

    tasksArr.value = tasksArr.value.map((item) => {
      const replaceId = idMap.get(item.id!)
      if (replaceId)
        return tasksArr.value.find(item => item.id === replaceId)!

      return item
    })

    emits('update:taskIds', tasksArr.value.map(item => item.id!))
  },
})

watchEffect(() => updateTaskArr())

function updateTaskArr() {
  dbService.getTasksByIds(props.taskIds).then((tasks) => {
    tasksArr.value = tasks
  })
}
</script>

<template>
  <Draggable
    v-model="taskArrModel"
    item-key="id"
    :group="group"
  >
    <template #item="{ element }">
      <Task
        :task="element"
        :board-id="boardId"
        :group-index="groupIndex"
        @update:task="updateTaskArr"
        @need-update-board="emits('needUpdateBoard')"
      />
    </template>
  </Draggable>
</template>
