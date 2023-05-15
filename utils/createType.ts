import { v4 } from 'uuid'
import type { BoardType, GroupType, TaskType } from '../types'

export function createBoard(title?: string): BoardType {
  return {
    title: title ?? '未命名',
    groups: [],
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
