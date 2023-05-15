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
const { draggableProps, isDrag } = useDraggableIsDrag()

defineOptions({
  name: 'TaskList',
})

const tasksArr = ref<TaskType[]>([])
const taskArrModel = computed({
  get: () => {
    return isHideCompleted.value ? tasksArr.value.filter(item => item.status !== 'done') : tasksArr.value
  },
  set: (val) => {
    /** 1.进行了list内部的操作 */
    if (val.length === taskArrModel.value.length) {
      tasksArr.value = getSortedArr<Required<TaskType>>({
        originArr: tasksArr.value as any,
        sortedArr: val as any,
        showingArr: taskArrModel.value as any,
      })
    }
    /** 其他task移动进入了当前lists */
    else if (val.length > taskArrModel.value.length) {
      const newItemIndex = val.findIndex(item => !taskArrModel.value.find(item2 => item2.id === item.id))
      if (newItemIndex === taskArrModel.value.length) {
        tasksArr.value.push(val[newItemIndex])
      }
      else {
        const insertIndex = tasksArr.value.findIndex(item => item.id === taskArrModel.value[newItemIndex].id!)
        tasksArr.value.splice(insertIndex, 0, val[newItemIndex])
      }
    }
    /** 当前task被移除 */
    else if (val.length < taskArrModel.value.length) {
      const removeId = taskArrModel.value.find(item => val.every(valItem => valItem.id !== item.id!))!.id!
      tasksArr.value = tasksArr.value.filter(item => item.id !== removeId)
    }
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
    ghost-class="ghost-class"
    v-bind="draggableProps"
  >
    <template #item="{ element }">
      <Task
        :is-drag="isDrag"
        :task="element"
        :board-id="boardId"
        :group-index="groupIndex"
        @update:task="updateTaskArr"
        @need-update-board="emits('needUpdateBoard')"
      />
    </template>
  </Draggable>
</template>
