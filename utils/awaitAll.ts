export async function awaitAll() {
  await nextTick()
  await Promise.resolve(setTimeout)
}
