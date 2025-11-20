<script setup lang="ts">
import { useDebounce } from '@/composables/useDebounce.ts';
import type { FilterConfig, SearchParams } from '@types/search.ts';
import Button from 'primevue/button';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import { computed, onMounted, reactive, ref, watch, withDefaults } from 'vue';
import FilterItem from '../filter-item/index.vue';

interface Props {
    /** 筛选配置列表 */
    filterConfigs: FilterConfig[];
    /** 搜索框占位符 */
    placeholder?: string;
    /** 加载状态 */
    loading?: boolean;
    /** 结果总数 */
    total?: number;
    /** 搜索参数 */
    modelValue?: SearchParams;
    /** 是否自动搜索 */
    autoSearch?: boolean;
    /** 防抖延迟时间 */
    debounceDelay?: number;
    /** 是否显示分页信息 */
    showPaginationInfo?: boolean;
    /** 是否显示验证错误 */
    showValidationErrors?: boolean;
    /** 筛选项列数配置 */
    filterColumns?: {
        xs?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
    };
}

interface Emits {
    (e: 'search', params: SearchParams): void;
    (e: 'update:modelValue', params: SearchParams): void;
    (e: 'reset'): void;
    (e: 'filter-change', key: string, value: any): void;
    (e: 'keyword-change', keyword: string): void;
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: '请输入关键词搜索',
    loading: false,
    total: 0,
    autoSearch: false,
    debounceDelay: 300,
    showPaginationInfo: true,
    showValidationErrors: false
});

const emit = defineEmits<Emits>();

// 本地搜索参数
const localParams = reactive<SearchParams>({
    keyword: '',
    filters: {}
});

// 界面状态
const showAdvanced = ref(false);
const filterRefs = ref<Record<string, any>>({});
const isFormValid = ref(true);
const validationState = ref<Record<string, boolean>>({});

// 防抖搜索
const { debounce } = useDebounce(props.debounceDelay);

// 监听 modelValue 变化
watch(
    () => props.modelValue,
    (newValue) => {
        if (newValue) {
            Object.assign(localParams, {
                keyword: newValue.keyword || '',
                filters: newValue.filters ? { ...newValue.filters } : {},
                pagination: newValue.pagination ? { ...newValue.pagination } : { page: 1, size: 20 },
                sort: newValue.sort ? { ...newValue.sort } : { field: 'createTime', order: 'desc' }
            });
        }
    },
    { immediate: true, deep: true }
);

// 筛选标签映射
const filterLabelMap = computed(() => {
    const map: Record<string, string> = {};
    props.filterConfigs.forEach((config) => {
        map[config.key] = config.label;
    });
    return map;
});

// 活跃筛选条件数量
const activeFilterCount = computed(() => {
    return Object.keys(localParams.filters).filter((key) => {
        const value = localParams.filters[key];
        return value !== null && value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0);
    }).length;
});

/**
 * 获取列样式类
 * @param filter 筛选配置
 */
const getColumnClass = (filter: FilterConfig) => {
    const cols = props.filterColumns || {
        xs: 12,
        sm: 6,
        md: 4,
        lg: 3,
        xl: 3
    };
    return [`col-${cols.xs || 12}`, `sm:col-${cols.sm || 6}`, `md:col-${cols.md || 4}`, `lg:col-${cols.lg || 3}`, `xl:col-${cols.xl || 3}`].join(' ');
};

/**
 * 处理关键词变化
 */
const handleKeywordChange = () => {
    emit('keyword-change', localParams.keyword);

    if (props.autoSearch) {
        localParams.pagination.page = 1;
        debounce(handleSearch);
    }
};

/**
 * 处理筛选条件更新
 * @param key 筛选字段
 * @param value 筛选值
 */
const handleFilterUpdate = (key: string, value: any) => {
    if (value === null || value === undefined || value === '') {
        delete localParams.filters[key];
    } else {
        localParams.filters[key] = value;
    }

    localParams.pagination.page = 1;
    emit('filter-change', key, value);

    if (props.autoSearch) {
        debounce(handleSearch);
    }
};

/**
 * 立即搜索
 */
const handleImmediateSearch = () => {
    // 验证表单
    if (props.showValidationErrors && !validateForm()) {
        return;
    }

    handleSearch();
};

/**
 * 执行搜索
 */
