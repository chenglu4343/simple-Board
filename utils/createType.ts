import type { GroupType, ListType, TaskType } from '../types'

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
    tasks: [],
  }
}

export function createTask(title?: string): TaskType {
  return {
    title: title ?? '',
    status: 'todo',
    content: '',
  }
}
