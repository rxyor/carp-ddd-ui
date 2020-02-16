export function distinctArray (array) {
  const distinctArray = []
  if (!array) {
    return distinctArray
  }
  const set = new Set(array)
  Object.assign(distinctArray, Array.from(set))
  return distinctArray
}
