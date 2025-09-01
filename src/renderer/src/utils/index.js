import { Message, Notification } from '@/utils/message'
import NumberValidator from './NumberValidator'
import routes from '@/router/routes/index'
import { formatJson } from './beautifyJson';
import { formatCode } from './beautifyHtml';
import { formatSql } from './beautifySql';
import { formatXml } from './beautifyXml';
/**
 * 判断字符串是否为空
 * @param {Object} value
 * @returns
 */
export const isEmpty = (str) => {
  if (str === '' || str === null || str === undefined) {
    return true
  }
  return false
}

/**
 * 判断对象是否为空
 * @param {Object} value
 * @returns
 */
export const isObjectEmpty = (obj) => {
  return Object.keys(obj).length === 0
}

/**
 * 判断一个值是否为纯数字
 * @param {*} value 
 * @returns 
 */
export const isNumber = (value) => {
  // 处理特殊情况
  if (value === null || value === undefined) return false
  if (typeof value === 'boolean') return false
  if (Array.isArray(value)) return false
  if (typeof value === 'object') return false

  // 转换为字符串
  const str = value.toString().trim()

  // 空字符串判断
  if (!str) return false

  // 判断是否为纯数字
  return /^\d+$/.test(str)
}

/**
 * 字数统计
 * @param {String} value
 */
export const countWords = (text) => {
  return text ? text.length : 0
}

/**
 * 计算时间差
 * @param {Long} startDate
 * @param {Long} endDate
 */
export const timesDiff = (startDate, endDate) => {
  startDate = new Date(startDate)
  endDate = new Date(endDate)
  //时间差的秒数
  let diff = Math.floor(endDate.getTime() - startDate.getTime())
  return viewTimes(diff)
}

/**
 * 计算时间差
 * @param {Long} startDate
 * @param {Long} endDate
 */
export const viewTimes = (diffMillisecond) => {
  //时间差的秒数
  let diff = Math.floor(diffMillisecond / 1000)
  //天
  let days = Math.floor(diff / (24 * 60 * 60))
  //小时
  let remainder = diff % (24 * 60 * 60) //计算天后剩余秒数
  let hours = Math.floor(remainder / (60 * 60))
  //分钟
  let remainder_2 = remainder % (60 * 60) //计算小时后剩余秒数
  let minutes = Math.floor(remainder_2 / 60)
  //秒
  let seconds = remainder_2 % 60 //计算剩余秒数
  let str = ''
  if (seconds) {
    str = seconds + '秒' + str
  }
  if (minutes > 0) {
    str = minutes + '分' + str
  }
  if (hours > 0) {
    str = hours + '小时' + str
  }
  if (days > 0) {
    str = days + '天' + str
  }
  return str
}

export function formatMilliseconds(ms) {
  const totalSeconds = Math.floor(ms / 1000); // 毫秒转秒
  const days = Math.floor(totalSeconds / 86400); // 计算天数
  const remainingSeconds = totalSeconds % 86400; // 剩余秒数
  const hours = Math.floor(remainingSeconds / 3600); // 计算小时数
  if (days === 0) {
    return `${hours}小时`;
  }
  return `${days}天${hours}小时`;
}

/**
 * 图片URL渲染
 * @param {*} url
 */
export const getImageUrl = (url) => {
  return new URL(`${url}`, import.meta.url).href
}

/**
 * 图片文件转换为base64图片编码
 * @param {*} file
 * @returns
 */
export const convertImgToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      resolve(reader.result)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * 获取固定的首个路由
 */
export const affixRoute = () => {
  const affixMenu = routes.find((item) => {
    if (item.meta && item.meta.affix) {
      return true
    }
  })
  return affixMenu
}

/**
 * 文本数据转Base64
 * @param {*} data
 */
export const encodeToBase64 = (data) => {
  // 创建一个 TextEncoder 实例
  let encoder = new TextEncoder()
  // 将字符串编码为 Uint8Array
  let uint8Array = encoder.encode(data)
  // 将 Uint8Array 转换为 Base64 字符串
  let binaryString = String.fromCharCode(...uint8Array)
  return btoa(binaryString)
}

/**
 * Base64转文本数据
 * @param {*} data
 */
