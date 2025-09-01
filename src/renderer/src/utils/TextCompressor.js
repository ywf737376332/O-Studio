import pako from 'pako'

const TextCompressor = {
    // 支持的压缩格式
    COMPRESSION_TYPES: {
        DEFLATE: 'deflate',
        GZIP: 'gzip'
    },

    // 支持的输出格式
    OUTPUT_FORMATS: {
        BASE64: 'base64',
        HEX: 'hex'
    },

    /**
     * 压缩文本
     * @param {string} text - 要压缩的文本
     * @param {Object} options - 配置选项
     * @param {string} options.type - 压缩类型 ('deflate'|'gzip')
     * @param {string} options.encoding - 字符编码 (默认 'utf-8')
     * @param {string} options.outputFormat - 输出格式 ('base64'|'hex')
     * @param {number} options.level - 压缩级别 (1-9)
     * @returns {string} 压缩结果
     */
    compress(text, options = {}) {
        const {
            type = this.COMPRESSION_TYPES.DEFLATE,
            encoding = 'utf-8',
            outputFormat = this.OUTPUT_FORMATS.BASE64,
            level = 9,
            ...otherOptions
        } = options

        try {
            // 1. 将字符串转换为 Uint8Array
            const textBytes = new TextEncoder().encode(text)

            // 2. 根据类型选择压缩方法
            let compressed
            if (type === this.COMPRESSION_TYPES.GZIP) {
                compressed = pako.gzip(textBytes, {
                    level,
                    ...otherOptions
                })
            } else {
                compressed = pako.deflate(textBytes, {
                    level,
                    ...otherOptions
                })
            }

            // 3. 转换为指定输出格式
            return this.formatOutput(compressed, outputFormat)

        } catch (error) {
            console.error('压缩失败:', error)
            throw new Error(`压缩失败 [${type}]: ${error.message}`)
        }
    },

    /**
     * 解压缩文本
     * @param {string} compressed - 压缩后的文本
     * @param {Object} options - 配置选项
     * @param {string} options.type - 压缩类型 ('deflate'|'gzip')
     * @param {string} options.encoding - 字符编码 (默认 'utf-8')
     * @param {string} options.inputFormat - 输入格式 ('base64'|'hex')
     * @returns {string} 解压后的原始文本
     */
    decompress(compressed, options = {}) {
        const {
            type = this.COMPRESSION_TYPES.DEFLATE,
            encoding = 'utf-8',
            inputFormat = this.OUTPUT_FORMATS.BASE64
        } = options

        try {
            // 1. 从指定格式解码为 Uint8Array
            const compressedBytes = this.parseInput(compressed, inputFormat)

            // 2. 根据类型选择解压方法
            let decompressed
            if (type === this.COMPRESSION_TYPES.GZIP) {
                decompressed = pako.ungzip(compressedBytes)
            } else {
                decompressed = pako.inflate(compressedBytes)
            }

            // 3. 转换回字符串
            return new TextDecoder(encoding).decode(decompressed)

        } catch (error) {
            console.error('解压失败:', error)
            throw new Error(`解压失败 [${type}]: ${error.message}`)
        }
    },

    /**
     * 格式化输出
     * @private
     */
    formatOutput(uint8, format) {
        if (format === this.OUTPUT_FORMATS.HEX) {
            return Array.from(uint8)
                .map(b => b.toString(16).padStart(2, '0'))
                .join('')
        }
        return btoa(String.fromCharCode.apply(null, uint8))
    },

    /**
     * 解析输入
     * @private
     */
    parseInput(input, format) {
        if (format === this.OUTPUT_FORMATS.HEX) {
            return new Uint8Array(
                input.match(/.{2}/g)
                    .map(byte => parseInt(byte, 16))
            )
        }
        return new Uint8Array(
            atob(input).split('').map(char => char.charCodeAt(0))
        )
    },

    /**
     * 获取数据大小信息
     * @param {string|Uint8Array} data - 要检查的数据
     * @param {Object} options - 配置选项
     * @param {string} options.inputFormat - 输入格式 ('base64'|'hex'|'raw')
     * @returns {Object} 大小信息
     */
    getSize(data, options = {}) {
        const { inputFormat = 'raw' } = options
        try {
            let bytes
            if (data instanceof Uint8Array) {
                bytes = data
            } else if (typeof data === 'string') {
                if (inputFormat === this.OUTPUT_FORMATS.BASE64) {
                    bytes = this.parseInput(data, this.OUTPUT_FORMATS.BASE64)
                } else if (inputFormat === this.OUTPUT_FORMATS.HEX) {
                    bytes = this.parseInput(data, this.OUTPUT_FORMATS.HEX)
                } else {
                    // 原始文本
                    bytes = new TextEncoder().encode(data)
                }
            } else {
                throw new Error('不支持的数据类型')
            }

            return {
                bytes: bytes.length,
                kilobytes: (bytes.length / 1024).toFixed(2),
                megabytes: (bytes.length / (1024 * 1024)).toFixed(2),
                originalFormat: inputFormat
            }
        } catch (error) {
            console.error('计算大小失败:', error)
            throw new Error(`计算大小失败: ${error.message}`)
        }
    },

    /**
     * 获取压缩率
     * @param {string} original - 原始文本
     * @param {string} compressed - 压缩后的文本
     * @param {string} inputFormat - 压缩文本的格式 ('base64'|'hex')
     * @returns {number} 压缩率（百分比）
     */
    getCompressionRatio(original, compressed, inputFormat = this.OUTPUT_FORMATS.BASE64) {
        const originalSize = new TextEncoder().encode(original).length
        const compressedSize = this.parseInput(compressed, inputFormat).length
        return ((originalSize - compressedSize) / originalSize * 100).toFixed(2)
    },

    /**
     * 压缩文本并返回详细信息
     * @param {string} originalText - 要压缩的文本
     * @param {string} compressedText - 压缩后的文本
     * @param {Object} options - 配置选项
     * @returns {Object} 压缩结果和详细信息
     */
    compressWithStats(originalText, options = {}) {
        // 获取原始大小
        const originalSize = this.getSize(originalText)

        // 执行压缩
        const compressedText = this.compress(originalText, options)

        // 获取压缩后大小
        const compressedSize = this.getSize(compressedText, {
            inputFormat: options.outputFormat || this.OUTPUT_FORMATS.BASE64
        })

        // 计算压缩率
        const ratio = this.getCompressionRatio(originalText, compressedText,
            options.outputFormat || this.OUTPUT_FORMATS.BASE64)

        return {
            result: compressedText,
            original: {
                ...originalSize,
                format: 'text'
            },
            compressed: {
                ...compressedSize,
                format: options.outputFormat || this.OUTPUT_FORMATS.BASE64
            },
            compressionRatio: ratio,
            type: options.type || this.COMPRESSION_TYPES.DEFLATE
        }
    }
}

export default TextCompressor