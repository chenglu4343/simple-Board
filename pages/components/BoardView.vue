<!-- 看板视图 -->
<script setup lang="ts">
import { object } from 'vue-types'
import Draggable from 'vuedraggable'
import { cloneDeep } from 'lodash-es'
import { useGroupsChange } from '../composables/useGroupsChange'
import type { GroupType, ListType } from '~/types'

const props = defineProps({
  list: object<ListType>().isRequired,
})

const emits = defineEmits<{
  (e: 'needUpdateList'): void
  (e: 'update:list', newList: ListType): void
}>()

/**
 * 存在同时变更list数据时(例如从一个group拖拽到另外一个group)，第二次变更拿到的并不是第一次变更之后的list数据
 * 虽然在父组件RightPanel中做了本地副本处理，但是第一emit变更后props上的list并没有更新，也许vue的props值更新要在事件触发完毕之后？
 * 还是想拆分出一个单独的文件来维护BoardView，所以还是需要一个本地的list副本
 * */
const localList = ref(props.list)

const {
  getGroupsChange,
  getGroupsAdd,
  getGroupsInsertLeft,
  getGroupsInsertRight,
  getGroupsDelete,
} = useGroupsChange(computed(() => localList.value.groups))

watchEffect(() => {
  localList.value = cloneDeep(props.list)
})

function changeLocalListAndEmit(newList: ListType) {
  localList.value = newList
  emits('update:list', localList.value)
}

function changeGroupsAndEmit(groups: GroupType[]) {
  changeLocalListAndEmit({
    ...localList.value,
    groups,
  })
}

function handleGroupChange(group: GroupType, index: number) {
  changeGroupsAndEmit(getGroupsChange(group, index))
}
function handleAddGroup() {
  changeGroupsAndEmit(getGroupsAdd())
}
function handleInsertLeftGroup(currentIndex: number) {
  changeGroupsAndEmit(getGroupsInsertLeft(currentIndex))
}
function handleInsertRightGroup(currentIndex: number) {
  changeGroupsAndEmit(getGroupsInsertRight(currentIndex))
}
function handleDeleteGroup(currentIndex: number) {
  changeGroupsAndEmit(getGroupsDelete(currentIndex))
}
</script>

<template>
  <Draggable
    :model-value="list!.groups"
    class="flex items-start gap-2 flex-nowrap overflow-x-scroll scrollbar"
    item-key="index"
    @update:model-value="changeGroupsAndEmit"
  >
    <template #item="{ element, index }">
      <Group
        :list-id="list.id!"
        :group-index="index"
        :group="element"
        task-list-group="list-group"
        class="min-w-60 max-w-60"
        @need-update-list="emits('needUpdateList')"
        @update:group="(val) => handleGroupChange(val, index)"
        @insert-left-group="handleInsertLeftGroup(index)"
        @insert-right-group="handleInsertRightGroup(index)"
        @delete-group="handleDeleteGroup(index)"
      />
    </template>
    <template #footer>
      <NButton type="primary" @click="handleAddGroup">
        添加分组
      </NButton>
    </template>
  </Draggable>
</template>
