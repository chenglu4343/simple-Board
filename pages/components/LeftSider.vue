<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { dbService } from '~/dexie/dbService'
import { useLocalDataStore } from '~/stores/useLocalDataStore'
import type { BoardType } from '~/types'

const localListDataStore = useLocalDataStore()
const { currentBoardId } = storeToRefs(localListDataStore)

const boardArr = ref<BoardType[]>([])

watchEffect(() => updateTaskArr())

function updateTaskArr() {
  dbService.getBoardsByIds(localListDataStore.boardIds).then((boards) => {
    boardArr.value = boards
  })
}
</script>

<template>
  <div class="h-full p-2 gap-2 box-border grid grid-rows-[auto_1fr]">
    <NButton type="primary" @click="localListDataStore.addBoard">
      新建看板
    </NButton>

    <div class="overflow-y-scroll">
      <BoardItem
        v-for="board of boardArr"
        :key="board.id!"
        class="mt-2"
        :board="board"
        :is-active="currentBoardId === board.id"
        @click="currentBoardId = board.id!"
      />
    </div>
  </div>
</template>
