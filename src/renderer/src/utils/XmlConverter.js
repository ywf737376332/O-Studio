import { xml2js, js2xml } from 'xml-js';

class XmlConverter {

    /**
 * XML 转 JSON
 * @param xml XML字符串
 * @param options 配置选项
 * @returns JSON对象
 */
    static xmlToJson(xml, options = {}) {
        try {
            // 移除 XML 声明头
            const cleanXml = this.removeXmlDeclaration(xml);

            // 默认配置
            const defaultOptions = {
                compact: true,
                spaces: 4,
                ignoreComment: true,
                alwaysChildren: false,
                nativeType: false,
                nativeTypeAttributes: false,
                textKey: '_text',
                attributesKey: '_attributes',
                cdataKey: '_cdata'
            };

            // 合并选项
            const finalOptions = { ...defaultOptions, ...options };

            // 使用 xml2js 转换
            let result = xml2js(cleanXml, finalOptions);

            // 清理结果并转换类型
            result = this.cleanJsonResult(result);

            // 移除根节点
            if (result && typeof result === 'object') {
                const rootKeys = Object.keys(result);
                if (rootKeys.length === 1) {
                    result = result[rootKeys[0]];
                }
            }

            // 处理只包含单个数组的对象
            if (this.isSingleArrayObject(result)) {
                result = this.extractArray(result);
            }

            return this.formatJson(result, 4);
        } catch (error) {
            console.error('XML to JSON conversion failed:', error);
            throw new Error('XML转JSON失败，请检查！');
        }
    }

    /**
     * 检查对象是否只包含单个数组
     * @param obj 要检查的对象
     * @returns boolean
     */
    static isSingleArrayObject(obj) {
        if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
            return false;
        }

        const keys = Object.keys(obj);
        if (keys.length !== 1) {
            return false;
        }