const handleSearch = () => {
    const searchParams = { ...localParams };
    emit('search', searchParams);
    emit('update:modelValue', searchParams);
};

/**
 * 重置搜索
 */
const handleReset = () => {
    localParams.keyword = '';
    localParams.filters = {};
    localParams.pagination.page = 1;

    // 清除验证错误
    Object.keys(filterRefs.value).forEach((key) => {
        const ref = filterRefs.value[key];
        if (ref && ref.clearError) {
            ref.clearError();
        }
    });

    emit('reset');
    handleSearch();
};

/**
 * 清空筛选条件
 */
const handleClearFilters = () => {
    localParams.filters = {};
    localParams.pagination.page = 1;

    // 清除验证错误
    Object.keys(filterRefs.value).forEach((key) => {
        const ref = filterRefs.value[key];
        if (ref && ref.clearError) {
            ref.clearError();
        }
    });

    if (props.autoSearch) {
        handleSearch();
    }
};

/**
 * 清除关键词
 */
const clearKeyword = () => {
    localParams.keyword = '';
    emit('keyword-change', '');

    if (props.autoSearch) {
        localParams.pagination.page = 1;
        debounce(handleSearch);
    }
};

/**
 * 移除单个筛选条件
 * @param key 筛选字段
 */
const handleRemoveFilter = (key: string) => {
    if (key === 'keyword') {
        localParams.keyword = '';
    } else {
        delete localParams.filters[key];
    }

    localParams.pagination.page = 1;
    handleSearch();
};

/**
 * 切换高级筛选
 */
const toggleAdvanced = () => {
    showAdvanced.value = !showAdvanced.value;
};

/**
 * 验证表单
 */
const validateForm = (): boolean => {
    let isValid = true;

    Object.keys(filterRefs.value).forEach((key) => {
        const ref = filterRefs.value[key];
        if (ref && ref.validate) {
            const valid = ref.validate();
            if (!valid) {
                isValid = false;
            }
        }
    });

    return isValid;
};

/**
 * 获取当前搜索参数
 */
const getSearchParams = () => {
    return { ...localParams };
};

/**
 * 设置搜索参数
 * @param params 搜索参数
 */
const setSearchParams = (params: Partial<SearchParams>) => {
    Object.assign(localParams, params);
};

// 初始化默认筛选值
onMounted(() => {
    props.filterConfigs.forEach((filter) => {
        if (filter.defaultValue !== undefined) {
            localParams.filters[filter.key] = filter.defaultValue;
        }
        // 初始化验证状态
        validationState.value[filter.key] = true;
    });
});

// 暴露方法
defineExpose({
    search: handleSearch,
    reset: handleReset,
    validate: validateForm,
    getSearchParams,
    setSearchParams,
    toggleAdvanced,
    params: localParams
});
</script>

<template>
    <Card class="search-container">
        <template #content>
            <!-- 基础搜索栏 -->
            <div class="search-bar">
                <div class="search-input-group">
                    <div class="search-input-wrapper">
                        <IconField class="w-full">
                            <InputIcon class="pi pi-search" />
                            <InputText
v-model="localParams.keyword" :placeholder="placeholder" class="w-full"
                                @input="handleKeywordChange" @keyup.enter="handleImmediateSearch" />
                            <InputIcon
v-show="localParams.keyword" class="pi pi-times cursor-pointer"
                                @click="clearKeyword" />
                        </IconField>
                    </div>
                    <Button
label="搜索" icon="pi pi-search" class="search-btn" :loading="loading"
                        @click="handleImmediateSearch" />
                </div>

                <div class="search-actions">
                    <Button
v-if="filterConfigs.length > 0" :label="showAdvanced ? '收起筛选' : '高级筛选'"
                        :icon="showAdvanced ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" class="filter-toggle-btn"
                        :badge="activeFilterCount > 0 ? `${activeFilterCount}` : ''" badge-severity="contrast" severity="secondary" outlined
                        @click="toggleAdvanced" />
                    <Button
label="重置" icon="pi pi-refresh" class="reset-btn" severity="secondary" outlined
                        @click="handleReset" />
                    <slot name="actions"></slot>
                </div>
            </div>

            <!-- 高级筛选面板 -->
            <Transition name="slide-down">
                <div v-if="showAdvanced && filterConfigs.length > 0" class="advanced-panel">
                    <div class="panel-header">
                        <h4 class="panel-title">
                            <i class="pi pi-filter" />
                            筛选条件
                        </h4>
                        <div class="panel-actions">

                        </div>
                    </div>

                    <div class="filters-grid">
                        <div v-for="filter in filterConfigs" :key="filter.key" :class="getColumnClass(filter)">
                            <FilterItem
