export interface ListType {
  id?: number
  title: string
  groups: GroupType[]
}

export interface GroupType {
  title: string
  taskIds: number[]
  /** 为了区分不同的group加上唯一标识 */
  uuid: string
}

export interface TaskType {
  id?: number
  title: string
  content: string
  status: 'todo' | 'done'
}
