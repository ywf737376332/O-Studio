import { Notification } from '@/utils/message'
import { isNumber } from './index'
import avatarImage from '@/assets/images/avatar.jpg';

/**
 * 压缩JSON
 * @param {String} value
 * @returns
 */
export const compressJson = (value) => {
    if (value) {
        return JSON.stringify(JSON.parse(value), null, 0)
    }
}

/**
 * 格式化JSON
 * @param {String} value
 * @returns
 */
export const formatJson = (value) => {
    if (value) {
        return JSON.stringify(JSON.parse(value), null, 4)
    }
}


function unescapeJsonString(str) {
    // 将转义的双引号还原为普通双引号
    return str.replace(/\\"/g, '"');
}

function parseNestedJson(obj, shouldParseEscaped) {
    // 遍历对象的每个键值对
    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            // 如果开关开启，尝试处理转义字段
            if (shouldParseEscaped) {
                try {
                    // 先对转义字符串进行反转义处理
                    const unescapedStr = unescapeJsonString(obj[key]);
                    // 尝试将反转义后的字符串解析为 JSON
                    const parsed = JSON.parse(unescapedStr);
                    obj[key] = parsed; // 替换为解析后的 JSON 对象
                    // 递归处理解析后的对象
                    parseNestedJson(obj[key], shouldParseEscaped);
                } catch (e) {
                    // 如果解析失败，保留原值
                }
            }
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            // 递归处理嵌套对象或数组
            parseNestedJson(obj[key], shouldParseEscaped);
        }
    }
    return obj;
}

/**
 * 对json报文进行格式化处理
 * @param {*} str 
 * @param {*} indent 
 * @param {*} shouldParseEscaped 是否对转义字段进行非转义处理
 * @returns 
 */
export function formatMixedJson(str, indent = 2, shouldParseEscaped = false, convertState) {
    try {
        // 解析传入的字符串为 JSON 对象
        const json = JSON.parse(str);
        // 处理嵌套的 JSON 字符串
        const parsedJson = parseNestedJson(json, shouldParseEscaped);
        // 返回格式化后的 JSON 字符串
        const jsonRes = JSON.stringify(parsedJson, null, indent)
        return convertChinese(jsonRes, convertState);
    } catch (e) {
        // 如果解析失败，返回原始字符串
        return str;
    }
}

/**
 * JSON转义
 * @param {String} value
 */
export const escapeJson = (value) => {
    if (value) {
        return JSON.stringify(value)
    }
}

/**
 * JSON去转义
 * @param {String} value
 */
export const unEscapeJson = (value) => {
    if (value) {
        return JSON.parse(value)
    }
}

/**
 * 判断是否是标准的json
 * @param {*} text
 */
const isValidJSON = (text) => {
    try {
        JSON.parse(text)
        return true
    } catch (error) {
        return false
    }
}

export const validJSON = (value) => {
    if (!isValidJSON(value) || isNumber(value)) {
        Notification({
            title: "格式错误提示",
            message: "当前数据不是标准的JSON！"
        })
        return false;
    }
    return true;
}


/**
 * JSON字符串排序
 * @param {string} jsonString - 要排序的JSON字符串
 * @param {Object} options - 排序选项
 * @param {string} options.sortType - 排序类型：'asc' 升序（默认），'desc' 降序
 * @param {Array} options.keyOrder - 指定键的排序顺序（可选）
 * @param {number} options.indent - 输出格式的缩进空格数（默认2）
 * @returns {string} 排序后的JSON字符串
 */
export function sortJsonString(jsonString, options = {}) {
    try {
        // 设置默认选项
        const {
            sortType = 'asc',
            keyOrder = null,
            indent = 4
        } = options;

        // 解析JSON字符串
        const jsonObj = JSON.parse(jsonString);

        // 执行排序
        const sortedObj = keyOrder
            ? sortByKeyOrder(jsonObj, keyOrder)
            : sortJson(jsonObj, sortType);

        // 返回格式化的JSON字符串
        return JSON.stringify(sortedObj, null, indent);

    } catch (error) {
        console.error('JSON排序失败:', error);
        throw new Error(`JSON排序失败: ${error.message}`);
    }
}

/**
 * 对象排序（内部函数）
 */
function sortJson(json, sortType = 'asc') {
    // 处理数组
    if (Array.isArray(json)) {
        return json.map(item => sortJson(item, sortType));
    }

    // 处理非对象
    if (typeof json !== 'object' || json === null) {
        return json;
    }

    // 获取排序后的键
    const keys = Object.keys(json).sort((a, b) => {
        return sortType === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
    });

    // 创建新的排序对象
    return keys.reduce((sorted, key) => {
        sorted[key] = sortJson(json[key], sortType);
        return sorted;
    }, {});
}

/**
 * 按指定键顺序排序（内部函数）
 */
function sortByKeyOrder(json, keyOrder) {
    // 处理数组
    if (Array.isArray(json)) {
        return json.map(item => sortByKeyOrder(item, keyOrder));
    }

    // 处理非对象
    if (typeof json !== 'object' || json === null) {
        return json;
    }

    // 创建新的排序对象
    const sorted = {};

    // 首先添加指定顺序的键
    keyOrder.forEach(key => {
        if (json.hasOwnProperty(key)) {
            sorted[key] = sortByKeyOrder(json[key], keyOrder);
        }
    });

    // 添加剩余的键
    Object.keys(json).forEach(key => {
        if (!keyOrder.includes(key)) {
            sorted[key] = sortByKeyOrder(json[key], keyOrder);
        }
    });

    return sorted;
}


/**
 * 转换字符串中的中文与 Unicode
 * @param {string} str - 输入的字符串
 * @param {number} mode - 转换模式：1（中文转 Unicode）、2（Unicode 转中文）、0（关闭转换）
 * @returns {string} - 转换后的字符串
 */
function convertChinese(str, mode = 'off') {
    // 中文转 Unicode
    if (mode === 'cnTounicode') {
        return str.replace(/[^\x00-\x7F]/g, char => {
            return '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0');
        });
    }
    // Unicode 转中文
    else if (mode === 'unicodeToCn') {
        return str.replace(/\\u([\dA-Fa-f]{4})/g, (match, p1) => {
            return String.fromCharCode(parseInt(p1, 16));
        });
    }
    // 关闭转换
    else {
        return str;
    }
}