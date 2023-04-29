<script setup lang="ts">
import { useDialog } from 'naive-ui'
import type { OperateOption } from '../PopoverList'
import type { GroupType, TaskType } from '~/types'

const props = defineProps<{
  group: GroupType
  preset?: 'operate-group'
  taskListGroup?: string
}>()

const emits = defineEmits<{
  (e: 'update:group', val: GroupType): void
  (e: 'insertTopGroup'): void
  (e: 'insertBottomGroup'): void
  (e: 'deleteGroup'): void
}>()

defineOptions({
  name: 'CollapseGroup',
})

const dialog = useDialog()
const isTitleEdit = ref(false)
const isShowOperatePopover = ref(false)
const isShowGroupOperate = computed(() => ['operate-group'].includes(props.preset!))

const operateLists: OperateOption[] = [
  {
    icon: 'i-ant-design:edit-filled',
    label: '重命名',
    onClick: () => {
      isShowOperatePopover.value = false
      isTitleEdit.value = true
    },
  },
  {
    icon: 'i-ant-design:insert-row-left-outlined',
    label: '上方添加分组',
    onClick: () => {
      isShowOperatePopover.value = false
      emits('insertTopGroup')
    },
  },
  {
    icon: 'i-ant-design:insert-row-right-outlined',
    label: '下方添加分组',
    onClick: () => {
      isShowOperatePopover.value = false
      emits('insertBottomGroup')
    },
  },
  {
    icon: 'i-ant-design:delete-filled',
    label: '删除',
    onClick: () => {
      dialog.warning({
        title: '警告',
        content: '你确定？',
        positiveText: '确定',
        negativeText: '不确定',
        onPositiveClick: () => {
          emits('deleteGroup')
        },
      })
    },
  },
]

function handleUpdateTask(tasks: TaskType[]) {
  emits('update:group', {
    ...props.group,
    tasks,
  })
}

function handleUpdateGroupTitle(val: string) {
  emits('update:group', {
    ...props.group,
    title: val,
  })
}
</script>

<template>
  <NCollapseItem :title="group.title">
    <template #header>
      <FocusInput
        v-model:is-edit="isTitleEdit" :input-props="{
          'value': group.title,
          'onUpdate:value': handleUpdateGroupTitle,
        }"
      />
    </template>
    <template #header-extra>
      <template v-if="isShowGroupOperate">
        <PopoverList v-model:is-show="isShowOperatePopover" :operate-lists="operateLists" />
      </template>
    </template>
    <TaskList :tasks="group.tasks" :group="taskListGroup" @update:tasks="handleUpdateTask" />
  </NCollapseItem>
</template>
