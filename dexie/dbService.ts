import type { Table } from 'dexie'
import Dexie from 'dexie'
import type { TaskType } from '~/types'

export class TODODexie extends Dexie {
  tasks!: Table<TaskType>

  constructor() {
    super('TODODexie')
    this.version(1).stores({
      tasks: '++id, title, content, status', // Primary key and indexed props
    })
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