        return Array.isArray(obj[keys[0]]);
    }

    /**
     * 从对象中提取数组
     * @param obj 包含数组的对象
     * @returns array
     */
    static extractArray(obj) {
        const key = Object.keys(obj)[0];
        return obj[key];
    }

    /**
     * 移除 XML 声明头
     * @param xml XML字符串
     * @returns 清理后的XML字符串
     */
    static removeXmlDeclaration(xml) {
        // 移除 <?xml ... ?> 声明
        return xml.replace(/<\?xml[^>]*\?>\s*/, '');
    }

    /**
 * 清理 JSON 结果，移除下划线标签并转换类型
 * @param obj JSON对象
 * @returns 清理后的对象
 */
    static cleanJsonResult(obj) {
        if (!obj || typeof obj !== 'object') {
            return obj;
        }

        if (Array.isArray(obj)) {
            return obj.map(item => this.cleanJsonResult(item));
        }

        const result = {};

        // 检查是否为空标签（没有子元素和文本内容）
        if (Object.keys(obj).length === 0 ||
            (Object.keys(obj).length === 1 && obj._attributes) ||
            (Object.keys(obj).length === 1 && obj._text === '')) {
            return '';
        }

        // 检查是否为数组类型的节点
        if (obj._attributes?.type === 'array') {
            const items = obj.item;
            if (Array.isArray(items)) {
                return items.map(item => this.cleanJsonResult(item));
            } else if (items) {
                return [this.cleanJsonResult(items)];
            }
            return [];
        }

        for (const [key, value] of Object.entries(obj)) {
            if (key === '_text') {
                // 获取父节点的类型属性
                const type = obj._attributes?.type;
                if (type) {
                    // 根据类型转换值
                    return this.convertValueByType(value || '', type);
                }
                // 如果没有值，返回空字符串
                return value || '';
            } else if (key === '_attributes') {
                // 跳过属性处理
                continue;
            } else {
                // 递归处理其他节点
                const cleanValue = this.cleanJsonResult(value);
                // 确保空值被设置为空字符串
                result[key] = cleanValue === undefined ? '' : cleanValue;
            }
        }

        return result;
    }

    /**
     * 根据类型转换值
     * @param value 要转换的值
     * @param type 类型
     * @returns 转换后的值
     */
    static convertValueByType(value, type) {
        if (value === '') {
            // 对于空值，根据类型返回对应的默认值
            switch (type.toLowerCase()) {
                case 'number':
                    return 0;
                case 'boolean':
                    return false;
                case 'array':
                    return [];
                case 'object':
                    return {};
                case 'null':
                    return null;
                case 'date':
                    return null;
                default:
                    return '';
            }
        }

        switch (type.toLowerCase()) {
            case 'number':
                return Number(value);
            case 'boolean':
                return value.toLowerCase() === 'true';
            case 'array':
                try {
                    return JSON.parse(value);
                } catch {
                    return [];
                }
            case 'object':
                try {
                    return JSON.parse(value);
                } catch {
                    return {};
                }
            case 'null':
                return null;
            case 'date':
                return new Date(value).toISOString();
            default:
                return value;
        }
    }

    /**
     * 格式化 JSON
     * @param json JSON对象或字符串
     * @param spaces 缩进空格数
     * @returns 格式化后的 JSON 字符串
     */
    static formatJson(json, spaces = 4) {
        try {
            const obj = typeof json === 'string' ? JSON.parse(json) : json;
            return JSON.stringify(obj, null, spaces);
        } catch (error) {
            throw new Error('JSON格式化失败，请检查！');
        }
    }

    /**============================================================================================== */

    /**
  * JSON 转 XML（带XML声明头和根标签）
  * @param json JSON对象或字符串
  * @param options 配置选项
  * @returns XML字符串
  */
    static jsonToXml(json, options) {
        try {
            let jsonObj = typeof json === 'string' ? JSON.parse(json) : json;

            // 默认配置
            const defaultOptions = {
                compact: true,
                spaces: 4,
                indentAttributes: true,
                indentCdata: true,
                fullTagEmptyElement: false,
                rootTag: 'root',
                arrayItemTag: 'item',
                declaration: {
                    version: '1.0',
                    encoding: 'UTF-8',
                    standalone: 'yes'
                }
            };

            // 合并选项
            const finalOptions = { ...defaultOptions, ...options };

            // 处理数组情况
            if (Array.isArray(jsonObj)) {
                // 将数组转换为带类型的XML格式
                jsonObj = {
                    [finalOptions.rootTag]: {
                        _attributes: { type: 'array' },
                        [finalOptions.arrayItemTag]: jsonObj.map(item => this.addTypeAttributes(item))
                    }
                };
            } else if (this.isPrimitive(jsonObj)) {
                // 处理原始类型（数字、字符串、布尔值等）
                jsonObj = {
                    [finalOptions.rootTag]: this.addTypeAttributes(jsonObj)
                };
            } else {
                // 处理对象
                jsonObj = this.addTypeAttributes(jsonObj);
                // 检查是否需要添加根标签
                if (!this.hasSingleRoot(jsonObj)) {
                    jsonObj = { [finalOptions.rootTag]: jsonObj };
                }
            }

            // 生成 XML 内容
            const xmlContent = js2xml(jsonObj, {
                compact: finalOptions.compact,
                spaces: finalOptions.spaces,
                indentAttributes: finalOptions.indentAttributes,
                indentCdata: finalOptions.indentCdata,
                fullTagEmptyElement: finalOptions.fullTagEmptyElement
            });

            // 生成 XML 声明头
            const { version, encoding, standalone } = finalOptions.declaration;
            const xmlDeclaration = `<?xml version="${version}" encoding="${encoding}"${standalone ? ` standalone="${standalone}"` : ''}?>`;

            return `${xmlDeclaration}\n${xmlContent}`;
        } catch (error) {
            console.error('JSON to XML conversion failed:', error);
            throw new Error('JSON转XML失败，请检查！');
        }
    }

    /**
     * 检查是否为原始类型
     * @param value 要检查的值
     * @returns boolean
     */
    static isPrimitive(value) {
        return value === null ||
            typeof value === 'undefined' ||
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean';
    }

    /**
 * 递归添加类型属性
 * @param obj JSON对象
 * @returns 处理后的对象
 */
    static addTypeAttributes(obj) {
        // 处理 null 和 undefined
        if (obj === null || obj === undefined) {
            return { _text: '', _attributes: { type: 'null' } };
        }

        // 处理原始类型
        if (this.isPrimitive(obj)) {
            return {
                _text: String(obj),
                _attributes: { type: typeof obj }
            };
        }

        // 处理数组
        if (Array.isArray(obj)) {
            return {
                _attributes: { type: 'array' },
                item: obj.map(item => this.addTypeAttributes(item))
            };
        }

        // 处理对象
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            if (key === '_text' || key === '_attributes' || key === '_cdata') {
                result[key] = value;
            } else {
                result[key] = this.addTypeAttributes(value);
            }
        }
        return result;
    }

    /**
     * 检查 JSON 对象是否只有一个根节点
     * @param json JSON对象
     * @returns boolean
     */
    static hasSingleRoot(json) {
        if (!json || typeof json !== 'object' || Array.isArray(json)) {
            return false;
        }
        const keys = Object.keys(json);
        return keys.length === 1;
    }
}

export default XmlConverter