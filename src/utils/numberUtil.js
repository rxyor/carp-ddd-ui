const RoundingMode = {
  UP: 1,
  ROUND: 2,
  DOWN: 3
}

const RemoveTailZerosMode = {
  Y: 1,
  N: 2
}
export default { RoundingMode, RemoveTailZerosMode }

export function definedFixed (num, scale, roundingMode = RoundingMode.UP, removeTailZerosMode = RemoveTailZerosMode.Y) {
  if (!isNumber(num)) {
    return 0
  }
  if (!isNumber(scale) || scale < 0) {
    scale = 0
  }
  if (isNullOrUndefined(roundingMode) ||
    (roundingMode !== RoundingMode.UP && roundingMode !== RoundingMode.DOWN && roundingMode !== RoundingMode.ROUND)) {
    roundingMode = RoundingMode.UP
  }
  if (isNullOrUndefined(removeTailZerosMode) ||
    (removeTailZerosMode !== RemoveTailZerosMode.Y && removeTailZerosMode !== RemoveTailZerosMode.N)) {
    removeTailZerosMode = RemoveTailZerosMode.Y
  }

  const result = computeRoundNum(num, scale, roundingMode)
  if (removeTailZerosMode === RemoveTailZerosMode.Y) {
    return parseFloat(result.toString())
  }
  return result
}

function computeRoundNum (x, scale, roundingMode = RoundingMode.ROUND) {
  if (RoundingMode.ROUND === roundingMode) {
    return x.toFixed(scale)
  } else {
    const power = Math.pow(10, (scale + 1))
    const extendInt = Math.floor(x * power)
    const iStr = extendInt.toString()
    const lastNum = parseInt(iStr.charAt(iStr.length - 1))
    let result = 0
    if (RoundingMode.UP === roundingMode) {
      if (lastNum !== 0) {
        result = ((extendInt - lastNum + 10) / power).toFixed(scale)
      } else {
        result = ((extendInt - lastNum) / power).toFixed(scale)
      }
      return result
    } else {
      result = ((extendInt - lastNum) / power).toFixed(scale)
      return result
    }
  }
}

function isNumber (x) {
  if (isNullOrUndefined(x)) {
    return false
  }
  // 非负浮点数
  const regPos = /^\d+(\.\d+)?$/
  // 负浮点数
  const regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/
  return regPos.test(x) || regNeg.test(x)
}

export function isNullOrUndefined (x) {
  return x === null || x === undefined
}
