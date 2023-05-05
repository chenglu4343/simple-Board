import type { Table } from 'dexie'
import Dexie from 'dexie'
import type { ListType, TaskType } from '~/types'

export class TODODexie extends Dexie {
  tasks!: Table<TaskType>
  lists!: Table<ListType>

  constructor() {
    super('TODODexie')
    this.version(1).stores({
      tasks: '++id, title, content, status',
      lists: '++id, title, showingMode, groups',
    })
  }

  async addList(list: ListType) {
    const id = await this.lists.add(list) as ListType['id']

    return {
      ...list,
      id,
    }
  }

  async getListById(id: number) {
    return this.lists.get(id)
  }

  async getListsByIds(ids: number[]) {
    const lists = await this.lists.where('id').anyOf(ids).toArray()
    const idMap = new Map<number, ListType>()
    lists.forEach((list) => {
      idMap.set(list.id as number, list)
    })
    const sortedTasks = ids.map(id => idMap.get(id)!)

    return sortedTasks
  }

  async updateList(list: ListType) {
    return this.lists.update(list.id!, list)
  }

  async addTask(task: TaskType) {
    const id = await this.tasks.add(task) as TaskType['id']

    return {
      ...task,
      id,
    }
  }

  async updateTask(task: TaskType) {
    return this.tasks.update(task.id!, task)
  }

  async getTasksByIds(ids: number[]): Promise<TaskType[]> {
    const tasks = await this.tasks.where('id').anyOf(ids).toArray()
    const idMap = new Map<number, TaskType>()
    tasks.forEach((task) => {
      idMap.set(task.id as number, task)
    })
    const sortedTasks = ids.map(id => idMap.get(id)!)

    return sortedTasks
  }
}

export const dbService = new TODODexie()
