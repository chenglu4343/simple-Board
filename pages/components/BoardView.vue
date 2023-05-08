<!-- 看板视图 -->
<script setup lang="ts">
import Draggable from 'vuedraggable'
import { storeToRefs } from 'pinia'
import { useGroupsChange } from '../composables/useGroupsChange'
import type { GroupType } from '~/types'
import { useCurrentListStore } from '~/stores/useCurrentListStore'

const { list } = storeToRefs(useCurrentListStore())
const { updateList } = useCurrentListStore()

const {
  getGroupsChange,
  getGroupsAdd,
  getGroupsInsertLeft,
  getGroupsInsertRight,
  getGroupsDelete,
} = useGroupsChange(computed(() => list.value.groups))

function changeGroupsAndEmit(groups: GroupType[]) {
  list.value = {
    ...list.value,
    groups,
  }
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
        @need-update-list="updateList"
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
