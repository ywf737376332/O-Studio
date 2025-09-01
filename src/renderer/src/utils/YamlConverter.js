import { dump, load, JSON_SCHEMA, FAILSAFE_SCHEMA } from 'js-yaml';

class YamlConverter {
    /**
     * JSON 转 YAML
     * @param json JSON对象或字符串
     * @param options 配置选项
     * @returns YAML字符串
     */
    static jsonToYaml(json, options = {}) {
        try {
            // 如果输入是字符串，先解析为对象
            const obj = typeof json === 'string' ? JSON.parse(json) : json;

            // 默认配置
            const defaultOptions = {
                indent: 2,
                skipInvalid: false,
                flowLevel: -1,
                noRefs: true, // 避免引用标记
                noCompatMode: true, // 使用新版本的 YAML 1.2
                quotingType: '"' // 使用双引号
            };

            // 合并选项
            const finalOptions = { ...defaultOptions, ...options };

            // 转换为 YAML
            return dump(obj, finalOptions);
        } catch (error) {
            console.error('JSON to YAML conversion failed:', error);
            throw new Error('JSON转YAML失败，请检查！');
        }
    }

    /**
     * YAML 转 JSON
     * @param yamlString YAML字符串
     * @returns JSON对象
     */
    static yamlToJson(yamlString) {
        try {
            // 1. 输入验证
            if (!yamlString || typeof yamlString !== 'string') {
                throw new Error('YAML内容必须是字符串');
            }

            // 2. 配置选项
            const options = {
                schema: JSON_SCHEMA,  // 使用 JSON_SCHEMA 而不是 FAILSAFE_SCHEMA
                json: true,          // 启用 JSON 兼容模式
                strict: false        // 不要太严格的解析
            };

            // 3. 转换
            const result = load(yamlString, options);

            // 4. 结果处理
            if (result === undefined || result === null) {
                return null;
            }
            return JSON.stringify(result);

        } catch (error) {
            console.error('YAML to JSON conversion error:', error);
            throw new Error('YAML转JSON失败，请检查！');
        }
    }

    /**
     * 格式化 YAML
     * @param yaml YAML字符串
     * @param indent 缩进空格数
     * @returns 格式化后的 YAML 字符串
     */
    static formatYaml(yaml, indent = 2) {
        try {
            if (!yaml || typeof yaml !== 'string') {
                throw new Error('YAML内容必须是字符串');
            }

            // 先转换为 JSON
            const json = this.yamlToJson(yaml);
            if (json === null) {
                return '';
            }

            // 再转换回 YAML
            return this.jsonToYaml(json, { indent });
        } catch (error) {
            console.error('YAML formatting failed:', error);
            throw new Error('YAML格式化失败，请检查！');
        }
    }

    /**
     * 验证 YAML 语法
     * @param yaml YAML字符串
     * @returns boolean
     */
    static validateYaml(yaml) {
        if (!yaml || typeof yaml !== 'string') {
            return false;
        }

        try {
            return load(yaml) !== undefined;
        } catch (error) {
            return false;
        }
    }

    /**
    * 压缩 YAML（流式格式）
    * @param yaml YAML字符串
    * @returns 压缩后的YAML字符串
    */
    static compressYaml(yaml) {
        try {
            if (!yaml) return '';

            // 先转换为对象
            const obj = load(yaml);

            // 使用流式格式输出
            return dump(obj, {
                flowLevel: 0,  // 强制使用流式格式
                indent: 0,     // 无缩进
                lineWidth: -1, // 禁用换行
                noRefs: true,  // 禁用引用
                quotingType: '"' // 使用双引号
            });
        } catch (error) {
            console.error('YAML flow compression failed:', error);
            throw new Error('YAML流式压缩失败');
        }
    }
}

export default YamlConverter