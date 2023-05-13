<script setup lang="ts">
import { bool, number, object } from 'vue-types'
import { dbService } from '~/dexie/dbService'
import type { TaskType } from '~/types'

const props = defineProps({
  boardId: number().isRequired,
  groupIndex: number().isRequired,
  task: object<TaskType>().isRequired,
  isDrag: bool(),
})

const emits = defineEmits<{
  (e: 'update:task', task: TaskType): void
  (e: 'needUpdateBoard'): void
}>()

defineOptions({
  name: 'Task',
})

const isShowEditDrawer = ref(false)

async function handleUpdateTask(newTask: TaskType) {
  await dbService.updateTask(newTask)
  emits('update:task', newTask)
}

async function handleTaskStatusChange(val: boolean) {
  const newTask: TaskType = {
    ...props.task,
    status: val ? 'done' : 'todo',
  }
  await handleUpdateTask(newTask)
}

function handleEditTask() {
  isShowEditDrawer.value = true
}

async function handleDeleteTask() {
  await dbService.deleteTask(props.boardId, props.groupIndex, props.task.id!)
  emits('needUpdateBoard')
}
</script>

<template>
  <div>
    <RightClickManualPopover>
      <template #default>
        <div
          class="cursor-pointer grid grid-cols-[auto_1fr] gap-2  p-2 rounded-2 min-w-0 overflow-x-hidden"
          :class="!isDrag && 'hover:bg-gray-3'"
          @click="handleEditTask"
        >
          <NCheckbox
            :checked="task.status === 'done'"
            @update:checked="handleTaskStatusChange"
            @click.stop="() => {}"
          />

          <div class="whitespace-nowrap text-ellipsis overflow-x-hidden">
            {{ task.title }}
          </div>
        </div>
      </template>
      <template #popover>
        <div class="flex gap-2 p-2 items-center cursor-pointer" @click="handleDeleteTask">
          <div class="i-ant-design:delete-filled" />
          <span>删除</span>
        </div>
      </template>
    </RightClickManualPopover>

    <TaskEditDrawer v-model:show="isShowEditDrawer" :task="task" @update:task="handleUpdateTask" />
  </div>
</template>
