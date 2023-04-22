import { createGroup } from './createType'
import type { ListType, TaskType } from '~/types'

export function addTask2List(list: ListType, task: TaskType) {
  if (list.groups.length === 0)
    list.groups.push(createGroup())

  list.groups[0]?.tasks.unshift(task)
}
