/**
 * 用于更新props的propKey为对象时的值
 */
export function useUpdateObjKey<
  P extends {},
  E extends { (e: `update:${PK}`, val: P[PK]): void },
  PK extends keyof P & string,
  UK extends keyof P[PK]>(options: {
  /** 组件定义的props */
  props: P

  /** props上对应的key */
  propsKey: PK

  /** props[propsKey]对象上要更新的key */
  updateKey: UK

  /** 组件定义的emits */
  emits: E
}) {
  const { props, emits, propsKey, updateKey } = options

  return (value: P[PK][UK]) => {
    emits(`update:${propsKey}`, {
      ...props[propsKey],
      [updateKey]: value,
    })
  }
}
