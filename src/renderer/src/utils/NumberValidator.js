/**
 * 判断文本是否为数字的工具函数集
 */
const NumberValidator = {
    /**
     * 判断是否为整数
     * @param {string} text - 要检查的文本
     * @returns {boolean}
     */
    isInteger(text) {
        return /^-?\d+$/.test(text)
    },

    /**
     * 判断是否为浮点数（包括整数）
     * @param {string} text - 要检查的文本
     * @returns {boolean}
     */
    isFloat(text) {
        return /^-?\d*\.?\d+$/.test(text)
    },

    /**
     * 判断是否为数字（包括科学计数法）
     * @param {string} text - 要检查的文本
     * @returns {boolean}
     */
    isNumber(text) {
        // 1. 去除空格
        text = text.trim()

        // 2. 使用 isFinite 判断
        return !isNaN(text) && isFinite(text)
    },

    /**
     * 判断是否为指定进制的数字
     * @param {string} text - 要检查的文本
     * @param {number} radix - 进制（2-36）
     * @returns {boolean}
     */
    isRadixNumber(text, radix = 10) {
        if (radix < 2 || radix > 36) return false

        // 创建对应进制的正则表达式
        const pattern = new RegExp(`^-?[0-${Math.min(radix - 1, 9)}${radix > 10 ? 'a-' + String.fromCharCode(87 + radix) : ''
            }]+$`, 'i')

        return pattern.test(text)
    },

    /**
     * 综合检查（可配置检查选项）
     * @param {string} text - 要检查的文本
     * @param {Object} options - 配置选项
     * @returns {boolean}
     */
    validate(text, options = {}) {
        const {
            allowNegative = true,    // 允许负数
            allowDecimal = true,     // 允许小数
            allowScientific = true,  // 允许科学计数法
            allowThousands = true,   // 允许千分位分隔符
            radix = 10              // 进制
        } = options

        // 1. 去除空格
        text = text.trim()

        // 2. 如果允许千分位分隔符，先移除分隔符
        if (allowThousands) {
            text = text.replace(/,/g, '')
        }

        // 3. 构建正则表达式
        let pattern = '^'
        if (allowNegative) pattern += '-?'

        if (radix === 10) {
            // 十进制数字的处理
            if (allowDecimal) {
                pattern += '\\d*\\.?\\d+'
            } else {
                pattern += '\\d+'
            }

            if (allowScientific) {
                pattern += '(?:e[+-]?\\d+)?'
            }
        } else {
            // 其他进制的处理
            const digits = `0-${Math.min(radix - 1, 9)}${radix > 10 ? 'a-' + String.fromCharCode(87 + radix) : ''
                }`
            pattern += `[${digits}]+`
        }

        pattern += '$'

        return new RegExp(pattern, 'i').test(text)
    }
}

export default NumberValidator