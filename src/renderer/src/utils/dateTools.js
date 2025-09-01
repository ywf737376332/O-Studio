export function getTimestampWithOffset(timestamp, offset = 8) {
  // 默认东八区
  let localTime = timestamp ? new Date(timestamp) : new Date();
  const localOffset = localTime.getTimezoneOffset() * 60000 // 获取本地时区偏移（毫秒）
  const targetOffset = offset * 60 * 60000 // 目标时区偏移（毫秒）
  return localTime.getTime() + localOffset + targetOffset
}

/**
 * 格式化时间戳为： 2024 年 12 月 17 日 17:15:54 星期二 下午
 * @param {*} timestamp
 * @returns
 */
export const formatDateTimeView = (timestamp) => {
  const date = new Date(timestamp)
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  const weekday = weekdays[date.getDay()]
  const period = hours < 12 ? '上午' : '下午'
  return `${year} 年 ${month} 月 ${day} 日 ${hours}:${minutes}:${seconds} 星期${weekday} ${period}`
}

/**
 * 格式化时间戳为：2024-12-17 17:16:31
 * @param {*} timestamp
 * @returns
 */
export const formatDateTime = (timestamp) => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * 格式化时间戳为：2024-12-17
 * @param {*} timestamp
 * @returns
 */
export const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 格式化时间戳为当年的第几天
 * @param {*} timestamp
 * @returns
 */
export const getDayOfYear = (timestamp) => {
  const date = new Date(timestamp)
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date - start
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}

/**
 * 格式化时间戳为当年的第几周
 * @param {*} timestamp
 * @returns
 */
export const getWeekNum = (timestamp) => {
  const date = new Date(timestamp)
  // 设置到当前日期所在的周四（ISO 8601 标准使用周四来计算）
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7))
  // 计算一月四号所在的周
  const week1 = new Date(date.getFullYear(), 0, 4)
  // 计算周数
  return 1 + Math.round(((date - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
}
