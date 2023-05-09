<script setup lang="ts">
import { useDialog } from 'naive-ui'
import { number, object, string } from 'vue-types'
import type { OperateOption } from '../IconSelectList'
import type { GroupType } from '~/types'

const props = defineProps({
  listId: number().isRequired,
  groupIndex: number().isRequired,
  group: object<GroupType>().isRequired,
  preset: string<'operate-group'>(),
  taskListGroup: string(),
  collapseItemName: string(),
})

const emits = defineEmits<{
  (e: 'update:group', val: GroupType): void
  (e: 'insertTopGroup'): void
  (e: 'insertBottomGroup'): void
  (e: 'deleteGroup'): void
  (e: 'needUpdateList'): void
}>()

defineOptions({
  name: 'CollapseGroup',
})

const dialog = useDialog()
const isTitleEdit = ref(false)
const isShowOperatePopover = ref(false)
const isShowGroupOperate = computed(() => ['operate-group'].includes(props.preset!))

const handleUpdateGroupTitle = useUpdateObjKey({
  props,
  emits,
  propsKey: 'group',
  updateKey: 'title',
})
const handleUpdateTaskIds = useUpdateObjKey({
  props,
  emits,
  propsKey: 'group',
  updateKey: 'taskIds',
})

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
    icon: 'i-ant-design:insert-row-above-outlined',
    label: '上方添加分组',
    onClick: () => {
      isShowOperatePopover.value = false
      emits('insertTopGroup')
    },
  },
  {
    icon: 'i-ant-design:insert-row-below-outlined',
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
</script>

<template>
  <NCollapseItem :title="group.title" :name="collapseItemName">
    <template #header>
      <FocusInput
        v-model:is-edit="isTitleEdit"
        :input-props="{
          'value': group.title,
          'onUpdate:value': handleUpdateGroupTitle,
        }"
      />
    </template>
    <template #header-extra>
      <template v-if="isShowGroupOperate">
        <PopoverList
          v-model:is-show="isShowOperatePopover"
          :operate-lists="operateLists"
          :handle-icon-click="(e:MouseEvent) => { e.stopPropagation() }"
        />
      </template>
    </template>
    <TaskList
      :list-id="listId"
      :group-index="groupIndex"
      :task-ids="group.taskIds"
      :group="taskListGroup"
      @update:task-ids="handleUpdateTaskIds"
      @need-update-list="emits('needUpdateList')"
    />
  </NCollapseItem>
</template>
