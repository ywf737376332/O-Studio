class UnicodeConverter {
    /**
     * 中文转 Unicode
     * @param {string} str - 要转换的中文字符串
     * @param {Object} options - 转换选项
     * @returns {string} - 转换后的 Unicode 字符串
     */
    static chineseToUnicode(str, options = {}) {
        const {
            prefix = '\\u',           // Unicode 前缀
            uppercase = false,         // 是否使用大写
            pad = true,              // 是否补齐4位
            skipAscii = false        // 是否跳过 ASCII 字符
        } = options;

        try {
            return str.split('').map(char => {
                const code = char.charCodeAt(0);

                // 如果设置跳过 ASCII 字符且当前字符是 ASCII，则保持原样
                if (skipAscii && code < 128) {
                    return char;
                }

                // 转换为16进制
                let hex = code.toString(16);

                // 补齐4位
                if (pad && hex.length < 4) {
                    hex = '0'.repeat(4 - hex.length) + hex;
                }

                // 转换大小写
                hex = uppercase ? hex.toUpperCase() : hex.toLowerCase();

                return prefix + hex;
            }).join('');
        } catch (error) {
            console.error('中文转Unicode失败:', error);
            throw new Error(`转换失败: ${error.message}`);
        }
    }

    /**
     * Unicode 转中文
     * @param {string} str - 要转换的 Unicode 字符串
     * @returns {string} - 转换后的中文字符串
     */
    static unicodeToChinese(str) {
        try {
            return str.replace(/\\u[\dA-Fa-f]{4}|\\u[\dA-Fa-f]{2}/g, match => {
                // 去掉 \u 前缀，转换为16进制数字
                const hex = match.substring(2);
                // 转换为对应字符
                return String.fromCharCode(parseInt(hex, 16));
            });
        } catch (error) {
            console.error('Unicode转中文失败:', error);
            throw new Error(`转换失败: ${error.message}`);
        }
    }

    /**
     * 检测字符串是否包含中文
     * @param {string} str - 要检测的字符串
     * @returns {boolean} - 是否包含中文
     */
    static hasChinese(str) {
        return /[\u4E00-\u9FFF]/.test(str);
    }

    /**
     * 检测字符串是否是 Unicode 格式
     * @param {string} str - 要检测的字符串
     * @returns {boolean} - 是否是 Unicode 格式
     */
    static isUnicode(str) {
        return /\\u[\dA-Fa-f]{4}/.test(str);
    }
}

export default UnicodeConverter