export const decodeFromBase64 = (data) => {
  // 将 Base64 字符串解码为二进制字符串
  let binaryString = atob(data)
  // 将二进制字符串转换为 Uint8Array
  let uint8Array = new Uint8Array([...binaryString].map((char) => char.charCodeAt(0)))
  // 创建一个 TextDecoder 实例
  let decoder = new TextDecoder()
  // 将 Uint8Array 解码为字符串
  return decoder.decode(uint8Array)
}

/**
 * 将字符串转换为十六进制
 * @param {*} str
 * @returns
 */
export const hexEncode = (str) => {
  return strToHexCharCode(strToUtf8Bytes(str))
}

/**
 * 将十六进制转换为字符串
 * @param {*} str
 * @returns
 */
export const hexDecode = (str) => {
  let arr = []
  for (let i = 0; i < str.length; i = i + 2) {
    let curCharCode = parseInt(str.substring(i, i + 2), 16)
    arr.push(curCharCode)
  }
  return new TextDecoder().decode(new Uint8Array(arr))
}

/**
 * 字符串转换UTF8字节
 * @param {*} str
 * @returns
 */
function strToHexCharCode(str) {
  var hexCharCode = []
  var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
  for (var i = 0; i < str.length; i++) {
    var bit = (str[i] & 0x0f0) >> 4
    hexCharCode.push(chars[bit])
    var bit = str[i] & 0x0f
    hexCharCode.push(chars[bit])
  }
  return hexCharCode.join('')
}

/**
 * 根据返回字节码进行16进制转换
 * @param {*} str
 * @returns
 */
function strToUtf8Bytes(str) {
  const utf8 = []
  for (let ii = 0; ii < str.length; ii++) {
    let charCode = str.charCodeAt(ii)
    if (charCode < 0x80) utf8.push(charCode)
    else if (charCode < 0x800) {
      utf8.push(0xc0 | (charCode >> 6), 0x80 | (charCode & 0x3f))
    } else if (charCode < 0xd800 || charCode >= 0xe000) {
      utf8.push(0xe0 | (charCode >> 12), 0x80 | ((charCode >> 6) & 0x3f), 0x80 | (charCode & 0x3f))
    } else {
      ii++
      charCode = 0x10000 + (((charCode & 0x3ff) << 10) | (str.charCodeAt(ii) & 0x3ff))
      utf8.push(
        0xf0 | (charCode >> 18),
        0x80 | ((charCode >> 12) & 0x3f),
        0x80 | ((charCode >> 6) & 0x3f),
        0x80 | (charCode & 0x3f)
      )
    }
  }
  //兼容汉字，ASCII码表最大的值为127，大于127的值为特殊字符
  for (let jj = 0; jj < utf8.length; jj++) {
    var code = utf8[jj]
    if (code > 127) {
      utf8[jj] = code - 256
    }
  }
  return utf8
}

export const getRootStyleValue = (styleKey) => {
  // 获取根元素
  const root = document.documentElement
  // 获取计算后的样式
  const styles = getComputedStyle(root)
  // 获取自定义属性的值
  return styles.getPropertyValue(styleKey).trim()
}

export const parseUrlParams = (url) => {
  if (!url) {
    return
  }
  const result = {}
  try {
    // 创建 URL 对象
    const urlObj = new URL(url)
    // 获取查询参数
    const params = new URLSearchParams(urlObj.search)
    // 转换为对象
    params.forEach((value, key) => {
      result[key] = value
    })
  } catch (error) {
    throw new Error('URL解析失败，请检查格式！')
  }
  return result
}

/**
 * 获取图片文件的宽高
 * @param {*} file
 * @returns
 */
export const getImageFileSize = (fileRaw) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const width = img.width
        const height = img.height
        resolve({ width, height })
      }
      img.onerror = (err) => {
        reject(err)
      }
      img.src = e.target.result
    }
    reader.onerror = (err) => {
      reject(err)
    }
    reader.readAsDataURL(fileRaw)
  })
}

/**
 * 获取base64图片的宽高
 * @param {*} base64
 * @returns
 */
export const getBase64ImageSize = (base64) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      })
    }
    img.onerror = reject
    img.src = base64
  })
}

/**
 * 批量进制转换函数
 * @param {string} number - 要转换的数字（字符串格式）
 * @param {number|string} fromRadix - 输入数字的进制（2-36）
 * @param {Array} targetRadixes - 目标进制数组
 * @returns {Array} - 转换结果数组
 */
