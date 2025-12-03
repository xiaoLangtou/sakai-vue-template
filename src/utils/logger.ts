export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}

interface LogContext {
    timestamp: string;
    level: keyof typeof LogLevel;
    message: string;
    data?: any;
    stack?: string;
    userAgent?: string;
    url?: string;
}

class Logger {
    private static instance: Logger;
    private logLevel: LogLevel = LogLevel.INFO;
    private isDev = import.meta.env.DEV;
    private isProd = import.meta.env.PROD;

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private constructor() {
        // 生产环境设置更高的日志级别
        this.logLevel = this.isProd ? LogLevel.WARN : LogLevel.DEBUG;
    }

    private shouldLog(level: LogLevel): boolean {
        return level >= this.logLevel;
    }

    private createLogContext(level: keyof typeof LogLevel, message: string, data?: any): LogContext {
        return {
            timestamp: new Date().toISOString(),
            level,
            message,
            data,
            stack: new Error().stack,
            userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
            url: typeof window !== 'undefined' ? window.location.href : undefined
        };
    }

    private formatMessage(context: LogContext): string {
        return `[${context.level}] ${context.timestamp} - ${context.message}`;
    }

    private logToConsole(context: LogContext): void {
        if (!this.isDev) return;

        const formattedMessage = this.formatMessage(context);

        // 使用原生 console 方法，避免无限递归
        switch (context.level) {
            case 'DEBUG':
                window.console.debug(formattedMessage, context.data);
                break;
            case 'INFO':
                window.console.info(formattedMessage, context.data);
                break;
            case 'WARN':
                window.console.warn(formattedMessage, context.data);
                break;
            case 'ERROR':
                window.console.error(formattedMessage, context.data);
                break;
        }
    }

    private sendToMonitoring(context: LogContext): void {
        if (!this.isProd) return;

        // 这里可以集成 Sentry、LogRocket 或其他监控服务
        try {
            // 示例：发送到监控服务
            if (window.gtag) {
                window.gtag('event', 'log', {
                    level: context.level,
                    message: context.message,
                    custom_parameter: context.data
                });
            }

            // 或者发送到自定义的日志收集 API
            if (context.level === 'ERROR') {
                fetch('/api/logs/error', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(context)
                }).catch(() => {
                    // 静默处理日志发送失败
                });
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            // 静默处理监控系统错误，避免日志系统本身导致问题
        }
    }

    private log(level: LogLevel, levelName: keyof typeof LogLevel, message: string, data?: any): void {
        if (!this.shouldLog(level)) return;

        const context = this.createLogContext(levelName, message, data);

        this.logToConsole(context);
        this.sendToMonitoring(context);
    }

    /**
     * 调试日志 - 仅在开发环境显示
     */
    debug(message: string, data?: any): void {
        this.log(LogLevel.DEBUG, 'DEBUG', message, data);
    }

    /**
     * 信息日志 - 一般性信息
     */
    info(message: string, data?: any): void {
        this.log(LogLevel.INFO, 'INFO', message, data);
    }

    /**
     * 警告日志 - 需要注意但不影响功能
     */
    warn(message: string, data?: any): void {
        this.log(LogLevel.WARN, 'WARN', message, data);
    }

    /**
     * 错误日志 - 严重错误，影响功能
     */
    error(message: string, error?: any): void {
        let errorData = error;

        if (error instanceof Error) {
            errorData = {
                name: error.name,
                message: error.message,
                stack: error.stack
            };
        }

        this.log(LogLevel.ERROR, 'ERROR', message, errorData);
    }

    /**
     * 设置日志级别
     */
    setLogLevel(level: LogLevel): void {
        this.logLevel = level;
    }

    /**
     * 性能监控 - 测量代码执行时间
     */
    time(label: string): void {
        if (this.isDev) {
            window.console.time(label);
        }
    }

    /**
     * 结束性能监控
     */
    timeEnd(label: string): void {
        if (this.isDev) {
            window.console.timeEnd(label);
        }
    }

    /**
     * 用户行为追踪
     */
    track(event: string, properties?: Record<string, any>): void {
        this.info(`User Action: ${event}`, properties);
    }
}

// 导出单例实例
export const logger = Logger.getInstance();

// 为了方便使用，导出常用方法
export const { debug, info, warn, error, time, timeEnd, track } = logger;

// 类型声明扩展 window 对象
declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
    }
}
