import type { MaybeRef } from '@vueuse/core'
import type { GroupType } from '~/types'

export function useGroupsChange(groups: MaybeRef<GroupType[]>) {
  return {
    getGroupsChange: (group: GroupType, index: number) => [
      ...unref(groups).slice(0, index),
      group,
      ...unref(groups).slice(index + 1),
    ],
    getGroupsAdd: () => [
      ...unref(groups),
      createGroup(),
    ],
    getGroupsInsertLeft: (currentIndex: number) => [
      ...unref(groups).slice(0, currentIndex),
      createGroup(),
      ...unref(groups).slice(currentIndex),
    ],
    getGroupsInsertRight: (currentIndex: number) => [
      ...unref(groups).slice(0, currentIndex + 1),
      createGroup(),
      ...unref(groups).slice(currentIndex + 1),
    ],
    getGroupsDelete: (currentIndex: number) => [
      ...unref(groups).slice(0, currentIndex),
      ...unref(groups).slice(currentIndex + 1),
    ],
  }
}
