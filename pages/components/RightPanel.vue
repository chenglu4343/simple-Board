<script setup lang="ts">
import { number } from 'vue-types'
import Draggable from 'vuedraggable'
import { cloneDeep } from 'lodash-es'
import { dbService } from '~/dexie/dbService'
import type { GroupType, ListType } from '~/types'

const props = defineProps({
  listId: number().def(NaN),
})

const list = ref<ListType | null>()
const isList = computed(() => list.value?.showingMode === 'list')
const isBoard = computed(() => list.value?.showingMode === 'board')

watchEffect(() => queryUpdateList())

function queryUpdateList() {
  if (!props.listId) {
    list.value = null
  }
  else {
    dbService.getListById(props.listId).then((queryList) => {
      list.value = queryList!
    })
  }
}

async function updateList(newList: ListType) {
  /** clone，因为groups是reactive数据 */
  await dbService.updateList(cloneDeep(newList))
  queryUpdateList()
}

function handleSwitchModeChange(val: boolean) {
  const newList: ListType = {
    ...list.value!,
    showingMode: val ? 'board' : 'list',
  }
  updateList(newList)
}
function handleAddGroup() {
  handleGroupsChange([
    ...list.value!.groups,
    createGroup(),
  ])
}
function handleGroupChange(group: GroupType, index: number) {
  handleGroupsChange([
    ...list.value!.groups.slice(0, index),
    group,
    ...list.value!.groups.slice(index + 1),
  ])
}
function handleInsertLeftGroup(currentIndex: number) {
  handleGroupsChange([
    ...list.value!.groups.slice(0, currentIndex),
    createGroup(),
    ...list.value!.groups.slice(currentIndex),
  ])
}
function handleInsertRightGroup(currentIndex: number) {
  handleGroupsChange([
    ...list.value!.groups.slice(0, currentIndex + 1),
    createGroup(),
    ...list.value!.groups.slice(currentIndex + 1),
  ])
}
function handleDeleteGroup(currentIndex: number) {
  handleGroupsChange([
    ...list.value!.groups.slice(0, currentIndex),
    ...list.value!.groups.slice(currentIndex + 1),
  ])
}
function handleFirstGroupTaskIdsChange(taskIds: number[]) {
  handleGroupsChange([
    {
      ...list.value!.groups[0],
      taskIds,
    },
  ])
}
function handleGroupsChange(groups: GroupType[]) {
  const newList: ListType = {
    ...list.value!,
    groups,
  }
  updateList(newList)
}
</script>

<template>
  <main v-if="!listId" class="h-100vh box-border">
    没有数据
  </main>
  <main
    v-else
    class="p-2 h-100vh box-border bg-gray-1 grid gap-2"
    :class="{
      'grid-rows-[auto_auto_1fr]': isList,
      'grid-rows-[auto_1fr]': isBoard,
    }"
  >
    <header>
      {{ isBoard ? '看板模式' : '清单模式' }}
      <NSwitch :value="isBoard" :on-update-value="handleSwitchModeChange" />
    </header>

    <TaskInput v-if="isList" :list-id="listId" :group-index="0" @need-update-list="queryUpdateList" />

    <template v-if="isList && list?.groups.length === 1">
      <TaskList :list-id="listId" :group-index="0" :task-ids="list.groups[0].taskIds" @need-update-list="queryUpdateList" @update:task-ids="handleFirstGroupTaskIdsChange" />
    </template>

    <template v-else-if="isList && list!.groups.length > 1">
      <Draggable
        :model-value="list!.groups"
        class="overflow-y-scroll"
        item-key="index"
        tag="n-collapse"
        :component-data="{
          themeOverrides: {
            dividerColor: '#6B6B77FF',
          },
          defaultExpandedNames: list!.groups.map((item, index) => `${index}-${item.title}`),
        }"
        @update:model-value="handleGroupsChange"
      >
        <template #item="{ element, index }">
          <CollapseGroup
            :list-id="listId"
            :group-index="index"
            :group="element" preset="operate-group" task-list-group="collaspe-group"
            :collapse-item-name="`${index}-${element.title}`"
            @update:group="(val) => handleGroupChange(val, index)"
            @insert-top-group="handleInsertLeftGroup(index)"
            @insert-bottom-group="handleInsertRightGroup(index)"
            @delete-group="handleDeleteGroup(index)"
            @need-update-list="queryUpdateList"
          />
        </template>
      </Draggable>
    </template>

    <template v-else-if="isBoard">
      <Draggable
        :model-value="list!.groups"
        class="flex items-start gap-2 flex-nowrap overflow-x-scroll scrollbar"
        item-key="index"
        @update:model-value="handleGroupsChange"
      >
        <template #item="{ element, index }">
          <Group
            :list-id="listId"
            :group-index="index"
            :group="element" task-list-group="list-group" class="min-w-60 max-w-60"
            @need-update-list="queryUpdateList"
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
  </main>
</template>
