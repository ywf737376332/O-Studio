// xml-json-converter.js
import { xml2js, js2xml } from 'xml-js'

// XML转JSON终极版
export function xmlToJson(xmlString) {
  try {
    const options = {
      compact: true,
      ignoreDeclaration: true,
      ignoreAttributes: false,
      attributeNamePrefix: '',
      textKey: '_text', // 改为更明确的字段名
      attributesKey: '$attrs',
      alwaysChildren: true,
      nativeType: true
    }

    debugger
    const rawResult = xml2js(xmlString, options)
    return formatJson(optimizeStructure(rawResult), 4);
  } catch (error) {
    console.error('XML转换失败:', error)
    return null
  }
}

// JSON转XML终极版
export function jsonToXml(jsonObj, rootName = 'root') {
  try {
    const options = {
      compact: true,
      ignoreDeclaration: true,
      attributesKey: '$attrs',
      textKey: '_text',
      spaces: 2
    }

    return js2xml(
      { [rootName]: prepareForXmlConversion(jsonObj) },
      options
    )
  } catch (error) {
    console.error('JSON转换失败:', error)
    return ''
  }
}

// 核心优化逻辑
function optimizeStructure(node) {
  if (Array.isArray(node)) {
    return node.map(optimizeStructure)
  }

  if (typeof node === 'object' && node !== null) {
    // 合并属性到主对象
    if (node.$attrs) {
      Object.assign(node, node.$attrs)
      delete node.$attrs
    }

    // 递归处理子节点
    for (const key in node) {
      node[key] = optimizeStructure(node[key])
    }

    // 处理文本内容重命名
    if (node._text !== undefined) {
      node.grade = node._text // 关键修改点
      delete node._text
    }

    // 自动处理成绩结构
    if (isGradeItem(node)) {
      return processGradeItem(node)
    }

    // 简化单值对象
    return simplifySingleValue(node)
  }

  return node
}

// 判断是否为成绩条目
function isGradeItem(node) {
  return node.grade &&
    typeof node.grade === 'object' &&
    node.grade.subject &&
    node.grade._text !== undefined
}

// 处理成绩条目结构
function processGradeItem(node) {
  return {
    grades: Array.isArray(node.grade)
      ? node.grade.map(item => ({
        subject: item.subject,
        grade: item._text
      }))
      : [{
        subject: node.grade.subject,
        grade: node.grade._text
      }]
  }
}

// JSON转XML预处理
function prepareForXmlConversion(node) {
  if (Array.isArray(node)) {
    return node.map(prepareForXmlConversion)
  }

  if (typeof node === 'object' && node !== null) {
    const result = {}

    for (const [key, value] of Object.entries(node)) {
      // 处理成绩结构逆向转换
      if (key === 'grades' && Array.isArray(value)) {
        result[key] = {
          grade: value.map(item => ({
            _text: item.grade,
            subject: item.subject
          }))
        }
      }
      // 处理普通字段
      else if (typeof value !== 'object') {
        result[key] = { _text: value }
      }
      // 递归处理嵌套对象
      else {
        result[key] = prepareForXmlConversion(value)
      }
    }

    return result
  }

  return { _text: node }
}

// 简化单值对象
function simplifySingleValue(node) {
  const keys = Object.keys(node)
  if (keys.length === 1 && keys[0] === 'grade') {
    return node.grade
  }
  return node
}


/**
 * 格式化 JSON
 * @param json JSON对象或字符串
 * @param spaces 缩进空格数
 * @returns 格式化后的 JSON 字符串
 */
function formatJson(json, spaces = 4) {
  try {
    const obj = typeof json === 'string' ? JSON.parse(json) : json;
    return JSON.stringify(obj, null, spaces);
  } catch (error) {
    throw new Error('JSON格式化失败，请检查！');
  }
}

// const xmlData = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><classroom><course>Introduction to Computer Science</course><instructor>Dr. Smith</instructor><students><student><student_id>001</student_id><name>Emily Johnson</name><age>19</age><gender>Female</gender><grades><grade subject="Math">A</grade><grade subject="Programming">B+</grade><grade subject="English">A-</grade></grades></student><student><student_id>002</student_id><name>Michael Smith</name><age>20</age><gender>Male</gender><grades><grade subject="Math">B</grade><grade subject="Programming">A</grade><grade subject="English">B</grade></grades></student></students></classroom>'

// const jsonData = JSON.stringify(xmlToJson(xmlData));

// const jsonDatas = '"{\"code\":200,\"msg\":\"ok\",\"success\":true,\"newslist\":[{\"ctime\":\"2015-07-17\",\"title\":\"那个抱走王明涵的，你上微信吗？看完这个你会心软吗？\",\"description\":\"中国传统文化\",\"picUrl\":\"http://zxpic.gtimg.com/infonew/0/wechat_pics_-667708.jpg/640\",\"url\":\"http://mp.weixin.qq.com/s?__biz=MzA3OTg2NjEwNg==&amp;idx=5&amp;mid=209313388&amp;sn=7e30bd2851d22f69580e202c31fc7ecf&amp;qb_mtt_show_type=1\"},{\"ctime\":\"2015-06-12\",\"title\":\"深悦地产风云榜丨房地产微信公众号一周榜单\",\"description\":\"深悦会\",\"picUrl\":\"http://zxpic.gtimg.com/infonew/0/wechat_pics_-530408.jpg/640\",\"url\":\"http://mp.weixin.qq.com/s?__biz=MjM5NTI4NDk0Mg==&amp;idx=4&amp;mid=206963932&amp;sn=595e66f68648b86fba04fbc3a58e623c&amp;qb_mtt_show_type=1\"},{\"ctime\":\"2015-06-14\",\"title\":\"一条微信向全世界宣告，这就是惠州！\",\"description\":\"西子湖畔\",\"picUrl\":\"http://zxpic.gtimg.com/infonew/0/wechat_pics_-536516.jpg/640\",\"url\":\"http://mp.weixin.qq.com/s?__biz=MjM5NTAzMDQ0MA==&amp;idx=1&amp;mid=209423088&amp;sn=fc5c230b38e4485a01bdc7693714047b&amp;qb_mtt_show_type=1\"}]}"'

// console.log("jsonData结果：", jsonData)
// console.log("jsonData结果：", jsonToXml(jsonDatas))