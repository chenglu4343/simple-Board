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

    this.initDexieStores()
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

  async addTask(listId: number, groupIndex: number, task: TaskType) {
    let addTaskId: number | undefined
    await this.transaction('rw', this.tasks, this.lists, async () => {
      // 获取指定的list
      const list = await this.lists.get(listId)
      if (!list)
        throw new Error(`List with id ${listId} not found`)

      // 获取或创建指定的group
      const group = list.groups[groupIndex] || createGroup()

      // 添加task到group中
      addTaskId = await this.tasks.add(task) as NonNullable<TaskType['id']>
      group.taskIds = [addTaskId, ...group.taskIds]

      // 更新list中的group
      list.groups[groupIndex] = group
      await this.lists.update(listId, { groups: list.groups })
    })

    return {
      ...task,
      id: addTaskId,
    }
  }

  async deleteTask(listId: number, groupIndex: number, taskId: number) {
    // TODO:删除task
    await this.transaction('rw', this.tasks, this.lists, async () => {
      // 获取指定的list
      const list = await this.lists.get(listId)
      if (!list)
        throw new Error(`List with id ${listId} not found`)

      // 获取或创建指定的group
      const group = list.groups[groupIndex]

      // 删除task
      group.taskIds = group.taskIds.filter(id => id !== taskId)

      // 更新list中的group
      list.groups[groupIndex] = group
      await this.lists.update(listId, { groups: list.groups })

      // 删除task
      await this.tasks.delete(taskId)
    })
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

  /** 初始化存储数据 */
  private async initDexieStores() {
    const collectionList = await this.lists.get(-1)
    if (!collectionList) {
      this.lists.add({
        ...createList('收集箱'),
        id: -1,
        disableChangeMode: true,
      })
    }
  }
}

export const dbService = new TODODexie()
