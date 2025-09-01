class DataProcessor {
    constructor(options = {}) {
        this.options = {
            maxDepth: 10,
            ...options
        };
        // 用于记录每个层级的当前ID
        this.levelIds = {};
    }

    // 重置所有更深层级的ID
    resetDeeperLevels(depth) {
        const levels = Object.keys(this.levelIds);
        levels.forEach(level => {
            if (Number(level) > depth) {
                this.levelIds[level] = 0;
            }
        });
    }

    // 生成层级ID
    generateId(depth) {
        // 如果该层级未初始化，初始化为0
        if (this.levelIds[depth] === undefined) {
            this.levelIds[depth] = 0;
        }
        // 该层级ID加1
        this.levelIds[depth]++;

        // 重置所有更深层级的ID
        this.resetDeeperLevels(depth);

        // 生成ID字符串
        let id = '';
        for (let i = 0; i <= depth; i++) {
            id += this.levelIds[i];
        }
        return Number(id);
    }

    process(data, depth = 0) {
        //debugger
        if (depth > this.options.maxDepth) {
            console.warn('达到最大递归深度');
            return [];
        }

        // 如果开始新的深度，重置该深度的计数
        // if (this.levelIds[depth] === undefined) {
        //     this.levelIds[depth] = 0;
        // }
        this.levelIds[depth] = 0;

        // 处理数组
        if (Array.isArray(data)) {
            return data.map((item, index) => {
                const id = this.generateId(depth);
                const children = this.isObject(item) ? this.processValue(item, depth + 1) : [];
                return {
                    id,
                    key: `[${index}]`,
                    value: this.isObject(item) ? '{Object}' : item,
                    ...(children.length > 0 && { children })
                };
            });
        }

        // 处理对象
        if (this.isObject(data)) {
            return this.processValue(data, depth);
        }

        return [];
    }

    processValue(obj, depth) {
        if (Array.isArray(obj)) {
            return obj.map((item, index) => {
                const id = this.generateId(depth);
                const children = this.isObject(item) ? this.processValue(item, depth + 1) : [];
                return {
                    id,
                    key: `[${index}]`,
                    value: this.isObject(item) ? '{Object}' : item,
                    ...(children.length > 0 && { children })
                };
            });
        }

        return Object.entries(obj).map(([key, value]) => {
            const id = this.generateId(depth);
            const children = this.isObject(value) ? this.processValue(value, depth + 1) : [];
            return {
                id,
                key,
                value: this.isObject(value) ?
                    (Array.isArray(value) ? `Array(${value.length})` : '{Object}') :
                    value,
                ...(children.length > 0 && { children })
            };
        });
    }

    isObject(value) {
        return typeof value === 'object' && value !== null;
    }
}

export default DataProcessor;