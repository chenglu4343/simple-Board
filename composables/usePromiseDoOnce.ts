/**
 * 一次主进程事件调用了多次func函数但只期望执行一次
 * 返回的函数在一次主进程中调用多次时只会在promise之后执行一次
 * @param func 不带参数的匿名执行函数
 */
export function usePromiseDoOnce(func: () => unknown) {
  let promise: Promise<unknown> | null = null

  return () => {
    if (promise)
      return

    promise = Promise.resolve()
      .then(func)
      .finally(() => {
        promise = null
      })
  }
}
