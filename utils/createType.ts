import type { GroupType, ListType } from '../types'
import { dbService } from '~/dexie/dbService'

export function createList(title?: string): ListType {
  return {
    title: title ?? '未命名',
    groups: [],
    showingMode: 'list',
  }
}

export function createGroup(title?: string): GroupType {
  return {
    title: title ?? '未命名',
    taskIds: [],
  }
}

export async function createTask(title?: string) {
  return dbService.addTask({
    title: title ?? '',
    status: 'todo',
    content: '',
  })
}
