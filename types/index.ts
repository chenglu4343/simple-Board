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
}

export interface TaskType {
  id?: number
  title: string
  content: string
  status: 'todo' | 'done'
}
