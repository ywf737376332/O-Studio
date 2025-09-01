class JavaScriptConverter {
    /**
     * JSON 转 JavaScript 代码
     * @param jsonData JSON字符串或对象
     * @param varName 变量名
     * @param indent 缩进空格数
     * @returns JavaScript代码
     */
    static toJavaScript(
        jsonData,
        varName = 'data',
        indent = 4
    ) {
        try {
            // 解析 JSON（如果是字符串的话）
            const obj = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

            // 转换为 JavaScript 代码
            const jsCode = this.objectToJsString(obj, indent);

            // 添加变量声明
            return `const ${varName} = ${jsCode};`;
        } catch (error) {
            console.error('JSON to JavaScript conversion failed:', error);
            throw new Error('JSON转JavaScript失败，请检查！');
        }
    }

    /**
     * 对象转 JavaScript 字符串
     */
    static objectToJsString(obj, indent = 2, level = 0) {
        if (obj === null) return 'null';
        if (obj === undefined) return 'undefined';

        const currentIndent = ' '.repeat(level * indent);
        const nextIndent = ' '.repeat((level + 1) * indent);

        switch (typeof obj) {
            case 'string':
                // 处理多行字符串
                if (obj.includes('\n')) {
                    return `\`${obj.replace(/`/g, '\\`')}\``;
                }
                return `'${obj.replace(/'/g, "\\'")}'`;

            case 'number':
            case 'boolean':
                return String(obj);

            case 'object':
                if (Array.isArray(obj)) {
                    if (obj.length === 0) return '[]';

                    const arrayItems = obj
                        .map(item => `${nextIndent}${this.objectToJsString(item, indent, level + 1)}`)
                        .join(',\n');

                    return `[\n${arrayItems}\n${currentIndent}]`;
                }

                if (Object.keys(obj).length === 0) return '{}';

                const objectItems = Object.entries(obj)
                    .map(([key, value]) => {
                        const formattedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
                            ? key
                            : `'${key}'`;
                        return `${nextIndent}${formattedKey}: ${this.objectToJsString(value, indent, level + 1)}`;
                    })
                    .join(',\n');

                return `{\n${objectItems}\n${currentIndent}}`;

            default:
                return String(obj);
        }
    }

    /**
     * 生成 TypeScript 接口定义
     * @param jsonData JSON数据
     * @param interfaceName 接口名称
     * @param indent 缩进空格数
     */
    static generateInterface(
        jsonData,
        interfaceName = 'IData',
        indent = 2
    ) {
        try {
            const obj = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            return this.objectToInterface(obj, interfaceName, indent);
        } catch (error) {
            console.error('Interface generation failed:', error);
            throw new Error('接口生成失败');
        }
    }

    /**
     * 对象转接口定义
     */
    static objectToInterface(
        obj,
        interfaceName,
        indent,
        level = 0
    ) {
        const currentIndent = ' '.repeat(level * indent);
        const nextIndent = ' '.repeat((level + 1) * indent);

        if (Array.isArray(obj)) {
            if (obj.length === 0) return 'any[]';
            const itemType = this.objectToInterface(obj[0], `${interfaceName}Item`, indent, level);
            return `${itemType}[]`;
        }

        if (typeof obj === 'object' && obj !== null) {
            const properties = Object.entries(obj)
                .map(([key, value]) => {
                    const type = this.getTypeString(value, `${interfaceName}${key}`, indent, level + 1);
                    return `${nextIndent}${key}: ${type};`;
                })
                .join('\n');

            return level === 0
                ? `interface ${interfaceName} {\n${properties}\n${currentIndent}}`
                : `{\n${properties}\n${currentIndent}}`;
        }

        return this.getBasicType(obj);
    }

    /**
     * 获取类型字符串
     */
    static getTypeString(value, interfaceName, indent, level) {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';

        switch (typeof value) {
            case 'string':
                return 'string';
            case 'number':
                return 'number';
            case 'boolean':
                return 'boolean';
            case 'object':
                return this.objectToInterface(value, interfaceName, indent, level);
            default:
                return 'any';
        }
    }

    /**
     * 获取基本类型
     */
    static getBasicType(value) {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        return typeof value;
    }



    /*******************************************************************************************/

    /**
     * JavaScript 代码转 JSON
     */
    static jsToJson(jsCode, indent = 2) {
        try {
            // 0. 增加了这一句:this.convertUrls(jsCode)，用来替换对象中所有的https://为https:[$]
            // 1. 提取数组或对象字面量
            const literalStr = this.extractLiteral(this.convertUrls(jsCode));
            if (!literalStr) {
                throw new Error('无法提取有效的字面量！');
            }

            // 2. 转换为标准 JSON 格式
            const jsonStr = this.convertToJson(literalStr);

            // 增加了这一句:this.restoreUrls(jsonStr)，用来还原对象中所有的https:[$]为https://
            // 3. 解析并格式化
            const obj = JSON.parse(this.restoreUrls(jsonStr));

            return JSON.stringify(obj, null, indent);

        } catch (error) {
            console.error('转换失败:', error);
            throw new Error(`JavaScript转JSON失败: ${error.message}`);
        }
    }

    /**
     * 提取数组或对象字面量
     */
    static extractLiteral(code) {
        // 移除注释和空白
        code = code.replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\/\/.*/g, '')
            .trim();

        // 匹配数组或对象字面量
        const match = code.match(/=\s*(\[[\s\S]*\]|\{[\s\S]*\})/);
        return match ? match[1].trim() : null;
    }

    /**
     * 转换为标准 JSON 格式
     */
    static convertToJson(str) {
        let result = str;

        // 1. 先处理字符串值，包括 URL
        result = result.replace(/:\s*'((?:[^'\\]|\\.)*)'/g, (_, content) => {
            return ':"' + content.replace(/"/g, '\\"') + '"';
        });

        // 2. 处理属性名（添加双引号）
        result = result.replace(/([{,]\s*)([a-zA-Z0-9_$]+)\s*:/g, '$1"$2":');

        // 3. 移除尾随逗号
        result = result.replace(/,(\s*[}\]])/g, '$1');

        // 4. 移除多余的空格（保持一个空格的缩进）
        result = result.replace(/\s+/g, ' ').trim();

        return result;
    }

    /**
     * 替换对象中的 URL 格式
     * @param {String} obj - 要处理的对象
     * @returns {String} - 处理后的对象
     */
    static convertUrls(jsonStr) {
        // 方案一：使用 JSON.stringify 和正则替换
        return jsonStr.replace(/(https?:)\/\//g, '$1[$]');
    }


    /**
         * 还原对象中的 URL 格式
         * @param {Object} obj - 要处理的对象
         * @returns {Object} - 处理后的对象
         */
    static restoreUrls(jsonStr) {
        return jsonStr.replace(/(https?:)\[\$\]/g, '$1//');
    }



    /**
     * 压缩 JavaScript 代码
     * @param {string} jsCode - JavaScript 代码
     * @param {Object} options - 压缩选项
     * @returns {string} 压缩后的代码
     */
    static compressJs(jsCode, options = {}) {
        const {
            removeComments = true,      // 移除注释
            removeWhitespace = true,    // 移除多余空白
            removeNewlines = true,      // 移除换行
            removeSemicolon = false,    // 移除分号
            keepIndent = false,         // 保持缩进
            keepReadable = false        // 保持可读性
        } = options;

        try {
            // 0. 增加了这一句:this.convertUrls(jsCode)，用来替换对象中所有的https://为https:[$]
            let result = this.convertUrls(jsCode);

            // 1. 移除注释
            if (removeComments) {
                result = this.removeComments(result);
            }

            // 2. 处理字符串内容（防止影响字符串内的空白字符）
            const strings = [];
            result = this.preserveStrings(result, strings);

            // 3. 压缩代码
            if (removeWhitespace) {
                result = this.removeWhitespace(result, keepIndent);
            }

            if (removeNewlines && !keepReadable) {
                result = this.removeNewlines(result);
            }

            if (removeSemicolon) {
                result = this.removeSemicolons(result);
            }

            // 4. 恢复字符串
            result = this.restoreStrings(result, strings);

            // 5. 如果需要保持可读性，添加适当的空格
            if (keepReadable) {
                result = this.makeReadable(result);
            }
            // 增加了这一句:this.restoreUrls(jsonStr)，用来还原对象中所有的https:[$]为https://
            return this.restoreUrls(result);

        } catch (error) {
            console.error('压缩失败:', error);
            throw new Error(`JavaScript压缩失败: ${error.message}`);
        }
    }

    /**
     * 移除注释
     */
    static removeComments(code) {
        return code
            .replace(/\/\*[\s\S]*?\*\//g, '') // 移除多行注释
            .replace(/\/\/.*/g, '');           // 移除单行注释
    }

    /**
     * 保存字符串内容
     */
    static preserveStrings(code, strings = []) {
        return code.replace(/(['"`])(?:\\[\s\S]|(?!\1)[^\\])*\1/g, match => {
            strings.push(match);
            return `__STRING_${strings.length - 1}__`;
        });
    }

    /**
     * 恢复字符串内容
     */
    static restoreStrings(code, strings) {
        return code.replace(/__STRING_(\d+)__/g, (_, index) => strings[index]);
    }

    /**
     * 移除多余空白
     */
    static removeWhitespace(code, keepIndent = false) {
        if (keepIndent) {
            // 保持缩进，但移除其他多余空白
            return code
                .replace(/[ \t]+/g, ' ')           // 多个空格变成一个
                .replace(/[ \t]*([\[\]{}(),;:])/g, '$1') // 移除运算符周围的空格
                .replace(/([\[\]{}(),;:])[ \t]*/g, '$1'); // 移除运算符后的空格
        }

        // 完全移除所有多余空白
        return code.replace(/\s+/g, ' ').trim();
    }

    /**
     * 移除换行
     */
    static removeNewlines(code) {
        return code.replace(/[\r\n]+/g, '');
    }

    /**
     * 移除分号
     */
    static removeSemicolons(code) {
        return code
            .replace(/;(\s*[}\]])/g, '$1')  // 移除块末尾的分号
            .replace(/;(\s*$)/gm, '');       // 移除行末的分号
    }

    /**
     * 使代码保持可读性
     */
    static makeReadable(code) {
        return code
            // 在操作符前后添加空格
            .replace(/([+\-*/%=&|<>!])/g, ' $1 ')
            // 在逗号后添加空格
            .replace(/,/g, ', ')
            // 在左括号前添加空格
            .replace(/(\w+)\(/g, '$1 (')
            // 在右大括号后添加换行
            .replace(/}(?![\],}])/g, '}\n')
            // 移除多余的空格
            .replace(/\s{2,}/g, ' ')
            .trim();
    }

}

export default JavaScriptConverter