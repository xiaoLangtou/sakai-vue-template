import { ref, reactive, type Ref } from 'vue';
import type { SearchParams, SearchResult, SearchFunction } from '@/types/search';

/**
 * 搜索组合式函数
 * @param searchFn 搜索函数
 * @param initialParams 初始搜索参数
 */
export function useSearch<T = any>(
  searchFn: SearchFunction<T>,
  initialParams?: Partial<SearchParams>
) {
  // 响应式状态
  const loading = ref(false);
  const total = ref(0);
  const data = ref<T[]>([]);
  const error = ref<string | null>(null);
  
  // 搜索参数
  const searchParams = ref<SearchParams>({
    keyword: '',
    filters: {},
    pagination: { page: 1, size: 20 },
    sort: { field: 'createTime', order: 'desc' },
    ...initialParams
  });

  /**
   * 执行搜索
   * @param params 搜索参数
   */
  const handleSearch = async (params?: SearchParams) => {
    const searchData = params || searchParams.value;
    loading.value = true;
    error.value = null;
    
    try {
      // 更新搜索参数
      searchParams.value = { ...searchData };
      
      // 执行搜索
      const result = await searchFn(searchData);
      
      // 更新结果
      data.value = result.data;
      total.value = result.total;
      
      return result;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '搜索失败';
      console.error('搜索错误:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * 重置搜索
   */
  const resetSearch = () => {
    searchParams.value = {
      keyword: '',
      filters: {},
      pagination: { page: 1, size: 20 },
      sort: { field: 'createTime', order: 'desc' },
      ...initialParams
    };
    handleSearch();
  };

  /**
   * 更新关键词
   * @param keyword 关键词
   */
  const updateKeyword = (keyword: string) => {
    searchParams.value.keyword = keyword;
    searchParams.value.pagination.page = 1; // 重置到第一页
  };

  /**
   * 更新筛选条件
   * @param key 筛选字段
   * @param value 筛选值
   */
  const updateFilter = (key: string, value: any) => {
    if (value === null || value === undefined || value === '') {
      delete searchParams.value.filters[key];
    } else {
      searchParams.value.filters[key] = value;
    }
    searchParams.value.pagination.page = 1; // 重置到第一页
  };

  /**
   * 批量更新筛选条件
   * @param filters 筛选条件对象
   */
  const updateFilters = (filters: Record<string, any>) => {
    searchParams.value.filters = { ...filters };
    searchParams.value.pagination.page = 1;
  };

  /**
   * 更新分页
   * @param page 页码
   * @param size 每页大小
   */
  const updatePagination = (page: number, size?: number) => {
    searchParams.value.pagination.page = page;
    if (size !== undefined) {
      searchParams.value.pagination.size = size;
    }
  };

  /**
   * 更新排序
   * @param field 排序字段
   * @param order 排序方向
   */
  const updateSort = (field: string, order: 'asc' | 'desc') => {
    searchParams.value.sort = { field, order };
  };

  /**
   * 清空筛选条件
   */
  const clearFilters = () => {
    searchParams.value.filters = {};
    searchParams.value.pagination.page = 1;
  };

  /**
   * 移除单个筛选条件
   * @param key 筛选字段
   */
  const removeFilter = (key: string) => {
    delete searchParams.value.filters[key];
    searchParams.value.pagination.page = 1;
  };

  /**
   * 获取当前搜索状态
   */
  const getSearchState = () => {
    return {
      params: { ...searchParams.value },
      loading: loading.value,
      total: total.value,
      data: [...data.value],
      error: error.value
    };
  };

  return {
    // 响应式状态
    searchParams,
    loading,
    total,
    data,
    error,
    
    // 方法
    handleSearch,
    resetSearch,
    updateKeyword,
    updateFilter,
    updateFilters,
    updatePagination,
    updateSort,
    clearFilters,
    removeFilter,
    getSearchState
  };
}