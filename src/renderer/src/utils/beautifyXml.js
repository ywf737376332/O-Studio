import xmlFormat from 'xml-formatter'

/**
 * 压缩Xml
 * @param {String} value
 * @returns
 */
export const compressXml = (value) => {
  if (value) {
    return xmlFormat.minify(value, { collapseContent: true })
  }
}

/**
 * 格式化XML
 * @param {String} value
 * @returns
 */
export const formatXml = (value) => {
  if (value) {
    return xmlFormat(value, { collapseContent: true })
  }
}

/**
 * Xml转义
 * @param {String} value
 */
export const escapeXml = (value) => {
  if (value) {
    const dom = document.createElement('div')
    dom.textContent = value
    // TODO 此功能暂未完善
    return dom.innerHTML
  }
}

/**
 * Xml去转义
 * @param {String} value
 */
export const unEscapeXml = (value) => {
  if (value) {
    // TODO 此功能暂未完善
    return value
  }
}


/**
 * XML排序工具
 * @param {string} xmlString - 要排序的XML字符串
 * @param {Object} options - 排序选项
 * @param {string} options.sortType - 排序类型：'asc'升序（默认）,'desc'降序
 * @returns {string} 排序后的XML字符串
 */
export function sortXml(xmlString, options = {}) {
  try {
      const { sortType = 'asc' } = options;

      // 1. 解析XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

      // 2. 检查解析错误
      const parseError = xmlDoc.getElementsByTagName('parsererror');
      if (parseError.length > 0) {
          throw new Error('XML解析错误');
      }

      // 3. 递归排序所有元素
      sortElement(xmlDoc.documentElement, sortType);

      // 4. 转换回字符串并格式化
      const serializer = new XMLSerializer();
      let result = serializer.serializeToString(xmlDoc);
      result = formatXml(result);

      return result;

  } catch (error) {
      console.error('XML排序失败:', error);
      throw new Error(`XML排序失败: ${error.message}`);
  }
}

/**
* 递归排序XML元素
*/
function sortElement(element, sortType) {
  // 获取所有子元素
  const children = Array.from(element.children);
  
  if (children.length === 0) return;

  // 对子元素进行排序
  children.sort((a, b) => {
      return sortType === 'asc' 
          ? a.tagName.localeCompare(b.tagName)
          : b.tagName.localeCompare(a.tagName);
  });

  // 移除所有子元素
  while (element.firstChild) {
      element.removeChild(element.firstChild);
  }

  // 按排序后的顺序重新添加子元素
  children.forEach(child => {
      // 递归排序子元素
      sortElement(child, sortType);
      element.appendChild(child);
  });
}