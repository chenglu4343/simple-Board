import IconSelectList from './Comp.vue'

export interface OperateOption {
  icon: string
  label: string
  onClick?: () => void
}

export default IconSelectList
