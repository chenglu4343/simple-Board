import type { WritableComputedRef } from 'vue'
import type { GroupType } from '~/types'

export function useGroupsChange(groups: WritableComputedRef<GroupType[]>) {
  function addGroup() {
    groups.value = [...groups.value, createGroup()]
  }

  function insertLeftGroup(index: number) {
    groups.value = [...groups.value.slice(0, index), createGroup(), ...groups.value.slice(index)]
  }

  function insertRightGroup(index: number) {
    groups.value = [...groups.value.slice(0, index + 1), createGroup(), ...groups.value.slice(index + 1)]
  }

  function deleteGroup(index: number) {
    groups.value = [...groups.value.slice(0, index), ...groups.value.slice(index + 1)]
  }

  function changeGroup(index: number, group: GroupType) {
    groups.value = [...groups.value.slice(0, index), group, ...groups.value.slice(index + 1)]
  }

  return {
    addGroup,
    insertLeftGroup,
    insertRightGroup,
    deleteGroup,
    changeGroup,
  }
}
