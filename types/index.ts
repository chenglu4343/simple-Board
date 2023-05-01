export interface ListType {
  title: string
  showingMode: 'list' | 'board'
  groups: GroupType[]
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
