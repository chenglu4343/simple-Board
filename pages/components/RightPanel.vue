<script setup lang="ts">
import { number } from 'vue-types'
import Draggable from 'vuedraggable'
import { cloneDeep } from 'lodash-es'
import { useGroupsChange } from '../composables/useGroupsChange'
import BoardView from './BoardView.vue'
import { dbService } from '~/dexie/dbService'
import type { GroupType, ListType } from '~/types'

const props = defineProps({
  listId: number().def(NaN),
})

const list = ref<ListType | null>()
const isList = computed(() => list.value?.showingMode === 'list')
const isBoard = computed(() => list.value?.showingMode === 'board')

const {
  getGroupsChange,
  getGroupsInsertLeft,
  getGroupsInsertRight,
  getGroupsDelete,
} = useGroupsChange(computed(() => list.value?.groups ?? []))

/**
 * 存在同时变更list数据时(例如从一个group拖拽到另外一个group)，第二次变更拿到的并不是第一次变更之后的list数据
 * 因此，变更将新的list直接存到本地副本，等待一个promise之后统一更新到dexie
 */
const saveListToDexie = usePromiseDoOnce(async () => {
  /** clone，因为groups是reactive数据 */
  await dbService.updateList(cloneDeep(list.value!))
})

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

/**
 * 将新的list存入本地副本，等待主进程更新完之后在微任务中更新
 */
async function updateList(newList: ListType) {
  list.value = newList
  saveListToDexie()
}

function handleSwitchModeChange(val: boolean) {
  const newList: ListType = {
    ...list.value!,
    showingMode: val ? 'board' : 'list',
  }
  updateList(newList)
}
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
    <header class="flex justify-between items-center">
      <div>
        {{ list?.title }}
      </div>
      <div v-if="!list?.disableChangeMode">
        {{ isBoard ? '看板模式' : '清单模式' }}
        <NSwitch :value="isBoard" :on-update-value="handleSwitchModeChange" />
      </div>
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
            @insert-top-group="handleInsertTopGroup(index)"
            @insert-bottom-group="handleInsertBottomGroup(index)"
            @delete-group="handleDeleteGroup(index)"
            @need-update-list="queryUpdateList"
          />
        </template>
      </Draggable>
    </template>

    <BoardView
      v-else-if="isBoard"
      :list="list!"
      @need-update-list="queryUpdateList"
      @update:list="updateList"
    />
  </main>
</template>
