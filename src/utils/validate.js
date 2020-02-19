/* 合法uri */
export function isValidURL (textval) {
  const regexp = /^(https?|http?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return regexp.test(textval)
}

export function isValidUrlSimple (str) {
  const regexp = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/
  return regexp.test(str)
}

/* 小写字母 */
export function isValidLowerCase (str) {
  const regexp = /^[a-z]+$/
  return regexp.test(str)
}

/* 大写字母 */
export function isValidUpperCase (str) {
  const regexp = /^[A-Z]+$/
  return regexp.test(str)
}

export function isValidCommonCode (str) {
  const regexp = /^[A-Z0-9_-]{3,50}$/
  return regexp.test(str)
}

export function isValidSimpleCode (str) {
  const regexp = /^[a-zA-Z0-9_-]{1,50}$/
  return regexp.test(str)
}

export function isValidCommonName (str) {
  const regexp = /^[a-zA-Z0-9_-]{1,32}$/
  return regexp.test(str)
}

/* 大小写字母 */
export function isValidAlphabets (str) {
  const regexp = /^[A-Za-z]+$/
  return regexp.test(str)
}

export function isValidShortChineseName (str) {
  const regexp = /^(?!.*[\s\n\t\\~!@#$%^&*()+-/]+).{1,32}$/
  return regexp.test(str)
}

export function isValidLongChineseName (str) {
  const regexp = /^(?!.*[\s\n\t\\~!@#$%^&*()+-/]+).{1,32}$/
  return regexp.test(str)
}

export function isValidDisplayName (str) {
  const regexp = /^(?!.*[\s\n\t\\~!@#$%^&*()+-/]+).{1,16}$/
  return regexp.test(str)
}

export function isValidUsername (str) {
  const regexp = /^[a-zA-Z0-9_]{4,16}$/
  return regexp.test(str)
}

export function isValidClientSecret (str) {
  const regexp = /^[{}a-zA-Z0-9_]{4,30}$/
  return regexp.test(str)
}

export function isValidSimplePassword (str) {
  const regexp = /^(?![\d]+$)(?![a-zA-Z]+$)[\da-zA-Z]{6,12}$/
  return regexp.test(str)
}

export function isValidPhone (str) {
  const regexp = /^[\d]{11}$/
  return regexp.test(str)
}

export function isValidEmail (str) {
  const regexp = /^([A-Za-z0-9_\-\\.])+@([A-Za-z0-9_\-\\.])+\.([A-Za-z]{2,4})$/
  return regexp.test(str)
}

export function isValidPermissionCode (str) {
  const regexp = /^[A-Z0-9_-]{4,50}$/
  return regexp.test(str)
}

export function isValidRoleCode (str) {
  const regexp = /^[A-Z0-9_-]{4,50}$/
  return regexp.test(str)
}

export const VALIDATE_ERROR_MSG = {
  url: 'url格式不正确',
  commonCode: '编码必须是3-50位大写字母、数字、_、-组成',
  simpleCode: '编码必须是1-50位字母、数字、_、-组成',
  displayName: '昵称必须是1-16字符，且不能含有换行符空格\\~!@#$%^&*()+-/等特殊字符',
  shortChineseName: '请键入1-32字符，且不能含有换行符空格\\~!@#$%^&*()+-/等特殊字符',
  longChineseName: '请键入1-256字符，且不能含有换行符空格\\~!@#$%^&*()+-/等特殊字符',
  username: '用户名必须是4-16位字母、数字、下划线组成',
  clientSecret: '客户端密码必须是4-40字符、数字、下划线、{}-等字符组成',
  commonName: '输入必须是1-32位字母、数字、_、-组成',
  simplePassword: '密码必须是6-12位字母、数字组合，且分包含1个字母、1个数字',
  confirmPassword: '两次输入密码不一致',
  phone: '手机必须是11位数字',
  email: '邮箱格式不正确',
  permissionName: '权限名称必须是1-16字符，且不能含有换行符空格\\~!@#$%^&*()+-/等特殊字符',
  permissionCode: '权限编码必须是4-50位大写字母、数字、_、-组成',
  roleCode: '角色编码必须是4-50位大写字母、数字、_、-组成'
}
