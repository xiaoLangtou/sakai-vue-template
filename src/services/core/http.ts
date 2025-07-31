import router from '@/router/index.ts';
import { StorageUtil } from '@/utils/storage.ts';
import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse, RequestConfig } from '../types/types.ts';
import { globalToast } from './toast.ts';
import { useLoginDialog } from '@/composables/useLoginDialog';
import { nextTick } from 'vue';

// 标识页面是否已经初始化完成
let isPageInitialized = false;

// 页面加载完成后设置标识
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            isPageInitialized = true;
        }, 1000); // 延迟1秒确保页面完全初始化
    });
}

class HttpClient {
    private instance: AxiosInstance;

    constructor(baseURL?: string) {
        this.instance = axios.create({
            baseURL: baseURL || import.meta.env.VITE_API_URL || '/api',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }



    private setupInterceptors() {
        // 请求拦截器
        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                // 添加 token
                const token = StorageUtil.get('accessToken')
                if (token) {
                    config.headers = config.headers || {};
                    config.headers.Authorization = `Bearer ${token}`;
                }

                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // 响应拦截器
        this.instance.interceptors.response.use(
            (response: AxiosResponse<ApiResponse>) => {
                const { data } = response;
                const config = response.config as RequestConfig;

                // 业务成功
                if (data.code === 0 && data.data) {
                    if (config.showSuccess && config.successMessage) {
                        globalToast.success(config.successMessage);
                    }
                    // 直接返回业务数据
                    return data.data;
                }

                // 业务失败
                if (config.showError !== false) {
                    globalToast.error(data.message || '请求失败');
                }

                return Promise.reject(new Error(data.message || '请求失败'));
            },
            (error) => {
                const config = error.config as RequestConfig;
                console.log(error.code)
                // 处理不同的错误状态码
                if (error.response) {
                    const { status, data } = error.response;
                    switch (status) {
                        case 401:
                            this.handleUnauthorized();
                            break;
                        case 403:
                            this.showError('没有权限访问', config?.showError);
                            break;
                        case 404:
                            this.showError('请求的资源不存在', config?.showError);
                            break;
                        case 500:
                            this.showError('服务器内部错误', config?.showError);
                            break;
                        default:
                            this.showError(data?.message || '网络请求失败', config?.showError);
                    }
                } else if (error.code === 'ECONNABORTED') {
                    this.showError('请求超时', config?.showError);
                    // 请求超时时跳转到登录页
                    if (config?.redirectToLoginOnError) {
                        this.handleNetworkErrorRedirect();
                    }
                } else {
                    this.showError('网络连接失败', config?.showError);
                    // 网络连接失败时跳转到登录页
                    if (config?.redirectToLoginOnError) {
                        this.handleNetworkErrorRedirect();
                    }
                }
                console.log("eeeeeee")
                return Promise.reject(error);
            }
        );
    }



    private async handleUnauthorized() {
        // 清除本地存储的token
        StorageUtil.remove('accessToken');

        await nextTick();
        // 检查当前是否在登录页面
        const currentRoute = router.currentRoute.value;
        console.log('当前路由信息:', {
            name: currentRoute.name,
            path: currentRoute.path,
            fullPath: currentRoute.fullPath,
            isPageInitialized
        });
        
        // 使用路径和名称双重判断，确保准确识别登录页面
        const isLoginPage = currentRoute.name === 'Login' || 
                           currentRoute.path === '/auth/login' || 
                           currentRoute.fullPath.includes('/auth/login');
        
        // 如果页面还未初始化完成（页面刷新阶段），不显示弹窗，交由路由守卫处理
        if (!isPageInitialized) {
            console.log('页面初始化阶段，不显示登录弹窗，交由路由守卫处理');
            return;
        }
        
        if (isLoginPage) {
            // 如果已经在登录页面，只显示提示
            console.log('已在登录页面，只显示提示');
            globalToast.warn('登录已过期，请重新登录');
            return;
        }
        
        // 如果不在登录页面且页面已初始化，显示登录弹窗
        console.log('不在登录页面且页面已初始化，显示登录弹窗');
        const { showLoginDialog } = useLoginDialog();
        globalToast.warn('登录已过期，请重新登录');
        showLoginDialog();
    }

    private handleNetworkErrorRedirect() {
        globalToast.error('网络请求失败，即将跳转到登录页');

        // 跳转到登录页
        setTimeout(() => {
            router.replace({
                name: 'Login',
            })
        }, 1500);
    }

    private showError(message: string, showError?: boolean) {
        if (showError !== false) {
            globalToast.error(message);
        }
    }



    // GET 请求
    get<T = any>(url: string, config?: RequestConfig): Promise<T> {
        return this.instance.get(url, config);
    }

    // POST 请求
    post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
        return this.instance.post(url, data, config);
    }

    // PUT 请求
    put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
        return this.instance.put(url, data, config);
    }

    // DELETE 请求
    delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
        return this.instance.delete(url, config);
    }

    // PATCH 请求
    patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
        return this.instance.patch(url, data, config);
    }

    // 文件上传
    upload<T = any>(url: string, file: File | FormData, config?: RequestConfig): Promise<T> {
        const formData = file instanceof FormData ? file : new FormData();
        if (file instanceof File) {
            formData.append('file', file);
        }

        return this.instance.post(url, formData, {
            ...config,
            headers: {
                'Content-Type': 'multipart/form-data',
                ...config?.headers,
            },
        });
    }

    // 获取原始 axios 实例
    getInstance(): AxiosInstance {
        return this.instance;
    }


}

// 创建默认实例
export const http = new HttpClient();
export default http;
