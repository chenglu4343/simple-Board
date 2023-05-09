<script setup lang="ts">
import Draggable from 'vuedraggable'
import { storeToRefs } from 'pinia'
import { useGroupsChange } from '../composables/useGroupsChange'
import { useCurrentListStore } from '~/stores/useCurrentListStore'
import { useLocalListsDataStore } from '~/stores/useLocalListsDataStore'
import type { GroupType } from '~/types'

const { list } = storeToRefs(useCurrentListStore())
const { currentListId } = storeToRefs(useLocalListsDataStore())
const { updateList } = useCurrentListStore()

const {
  getGroupsChange,
  getGroupsInsertLeft,
  getGroupsInsertRight,
  getGroupsDelete,
} = useGroupsChange(computed(() => list.value.groups ?? []))

function handleGroupChange(group: GroupType, index: number) {
  handleGroupsChange(getGroupsChange(group, index))
}
function handleInsertTopGroup(currentIndex: number) {
  handleGroupsChange(getGroupsInsertLeft(currentIndex))
}
function handleInsertBottomGroup(currentIndex: number) {
  handleGroupsChange(getGroupsInsertRight(currentIndex))
}
function handleDeleteGroup(currentIndex: number) {
  handleGroupsChange(getGroupsDelete(currentIndex))
}
function handleGroupsChange(groups: GroupType[]) {
  list.value = {
    ...list.value!,
    groups,
  }
}
</script>

<template>
  <Draggable
    :model-value="list!.groups"
    class="overflow-y-scroll"
    item-key="uuid"
    tag="n-collapse"
    :component-data="{
      themeOverrides: {
        dividerColor: '#6B6B77FF',
      },
      defaultExpandedNames: list!.groups.map(item => item.uuid),
    }"
    @update:model-value="handleGroupsChange"
  >
    <template #item="{ element, index }">
      <CollapseGroup
        :list-id="currentListId"
        :group-index="index"
        :group="element" preset="operate-group" task-list-group="collaspe-group"
        :collapse-item-name="element.uuid"
        @update:group="(val) => handleGroupChange(val, index)"
        @insert-top-group="handleInsertTopGroup(index)"
        @insert-bottom-group="handleInsertBottomGroup(index)"
        @delete-group="handleDeleteGroup(index)"
        @need-update-list="updateList"
      />
    </template>
  </Draggable>
</template>
