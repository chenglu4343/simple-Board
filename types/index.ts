export interface List {
  title: string
  groups: Group[]
}

export interface Group {
  title: string
  tasks: Task[]
}

export interface Task {
  title: string
  content: string
  status: 'todo' | 'done'
}
