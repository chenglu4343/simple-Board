<script setup lang="ts">
import { object } from 'vue-types'
import { dbService } from '~/dexie/dbService'
import type { TaskType } from '~/types'

const props = defineProps({
  task: object<TaskType>().isRequired,
})

const emits = defineEmits<{
  (e: 'update:task', task: TaskType): void
}>()

defineOptions({
  name: 'Task',
})

const isShowEditDrawer = ref(false)
const isShowToolPopover = ref(false)
const toolPopoverX = ref(0)
const toolPopoverY = ref(0)

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

function handleRightClickTitle(e: MouseEvent) {
  toolPopoverX.value = e.clientX
  toolPopoverY.value = e.clientY
  isShowToolPopover.value = true
}

function handleDeleteTask() {
  // TODO:list的数据存储做好后再做
}
</script>

<template>
  <div class="cursor-pointer grid grid-cols-[auto_1fr] gap-2" @click="handleEditTask">
    <NCheckbox
      :checked="task.status === 'done'"
      @update:checked="handleTaskStatusChange"
      @click.stop="() => {}"
    />

    <span @click.prevent.right="handleRightClickTitle">
      {{ task.title }}
    </span>

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
      <div class="flex gap-2 p-2 items-center cursor-pointer" @click="handleDeleteTask">
        <div class="i-ant-design:delete-filled" />
        <span>删除</span>
      </div>
    </NPopover>

    <TaskEditDrawer v-model:show="isShowEditDrawer" :task="task" @update:task="handleUpdateTask" />
  </div>
</template>
