import { createGroup } from './createType'
import type { List, Task } from '~/types'

export function addTask2List(list: List, task: Task) {
  if (list.groups.length === 0)
    list.groups.push(createGroup())

  list.groups[0]?.tasks.unshift(task)
}