:ref="(el) => (filterRefs[filter.key] = el)" :config="filter" :value="localParams.filters[filter.key]"
                                :immediate="immediate" :show-error="showValidationErrors"
                                @update="handleFilterUpdate" />
                        </div>
                    </div>

                    <!-- 筛选面板底部操作 -->
                    <div class="panel-footer">
                        <div class="footer-info">
                            <span v-if="activeFilterCount > 0" class="filter-count"> 已设置 {{ activeFilterCount }} 个筛选条件
                            </span>
                        </div>
                        <div class="footer-actions">
                            <Button
label="清空筛选" icon="pi pi-times" size="small" severity="secondary"
                                @click="handleClearFilters" />
                            <Button
label="应用筛选" icon="pi pi-check" size="small" :disabled="!isFormValid"
                                @click="handleImmediateSearch" />
                        </div>
                    </div>
                </div>
            </Transition>
        </template>
    </Card>
</template>

<style lang="scss" scoped>
.search-container {
    --p-card-body-padding: 0.25rem;
    overflow: hidden;
    transition: border-color 0.2s ease;
    box-shadow: none;
    position: relative;
    @apply bg-gray-50/20 border-gray-200;
    @apply dark:bg-gray-800/20 dark:border-gray-600;

}

.search-bar {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 0.5rem;
    border-radius: 6px;
}

.search-input-group {
    display: flex;
    gap: 0.75rem;
    flex: 1;
    min-width: 280px;
}

.search-input-wrapper {

    @apply flex-1 flex items-center w-full
}

.search-icon {
    color: #6b7280;
    margin-right: 0.5rem;
    font-size: 1rem;
    @apply text-gray-500;
    @apply dark:text-gray-400;
}

.search-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 0.875rem;
    color: var(--text-color);
    padding: 0;
    box-shadow: none;
    @apply text-gray-900;
    @apply dark:text-gray-100;
}


.search-actions {
    display: flex;
    gap: 1rem;
    flex-shrink: 0;
}

.advanced-panel {
    border-radius: 6px;
    margin-top: 1rem;
    overflow: hidden;
    @apply bg-gray-50;
    @apply dark:bg-gray-800;
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid;
    @apply border-gray-200;
    @apply dark:border-gray-600;
}

.panel-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-color);
}

.panel-title i {
    color: var(--primary-color);
}

.filters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    padding: 1rem;
}

.panel-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    border-top: 1px solid;
    @apply border-gray-100;
    @apply dark:border-gray-600;
}

.footer-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.filter-count {
    font-size: 0.875rem;
    color: #6b7280;
    padding: 0.25rem 0.5rem;
    background: #e5e7eb;
    border-radius: 4px;
}

.footer-actions {
    display: flex;
    gap: 0.75rem;
}

.apply-btn {
    height: 32px;
    padding: 0 1rem;
    border-radius: 4px;
    font-weight: 500;
    background: var(--primary-500);
    border: 1px solid var(--primary-500);
    color: white;
}

.apply-btn:hover:not(:disabled) {
    background: var(--primary-600);
}

/* 动画效果 */
.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
    opacity: 0;
    max-height: 0;
    transform: translateY(-20px);
}

.slide-down-enter-to,
.slide-down-leave-from {
    opacity: 1;
    max-height: 1000px;
    transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .search-bar {
        flex-direction: column;
        align-items: stretch;
    }

    .search-input-group {
        min-width: auto;
    }

    .search-actions {
        justify-content: center;
    }

    .filters-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
        padding: 1rem;
    }

    .panel-header,
    .panel-footer {
        padding: 1rem;
    }

    .panel-footer {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
    }

    .footer-actions {
        justify-content: center;
    }
}

@media (max-width: 576px) {
    .search-actions {
        flex-direction: column;
        gap: 0.5rem;
    }

    .search-input-group {
        flex-direction: column;
        gap: 0.5rem;
    }

    .search-input-wrapper {
        order: 1;
    }

    .search-btn {
        order: 2;
    }
}
</style>
