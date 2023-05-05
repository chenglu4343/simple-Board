<script setup lang="ts">
import { array, number } from 'vue-types'
import { dbService } from '~/dexie/dbService'
import type { ListType } from '~/types'

const props = defineProps({
  listIds: array<number>().isRequired,
  currentListId: number(),
})

const emits = defineEmits<{
  (e: 'add-list'): void
  (e: 'update:currentListId', listId: number): void
}>()

const listArr = ref<ListType[]>([])

watchEffect(() => updateTaskArr())

function updateTaskArr() {
  dbService.getListsByIds(props.listIds).then((lists) => {
    listArr.value = lists
  })
}
</script>

<template>
  <div class="h-full p-2 box-border">
    <NButton type="primary" @click="emits('add-list')">
      新建清单
    </NButton>

    <div
      v-for="list of listArr"
      :key="list.id!"
      class="p-2 cursor-pointer"
      :class="{
        'text-blue-500': list.id === props.currentListId,
      }"
      @click="emits('update:currentListId', list.id!)"
    >
      {{ list.title }}
    </div>
  </div>
</template>
