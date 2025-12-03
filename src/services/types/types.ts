import { type AxiosRequestConfig } from 'axios';
export interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
    success: boolean;
}

export interface RequestConfig extends AxiosRequestConfig {
    showError?: boolean;
    showSuccess?: boolean;
    successMessage?: string;
    preventPageBlock?: boolean;
    redirectToLoginOnError?: boolean;
}

export interface IQueryPage {
    current: number;
    size: number;
}

export interface IPageResult<T> {
    records: T[];
    pager: {
        current: string | number;
        lastPage: number;
        nextPage: number;
        pageSize: number | string;
        total: number;
        totalPage: number;
    };
}
