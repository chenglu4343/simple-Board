import { v4 } from 'uuid'
import type { GroupType, ListType, TaskType } from '../types'

export function createList(title?: string): ListType {
  return {
    title: title ?? '未命名',
    groups: [],
    icon: 'list',
  }
}

export function createGroup(title?: string): GroupType {
  return {
    title: title ?? '未命名',
    taskIds: [],
    uuid: v4(),
  }
}

export function createTask(title?: string): TaskType {
  return {
    title: title ?? '',
    status: 'todo',
    content: '',
  }
}
