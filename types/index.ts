export interface ListType {
  title: string
  showingMode: 'list' | 'board'
  groups: GroupType[]
}

export interface GroupType {
  title: string
  tasks: TaskType[]
}

export interface TaskType {
  title: string
  content: string
  status: 'todo' | 'done'
}
