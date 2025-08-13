/**
 * 搜索相关类型定义
 */

import type { Ref } from "vue";

/** 搜索参数接口 */
export interface SearchParams<T = Record<string, any>> {
    /** 关键词 */
    keyword: string;
    /** 筛选条件 */
    filters?: T;

    [key: string]: any;

}

/** 筛选配置接口 */
export interface FilterConfig {
    /** 筛选字段key */
    key: string;
    /** 显示标签 */
    label: string;
    /** 筛选类型 */
    type: 'input' | 'select' | 'multiSelect' | 'date' | 'dateRange' | 'number';
    /** 选项列表（用于select和multiSelect） */
    options?: { label: string; value: any }[];
    /** 占位符 */
    placeholder?: string;
    /** 默认值 */
    defaultValue?: any;
    /** 是否必填 */
    required?: boolean;
    /** 验证规则 */
    rules?: any[];
    /** 提示信息 */
    tooltip?: string;
}

/** 搜索结果接口 */
export interface SearchResult<T = any> {
    /** 数据列表 */
    data: T[];
    /** 总数 */
    total: number;
    /** 当前页 */
    page: number;
    /** 每页大小 */
    size: number;
}

/** 搜索Hook返回值接口 */
export interface SearchHook<T = any> {
    /** 搜索参数 */
    searchParams: Ref<SearchParams>;
    /** 加载状态 */
    loading: Ref<boolean>;
    /** 总数 */
    total: Ref<number>;
    /** 数据列表 */
    data: Ref<T[]>;
    /** 执行搜索 */
    handleSearch: (params: SearchParams) => Promise<void>;
    /** 重置搜索 */
    resetSearch: () => void;
}

/** 搜索函数类型 */
export type SearchFunction<T = any> = (params: SearchParams) => Promise<SearchResult<T>>;

/** 筛选项值类型 */
export type FilterValue = string | number | boolean | Date | any[] | null | undefined;

/** 搜索事件类型 */
export interface SearchEvents {
    /** 搜索事件 */
    search: (params: SearchParams) => void;
    /** 重置事件 */
    reset: () => void;
    /** 筛选条件变更事件 */
    filterChange: (key: string, value: FilterValue) => void;
    /** 关键词变更事件 */
    keywordChange: (keyword: string) => void;
}
