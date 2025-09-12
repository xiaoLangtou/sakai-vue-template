// Toast 服务不再需要 Vue 的响应式系统

/**
 * Toast 消息类型
 */
export type ToastSeverity = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';

/**
 * Toast 事件数据
 */
export interface ToastEvent {
    severity: ToastSeverity;
    summary: string;
    detail: string;
    life?: number;
    group?: string;
    closable?: boolean;
    styleClass?: string;
}

/**
 * Toast 事件总线
 * 使用简单的事件发布订阅模式管理 Toast 事件
 */
class ToastEventBus {
    private listeners: Array<(event: ToastEvent) => void> = [];

    /**
     * 发送 Toast 事件
     */
    emit(event: ToastEvent): void {
        // 通知所有监听器
        this.listeners.forEach(listener => {
            try {
                listener(event);
            } catch ( error ) {
                console.warn('Toast listener error:', error);
            }
        });

        // 如果没有监听器，降级到控制台输出
        if ( this.listeners.length === 0 ) {
            console.log(`[${ event.severity.toUpperCase() }] ${ event.summary }: ${ event.detail }`);
        }
    }

    /**
     * 添加事件监听器
     */
    on(listener: (event: ToastEvent) => void): () => void {
        this.listeners.push(listener);

        // 返回取消监听的函数
        return () => {
            const index = this.listeners.indexOf(listener);
            if ( index > -1 ) {
                this.listeners.splice(index, 1);
            }
        };
    }
}

// 创建全局事件总线实例
export const toastEventBus = new ToastEventBus();

/**
 * 全局 Toast 服务
 * 通过事件总线发送 Toast 消息
 */
export class GlobalToastService {
    /**
     * 显示 Toast 消息
     */
    show(options: ToastEvent): void {
        toastEventBus.emit(options);
    }

    /**
     * 显示成功消息
     */
    success(detail: string, summary: string = '提示', life?: number, group?: string): void {
        this.show({
            severity: 'success',
            summary,
            detail,
            life,
            group
        });
    }

    /**
     * 显示信息消息
     */
    info(detail: string, summary: string = '提示', life?: number): void {
        this.show({
            severity: 'info',
            summary,
            detail,
            life
        });
    }

    /**
     * 显示警告消息
     */
    warn(detail: string, summary: string = '提示', life?: number): void {
        this.show({
            severity: 'warn',
            summary,
            detail,
            life
        });
    }

    /**
     * 显示错误消息
     */
    error(detail: string, summary: string = '提示', life?: number): void {
        this.show({
            severity: 'error',
            summary,
            detail,
            life
        });
    }

    /**
     * 清空功能（为了兼容性保留，实际上Toast消息会自动消失）
     */
    clear(): void {
        // Toast 消息会自动消失，这里只是为了兼容性
        console.log('Toast cleared');
    }
}

// 创建全局单例实例
export const globalToast = new GlobalToastService();

// 导出默认实例
export default globalToast;
