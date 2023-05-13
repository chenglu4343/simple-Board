import type { Table } from 'dexie'
import Dexie from 'dexie'
import type { BoardType, TaskType } from '~/types'

export class TODODexie extends Dexie {
  tasks!: Table<TaskType>
  boards!: Table<BoardType>

  constructor() {
    super('TODODexie')
    this.version(1).stores({
      tasks: '++id, title, content, status',
      boards: '++id, title, groups',
    })
  }

  async addBoard(board: BoardType) {
    const id = await this.boards.add(board) as BoardType['id']

    return {
      ...board,
      id,
    }
  }

  async deleteBoard(boardId: number) {
    await this.transaction('rw', this.tasks, this.boards, async () => {
      const board = await this.boards.get(boardId)
      const taskIds = board?.groups.flatMap(group => group.taskIds) || []
      await Promise.all([this.boards.delete(boardId), ...taskIds.map(id => this.tasks.delete(id))])
    })
  }

  async getBoardById(id: number) {
    return this.boards.get(id)
  }

  async getBoardsByIds(ids: number[]) {
    const boards = await this.boards.where('id').anyOf(ids).toArray()
    const idMap = new Map<number, BoardType>()
    boards.forEach((board) => {
      idMap.set(board.id as number, board)
    })
    const sortedTasks = ids.map(id => idMap.get(id)!)

    return sortedTasks
  }

  async updateBoard(board: BoardType) {
    return this.boards.update(board.id!, board)
  }

  async addTask(boardId: number, groupIndex: number, task: TaskType) {
    let addTaskId: number | undefined
    await this.transaction('rw', this.tasks, this.boards, async () => {
      // 获取指定的board
      const board = await this.boards.get(boardId)
      if (!board)
        throw new Error(`Board with id ${boardId} not found`)

      // 获取或创建指定的group
      const group = board.groups[groupIndex] || createGroup()

      // 添加task到group中
      addTaskId = await this.tasks.add(task) as NonNullable<TaskType['id']>
      group.taskIds = [addTaskId, ...group.taskIds]

      // 更新board中的group
      board.groups[groupIndex] = group
      await this.boards.update(boardId, { groups: board.groups })
    })

    return {
      ...task,
      id: addTaskId,
    }
  }

  async deleteTask(boardId: number, groupIndex: number, taskId: number) {
    await this.transaction('rw', this.tasks, this.boards, async () => {
      // 获取指定的board
      const board = await this.boards.get(boardId)
      if (!board)
        throw new Error(`Board with id ${boardId} not found`)

      // 获取或创建指定的group
      const group = board.groups[groupIndex]

      // 删除task
      group.taskIds = group.taskIds.filter(id => id !== taskId)

      // 更新board中的group
      board.groups[groupIndex] = group
      await this.boards.update(boardId, { groups: board.groups })

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
}

export const dbService = new TODODexie()
