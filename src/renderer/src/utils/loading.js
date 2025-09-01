import { ElLoading } from 'element-plus'

// utils/loading.js

class LoadingService {
    constructor() {
        this.instance = null;
        this.timer = null;
        this.counter = 0;
        this.INTERVAL = 100; // 计数间隔（毫秒）
    }

    /**
     * 显示loading
     * @param {string|object} options - 文本内容或配置对象
     * @returns {void}
     * 
     * @example
     * loading.show('加载中')
     * loading.show({ text: '加载中', timeout: 60 }) // timeout单位：秒
     */
    show(options = 'Loading') {
        // 处理参数
        const config = typeof options === 'string' ? { text: options } : options;

        const {
            text = 'Loading',
            timeout = 60, // 默认60秒
            background = 'rgba(0, 0, 0, 0.7)'
        } = config;

        // 清除已存在的实例
        this.close();

        // 重置计数器
        this.counter = 0;

        // 创建加载实例
        this.instance = ElLoading.service({
            lock: true,
            background,
            text: `${text} (0.0s)`
        });

        // 启动计时器
        this.startTimer(text, timeout);
    }

    /**
     * 关闭loading
     */
    close() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        if (this.instance) {
            this.instance.close();
            this.instance = null;
        }

        this.counter = 0;
    }

    /**
     * 开始计时
     * @param {string} text - 显示文本
     * @param {number} timeout - 超时时间（秒）
     */
    startTimer(text, timeout) {
        const maxCount = (timeout * 1000) / this.INTERVAL;

        this.timer = setInterval(() => {
            this.counter++;

            if (this.counter <= maxCount) {
                const seconds = (this.counter * this.INTERVAL / 1000).toFixed(1);
                this.instance?.setText(`${text} (${seconds}s)`);
            } else {
                this.close();
            }
        }, this.INTERVAL);
    }
}

// 导出单例
export const loading = new LoadingService();