import type { Group, List, Task } from '../types'

export function createList(title?: string): List {
  return {
    title: title ?? '未命名',
    groups: [],
  }
}

export function createGroup(title?: string): Group {
  return {
    title: title ?? '未命名',
    tasks: [],
  }
}

export function createTask(title?: string): Task {
  return {
    title: title ?? '',
    status: 'todo',
    content: '',
  }
}
