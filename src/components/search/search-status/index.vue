<script setup lang="ts">
import type { SearchParams } from '@/types/search';
import { SearchHelpers } from '@/utils/search-helpers';
import Tag from 'primevue/tag';
import { computed, withDefaults } from 'vue';

interface Props {
    /** 搜索参数 */
    params: SearchParams;
    /** 结果总数 */
    total: number;
    /** 是否显示分页信息 */
    showPagination?: boolean;
    /** 筛选配置映射（用于显示中文标签） */
    filterLabels?: Record<string, string>;
}

interface Emits {
    (e: 'clear'): void;
    (e: 'remove-filter', key: string): void;
}

const props = withDefaults(defineProps<Props>(), {
    showPagination: true
});

defineEmits<Emits>();

// 活跃的筛选条件
const activeFilters = computed(() => {
    return SearchHelpers.getActiveFilters(props.params.filters);
});

// 是否有搜索条件
const hasConditions = computed(() => {
    return props.params.keyword || Object.keys(activeFilters.value).length > 0;
});

/**
 * 格式化筛选条件显示
 */
const formatFilterValue = (key: string, value: any): string => {
    const labels = props.filterLabels || {};
    const label = labels[key] || key;
    return SearchHelpers.formatFilterValue(label, value, 15);
};

/**
 * 格式化总数显示
 */
const formatTotal = (total: number): string => {
    if (total >= 10000) {
        return (total / 10000).toFixed(1) + '万';
    } else if (total >= 1000) {
        return (total / 1000).toFixed(1) + 'k';
    }
    return total.toString();
};

/**
 * 获取条件摘要
 */
const getConditionsSummary = (): string => {
    const keywordCount = props.params.keyword ? 1 : 0;
    const filterCount = Object.keys(activeFilters.value).length;
    const totalCount = keywordCount + filterCount;

    if (totalCount === 0) return '';

    const parts = [];
    if (keywordCount > 0) parts.push('关键词');
    if (filterCount > 0) parts.push(`${filterCount}个筛选条件`);

    return parts.join(' · ');
};
</script>

<template>
    <Transition name="status-fade">
        <div v-if="hasConditions" class="search-status">
            <div class="status-content">
                <div class="status-tags">
                    <span>当前筛选条件：</span>
                    <Tag
v-if="params.keyword" :value="`${params.keyword}`" severity="info"
                        class="condition-tag keyword-tag" removable @remove="$emit('remove-filter', 'keyword')">
                        <template #default>
                            <i class="pi pi-search" />
                            <span>{{ params.keyword }}</span>
                        </template>
                    </Tag>

                    <Tag
v-for="(value, key) in activeFilters" :key="key" :value="formatFilterValue(key, value)"
                        severity="secondary" class="condition-tag filter-tag" removable
                        @remove="$emit('remove-filter', key)" />
                </div>
            </div>
        </div>
    </Transition>
</template>

<style lang="scss" scoped>
.search-status {
    margin-top: 1rem;
    border-radius: 8px;
    padding: 2px;
    box-sizing: border-box;
}

.status-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.status-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.status-icon {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background: var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.status-icon i {
    color: white;
    font-size: 1rem;
}

.status-text h5 {
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
    font-weight: 500;
    color: var(--text-color);
}

.status-text p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-color-secondary);
}

.clear-all-btn {
    border-radius: 6px;
    transition: background-color 0.2s;
    font-weight: 500;
    padding: 0.5rem 1rem;
}

.clear-all-btn:hover {
    background: var(--red-600);
}

.status-content {
    margin-top: 1rem;
}

.status-tags {
    gap: 0.5rem;
    margin-bottom: 1rem;
    @apply flex flex-wrap items-center;
}

.condition-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    transition: background-color 0.2s;
}

.keyword-tag {
    background: var(--primary-500);
    color: white;
    border: 1px solid var(--primary-500);
}

.keyword-tag:hover {
    background: var(--primary-600);
}

.keyword-tag span {
    margin-left: 0.5rem;
    font-weight: 500;
}

.filter-tag {
    background: rgba(59, 130, 246, 0.1);
    color: rgb(29, 78, 216);
    border: 1px solid rgba(59, 130, 246, 0.3);
}

.status-result {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
}

.result-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.result-icon {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background: var(--green-500);
    display: flex;
    align-items: center;
    justify-content: center;
}

.result-icon i {
    color: white;
    font-size: 0.875rem;
}

.result-text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.result-label {
    font-size: 0.875rem;
    color: var(--text-color-secondary);
    font-weight: 500;
}

.result-count {
    font-size: 1rem;
    font-weight: 600;
    color: var(--primary-600);
}

.pagination-info {
    display: flex;
    align-items: center;
}

.pagination-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: rgba(59, 130, 246, 0.1);
    border-radius: 4px;
    font-size: 0.75rem;
    color: var(--text-color-secondary);
    font-weight: 500;
    border: 1px solid rgba(59, 130, 246, 0.3);
}

.pagination-badge i {
    font-size: 0.875rem;
    color: var(--primary-color);
}

/* 动画效果 */
.status-fade-enter-active,
.status-fade-leave-active {
    transition: all 0.3s ease;
}

.status-fade-enter-from,
.status-fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .search-status {
        padding: 0.75rem;
    }

    .status-header {
        flex-direction: column;
        gap: 0.75rem;
        align-items: stretch;
    }

    .status-result {
        flex-direction: column;
        gap: 0.75rem;
        align-items: stretch;
    }

    .status-tags {
        gap: 0.375rem;
    }

    .condition-tag {
        font-size: 0.8rem;
        padding: 0.375rem 0.5rem;
    }
}

/* 深色主题适配 */
.search-status {
    @apply bg-white border-gray-200;
    @apply dark:bg-gray-800 dark:border-gray-600;
}

.status-text h5 {
    @apply text-gray-900;
    @apply dark:text-gray-100;
}

.status-text p {
    @apply text-gray-600;
    @apply dark:text-gray-300;
}

.clear-all-btn {
    @apply bg-red-600 border-red-600 hover:bg-red-700;
    @apply dark:bg-red-600 dark:border-red-600 dark:hover:bg-red-700;
}

.filter-tag {
    @apply bg-blue-50 text-blue-700 border-blue-200;
    @apply dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700;
}

.status-result {
    @apply bg-gray-50 border-gray-200;
    @apply dark:bg-gray-900 dark:border-gray-600;
}

.result-label {
    @apply text-gray-600;
    @apply dark:text-gray-300;
}

.result-count {
    @apply text-blue-600;
    @apply dark:text-blue-400;
}

.pagination-badge {
    @apply bg-blue-50 border-blue-200 text-gray-600;
    @apply dark:bg-blue-900/20 dark:border-blue-700 dark:text-gray-300;
}
</style>
