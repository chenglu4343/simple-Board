export interface ListType {
  id?: number
  title: string
  showingMode: 'list' | 'board'
  groups: GroupType[]
  disableChangeMode?: boolean
}

export interface GroupType {
  title: string
  taskIds: number[]
  /** 为了区分不同的group加上唯一标识 */
  timesmap: number
}

export interface TaskType {
  id?: number
  title: string
  content: string
  status: 'todo' | 'done'
}
