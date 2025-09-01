import log from 'electron-log'

class Logger {
    constructor() {
        if (Logger.instance) {
            return Logger.instance
        }
        this.initialize();
        Logger.instance = this;
    }

    initialize() {
        // 可选：统一配置日志（主进程生效）
        if (process.type === 'browser') {
            log.transports.file.fileEncoding = 'utf8';
            log.transports.file.level = 'info';
            log.transports.file.format = '{y}-{m}-{d} {h}:{i}:{s} [{level}] > {text}';
            log.transports.file.maxSize = 5 * 1024 * 1024; // 5MB
        }
    }

    info(...args) {
        log.info(...args);
    }

    error(...args) {
        log.error(...args);
    }

    warn(...args) {
        log.warn(...args);
    }

    debug(...args) {
        log.debug(...args);
    }
}

// 单例模式导出
const logger = new Logger();
export default logger