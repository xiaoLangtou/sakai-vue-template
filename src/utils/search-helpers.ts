import type { FilterValue, SearchParams } from '@/types/search';

/**
 * 搜索工具函数
 */
export class SearchHelpers {
    /**
     * 检查值是否有效（非空）
     * @param value 要检查的值
     */
    static hasValue(value: FilterValue): boolean {
        if (value === null || value === undefined || value === '') {
            return false;
        }
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        return true;
    }

    /**
     * 格式化筛选条件显示文本
     * @param key 筛选字段
     * @param value 筛选值
     * @param maxLength 最大显示长度
     */
    static formatFilterValue(key: string, value: FilterValue, maxLength: number = 20): string {
        if (!this.hasValue(value)) {
            return '';
        }

        // 处理数组类型
        if (Array.isArray(value)) {
            if (value.length <= 2) {
                return `${key}: ${value.join(', ')}`;
            }
            return `${key}: ${value.slice(0, 2).join(', ')}等${value.length}项`;
        }

        // 处理日期类型
        if (value instanceof Date) {
            return `${key}: ${value.toLocaleDateString()}`;
        }

        // 处理字符串类型
        const strValue = String(value);
        if (strValue.length > maxLength) {
            return `${key}: ${strValue.substring(0, maxLength)}...`;
        }

        return `${key}: ${strValue}`;
    }

    /**
     * 获取活跃的筛选条件
     * @param filters 筛选条件对象
     */
    static getActiveFilters(filters: Record<string, any>): Record<string, any> {
        const activeFilters: Record<string, any> = {};

        if (!filters) {
            return activeFilters;
        }

        Object.entries(filters).forEach(([key, value]) => {
            if (this.hasValue(value)) {
                activeFilters[key] = value;
            }
        });

        return activeFilters;
    }

    /**
     * 检查是否有搜索条件
     * @param params 搜索参数
     */
    static hasSearchConditions(params: SearchParams): boolean {
        const hasKeyword = this.hasValue(params.keyword);
        if (!params.filters) return false;
        const hasFilters = Object.keys(this.getActiveFilters(params.filters)).length > 0;
        return hasKeyword || hasFilters;
    }

    /**
     * 清理搜索参数（移除空值）
     * @param params 搜索参数
     */
    static cleanSearchParams(params: SearchParams): SearchParams {
        const cleanedParams = { ...params };
        if (!params.filters) return cleanedParams;
        cleanedParams.filters = this.getActiveFilters(params.filters);
        return cleanedParams;
    }

    /**
     * 构建URL查询参数
     * @param params 搜索参数
     */
    static buildQueryParams(params: SearchParams): URLSearchParams {
        const queryParams = new URLSearchParams();
        const cleanedParams = this.cleanSearchParams(params);

        // 添加关键词
        if (cleanedParams.keyword) {
            queryParams.set('keyword', cleanedParams.keyword);
        }

        // 添加筛选条件
        if (cleanedParams.filters) {
            Object.entries(cleanedParams.filters).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    queryParams.set(key, value.join(','));
                } else if (value instanceof Date) {
                    queryParams.set(key, value.toISOString());
                } else {
                    queryParams.set(key, String(value));
                }
            });
        }

        // 添加分页信息
        queryParams.set('page', String(cleanedParams.pagination.page));
        queryParams.set('size', String(cleanedParams.pagination.size));

        // 添加排序信息
        queryParams.set('sortField', cleanedParams.sort.field);
        queryParams.set('sortOrder', cleanedParams.sort.order);

        return queryParams;
    }

    /**
     * 从URL查询参数解析搜索参数
     * @param searchParams URL搜索参数
     */
    static parseQueryParams(searchParams: URLSearchParams): Partial<SearchParams> {
        const params: Partial<SearchParams> = {
            filters: {}
        };

        // 解析关键词
        const keyword = searchParams.get('keyword');
        if (keyword) {
            params.keyword = keyword;
        }

        // 解析分页
        const page = searchParams.get('page');
        const size = searchParams.get('size');
        if (page || size) {
            params.pagination = {
                page: page ? parseInt(page, 10) : 1,
                size: size ? parseInt(size, 10) : 20
            };
        }

        // 解析排序
        const sortField = searchParams.get('sortField');
        const sortOrder = searchParams.get('sortOrder');
        if (sortField && sortOrder) {
            params.sort = {
                field: sortField,
                order: sortOrder as 'asc' | 'desc'
            };
        }

        // 解析其他筛选条件
        searchParams.forEach((value, key) => {
            if (!['keyword', 'page', 'size', 'sortField', 'sortOrder'].includes(key)) {
                // 尝试解析为数组
                if (value.includes(',')) {
                    params.filters![key] = value.split(',');
                } else {
                    params.filters![key] = value;
                }
            }
        });

        return params;
    }

    /**
     * 深度比较两个搜索参数是否相等
     * @param params1 搜索参数1
     * @param params2 搜索参数2
     */
    static isSearchParamsEqual(params1: SearchParams, params2: SearchParams): boolean {
        return JSON.stringify(this.cleanSearchParams(params1)) === JSON.stringify(this.cleanSearchParams(params2));
    }

    /**
     * 验证搜索参数
     * @param params 搜索参数
     */
    static validateSearchParams(params: SearchParams): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        // 验证分页参数
        if (params.pagination.page < 1) {
            errors.push('页码必须大于0');
        }
        if (params.pagination.size < 1 || params.pagination.size > 1000) {
            errors.push('每页大小必须在1-1000之间');
        }

        // 验证排序参数
        if (!params.sort.field) {
            errors.push('排序字段不能为空');
        }
        if (!['asc', 'desc'].includes(params.sort.order)) {
            errors.push('排序方向必须是asc或desc');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
}

/**
 * 导出常用的工具函数
 */
export const { hasValue, formatFilterValue, getActiveFilters, hasSearchConditions, cleanSearchParams, buildQueryParams, parseQueryParams, isSearchParamsEqual, validateSearchParams } = SearchHelpers;