export function convertRadixes(number, fromRadix, targetRadixes) {
  try {
    // 1. 参数验证
    if (
      !number ||
      !fromRadix ||
      !Array.isArray(targetRadixes) ||
      !NumberValidator.isNumber(number)
    ) {
      throw new Error('无效的参数')
    }

    // 2. 将输入的数字转换为十进制（作为中间值）
    const decimalValue = parseInt(number, parseInt(fromRadix))

    if (isNaN(decimalValue)) {
      throw new Error(`无法将 ${number} 从 ${fromRadix} 进制转换为十进制`)
    }

    // 3. 转换为目标进制数组中指定的进制
    return targetRadixes.map((item) => {
      try {
        const targetRadix = parseInt(item.value)
        return {
          ...item,
          value: decimalValue.toString(targetRadix).toUpperCase()
        }
      } catch (error) {
        return {
          ...item,
          value: '',
          error: `转换到 ${item.label} 失败`
        }
      }
    })
  } catch (error) {
    console.error('进制转换错误:', error)
    Message({
      message: `${error.message}`,
      type: 'error'
    })
    return targetRadixes.map((item) => ({
      ...item,
      value: 'NAN',
      error: error.message
    }))
  }
}

/**
 * 循环生成指定数组
 * @param {Number} start
 * @param {Number} end
 */
export function generateRadixOptions(start = 2, end = 36) {
  return Array.from({ length: end - start + 1 }, (_, index) => {
    const value = String(index + start)
    return {
      label: `${value} 进制`,
      value: value,
      id: index + 1
    }
  })
}

/**
 * 编辑器值批量格式化
 * @param {*} language 
 * @param {*} editorModel 
 */
export const formatEditorValue = (language, editorModel) => {
  let value = editorModel.getValue();
  if (editorModel && value) {
    switch (language) {
      case 'json': {
        editorModel.setValue(formatJson(value));
        break;
      }
      case 'javascript': {
        editorModel.setValue(formatCode(value, 'js'));
        break;
      }
      case 'html': {
        editorModel.setValue(formatCode(value, 'html'));
        break;
      }
      case 'css': {
        editorModel.setValue(formatCode(value, 'css'));
        break;
      }
      case 'xml': {
        editorModel.setValue(formatXml(value));
        break;
      }
      case 'sql': {
        editorModel.setValue(formatSql(value));
        break;
      }
    }
  }
}

/**
 * 计算日期差的天数
 * @param {*} date1 
 * @param {*} date2 
 */
export function calculateDiffDays(startDate, endDate) {
  const timeDiff = endDate.getTime() - startDate.getTime(); // 时间戳差值
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // 转换为天数
}

/**
 * 日期格式化
 * @param {*} date 
 */
export function formatDate(date) {
  const year = date.getFullYear(); // 获取年份
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 获取月份，补零
  const day = String(date.getDate()).padStart(2, '0'); // 获取日期，补零
  return `${year}-${month}-${day}`; // 拼接为 yyyy-MM-dd 格式
}

export function formatTime(timeString) {
  const date = new Date(timeString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，需要加 1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

export function getRandomLightColor() {
  var color;
  do {
    // 生成一个0到255之间的随机数
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);

    // 计算亮度值
    var brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // 设置亮度阈值，排除黑色和稍微深的黑色，同时确保颜色不是太亮
    if (brightness > 50 && brightness < 200) { // 调整阈值以满足需求
      // 将RGB值转换为十六进制
      color = '#' + ((1 << 24) + (r << 16) + (g << 8) + b)
        .toString(16)
        .slice(1)
        .toUpperCase();
    } else {
      color = null;
    }
  } while (!color); // 确保颜色不是黑色、稍微深的黑色或白色

  return color;
}

/**
 * 将一个颜色值减淡
 * @param {*} color  颜色值 #CCCCCC
 * @param {*} percent 透明值
 * @returns 
 */
export function lightenColor(color, percent) {
  // 将 hex 颜色转换为 RGB
  let r = parseInt(color.slice(1, 3), 16);
  let g = parseInt(color.slice(3, 5), 16);
  let b = parseInt(color.slice(5, 7), 16);

  // 将 RGB 颜色减淡
  r = Math.min(255, r + (255 - r) * percent);
  g = Math.min(255, g + (255 - g) * percent);
  b = Math.min(255, b + (255 - b) * percent);

  // 将 RGB 转换回 hex
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}