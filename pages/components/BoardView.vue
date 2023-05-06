<!-- 看板视图 -->
<script setup lang="ts">
import { object } from 'vue-types'
import Draggable from 'vuedraggable'
import type { GroupType, ListType } from '~/types'

const props = defineProps({
  list: object<ListType>().isRequired,
})

const emits = defineEmits<{
  (e: 'needUpdateList'): void
  (e: 'updateGroups', groups: GroupType[]): void
}>()

function handleGroupChange(group: GroupType, index: number) {
  emits('updateGroups', [
    ...props.list.groups.slice(0, index),
    group,
    ...props.list.groups.slice(index + 1),
  ])
}
function handleAddGroup() {
  emits('updateGroups', [
    ...props.list.groups,
    createGroup(),
  ])
}
function handleInsertLeftGroup(currentIndex: number) {
  emits('updateGroups', [
    ...props.list.groups.slice(0, currentIndex),
    createGroup(),
    ...props.list.groups.slice(currentIndex),
  ])
}
function handleInsertRightGroup(currentIndex: number) {
  emits('updateGroups', [
    ...props.list.groups.slice(0, currentIndex + 1),
    createGroup(),
    ...props.list.groups.slice(currentIndex + 1),
  ])
}
function handleDeleteGroup(currentIndex: number) {
  emits('updateGroups', [
    ...props.list.groups.slice(0, currentIndex),
    ...props.list.groups.slice(currentIndex + 1),
  ])
}
</script>

<template>
  <Draggable
    :model-value="list!.groups"
    class="flex items-start gap-2 flex-nowrap overflow-x-scroll scrollbar"
    item-key="index"
    @update:model-value="groups => emits('updateGroups', groups)"
  >
    <template #item="{ element, index }">
      <Group
        :list-id="list.id!"
        :group-index="index"
        :group="element" task-list-group="list-group" class="min-w-60 max-w-60"
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
