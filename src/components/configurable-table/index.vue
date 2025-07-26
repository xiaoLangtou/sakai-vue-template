<script setup lang="ts">
import { ListSearch } from '@/components';
import TableColumnSettings from '@/components/table-column-settings/index.vue';
import { useTableConfiguration, useTableEvents, useTablePersistence, useTableStyles } from '@/composables';
import type { TableColumn, TableColumns } from '@/composables/useColumns';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { FilterConfig, SearchParams } from '../search';

// 优化后的接口定义
interface TableSettings {
    showRowDivider: boolean;
    stripedRows: boolean;
    showShadow: boolean;
    showBorder: boolean;
    virtualScroll?: boolean;
    virtualScrollItemSize?: number;
}

interface Props<T = any> {
    /** 表格数据 */
    value: T[];
    /** 列配置 */
    columns: TableColumns<T>;
    /** 数据唯一标识字段 */
    dataKey?: string;
    /** 是否显示网格线 */
    showGridlines?: boolean;
    /** 是否启用分页 */
    paginator?: boolean;
    /** 每页显示行数 */
    rows?: number;
    /** 是否可滚动 */
    scrollable?: boolean;
    /** 当前页 */
    current?: number;
    /** 每页行数选项 */
    rowsPerPageOptions?: number[];
    /** 总记录数 */
    totalRecords?: number;
    /** 分页器模板 */
    paginatorTemplate?: string;
    /** 当前页报告模板 */
    currentPageReportTemplate?: string;
    /** 分页器页码链接大小 */
    pageLinkSize?: number;
    /** 是否总是显示分页器 */
    alwaysShowPaginator?: boolean;
    /** 响应式布局 */
    responsiveLayout?: string;
    /** 是否显示斑马纹 */
    stripedRows?: boolean;
    /** 是否加载中 */
    loading?: boolean;
    /** 表格样式类 */
    tableClass?: string;
    /** 表格样式 */
    tableStyle?: Record<string, any>;
    /** 是否显示列设置按钮 */
    showColumnSettings?: boolean;
    /** 列设置按钮位置 */
    columnSettingsPosition?: 'header' | 'toolbar';
    /** 表格标题 */
    title?: string;
    /** 工具栏插槽内容 */
    showToolbar?: boolean;
    /** 表格尺寸 */
    size?: 'small' | 'normal' | 'large';
    /** 表格设置选项 */
    tableSettings?: TableSettings;
    /** 筛选配置 */
    filterConfigs?: FilterConfig[];
    /** 搜索参数 */
    searchParams?: SearchParams;
    /** 是否启用虚拟滚动 */
    virtualScroll?: boolean;
    /** 虚拟滚动行高 */
    virtualScrollItemSize?: number;
    /** 是否启用状态持久化 */
    persistState?: boolean;
    /** 持久化存储键 */
    persistStateKey?: string;
    /** 是否可选择行 */
    selectionMode?: 'single' | 'multiple';
    /** 选中的行 */
    selection?: T | T[];
}

interface Emits<T = any> {
    'update:columns': [columns: TableColumns<T>];
    'update:selection': [selection: T | T[]];
    'column-change': [column: TableColumn<T>, type: 'visibility' | 'frozen' | 'order'];
    'row-click': [event: { originalEvent: Event; data: T; index: number }];
    'row-dblclick': [event: { originalEvent: Event; data: T; index: number }];
    'selection-change': [selection: T[]];
    'filter-change': [params: SearchParams];
    'state-restore': [state: any];
    'state-save': [state: any];
    refresh: [];
    page: [event: any];
    sort: [event: any];
    filter: [event: any];
}

const props = withDefaults(defineProps<Props>(), {
    dataKey: 'id',
    showGridlines: true,
    paginator: true,
    current: 1,
    rows: 10,
    totalRecords: 0,
    scrollable: true,
    rowsPerPageOptions: () => [5, 10, 20, 50],
    paginatorTemplate: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown',
    currentPageReportTemplate: '共 {totalRecords} 条记录',
    pageLinkSize: 5,
    alwaysShowPaginator: true,
    responsiveLayout: 'scroll',
    stripedRows: true,
    loading: false,
    showColumnSettings: true,
    columnSettingsPosition: 'header',
    showToolbar: true,
    size: 'normal',
    virtualScroll: false,
    virtualScrollItemSize: 46,
    persistState: false,
    tableSettings: () => ({
        showRowDivider: true,
        stripedRows: true,
        showShadow: false,
        showBorder: true,
        virtualScroll: false,
        virtualScrollItemSize: 46
    })
});

const emit = defineEmits<Emits>();

// 使用 composables 管理复杂逻辑
const {
    internalColumns,
    processedColumns,
    handleColumnsChange,
    handleColumnChange
} = useTableConfiguration(props, emit);

const {
    computedTableClass,
    computedTableStyle,
    selectedStyle,
    currentTableSettings,
    handleStyleChange,
    handleTableSettingChange,
    getColumnStyle,
    getColumnBodyStyle,
    getHeaderStyle
} = useTableStyles(props);

const {
    handleRowClick,
    handleRowDblClick,
    handleSort: handleSortEvent,
    handleFilterChange,
    handleRefresh,
    handleSelectionChange
} = useTableEvents(emit as any);

// 状态持久化
const { saveState, restoreState } = useTablePersistence(props, {
    columns: internalColumns,
    selectedStyle,
    tableSettings: currentTableSettings
});

// 组件引用
const columnSettingsRef = ref();
const dataTableRef = ref();

// 分页器状态
const first = ref(props.current - 1);
const rows = ref(props.rows);

// 分页器事件处理
const handlePaginatorPage = (event: any) => {
    first.value = event.first;
    rows.value = event.rows;

    // 触发页面变化事件
    emit('page', {
        ...event,
    });
};

// 计算属性
const hasData = computed(() => props.value && props.value.length > 0);

const virtualScrollConfig = computed(() => {
    if (!props.virtualScroll && !currentTableSettings.value.virtualScroll) {
        return {};
    }

    return {
        virtualScrollerOptions: {
            itemSize: props.virtualScrollItemSize || currentTableSettings.value.virtualScrollItemSize || 46,
            showLoader: true,
            loading: props.loading
        }
    };
});

// 优化的工具函数 - 使用缓存避免重复计算
const fieldPathCache = new Map<string, string[]>();
const getFieldPath = (field: string): string[] => {
    if (!fieldPathCache.has(field)) {
        fieldPathCache.set(field, field.split('.'));
    }
    return fieldPathCache.get(field)!;
};

const getNestedValue = (obj: any, fieldPath: string[]): any => {
    return fieldPath.reduce((current, key) => current?.[key], obj);
};

const getTooltipContent = (column: TableColumn<any>, rowData: any, index: number): string => {
    if (column.tooltipContent) {
        return typeof column.tooltipContent === 'function'
            ? column.tooltipContent(rowData, index)
            : column.tooltipContent;
    }

    const field = column.tooltipField || column.field;
    if (field && rowData) {
        const fieldPath = getFieldPath(field);
        const value = getNestedValue(rowData, fieldPath);
        return value?.toString() || '';
    }

    return '';
};

const getDisplayText = (column: TableColumn<any>, rowData: any, index: number): string => {
    if (column.text) {
        return typeof column.text === 'function'
            ? column.text(rowData, index)
            : column.text;
    }

    if (column.field && rowData) {
        const fieldPath = getFieldPath(column.field);
        const value = getNestedValue(rowData, fieldPath);
        return value?.toString() || '';
    }

    return '';
};

const getTooltipOptions = (column: TableColumn<any>): Record<string, any> => {
    const defaultOptions = {
        position: 'top',
        showDelay: 300,
        hideDelay: 0,
        autoHide: true,
        escape: true
    };

    return { ...defaultOptions, ...column.tooltipOptions };
};

// 优化的事件处理
const openColumnSettings = async (event: Event): Promise<void> => {
    await nextTick();
    columnSettingsRef.value?.toggle(event);
};

const exportData = () => {
    // 导出功能
    if (dataTableRef.value) {
        dataTableRef.value.exportCSV();
    }
};

// 生命周期
onMounted(() => {
    if (props.persistState) {
        restoreState();
    }
});

// 组件卸载时清理
onBeforeUnmount(() => {
    // 清理防抖定时器
    if (saveStateTimer) {
        clearTimeout(saveStateTimer);
        saveStateTimer = null;
    }

    // 清理缓存
    fieldPathCache.clear();
});

// 优化：使用防抖来减少频繁的状态保存
let saveStateTimer: NodeJS.Timeout | null = null;
const debouncedSaveState = () => {
    if (saveStateTimer) {
        clearTimeout(saveStateTimer);
    }
    saveStateTimer = setTimeout(() => {
        if (props.persistState) {
            saveState();
        }
    }, 300); // 300ms 防抖
};

// 监听状态变化并保存
watch(
    [internalColumns, selectedStyle, currentTableSettings],
    debouncedSaveState,
    { deep: true }
);

// 暴露组件方法
defineExpose({
    openColumnSettings,
    exportData,
    getTableConfig: () => ({
        classes: computedTableClass.value,
        styles: computedTableStyle.value,
        selectedStyle: selectedStyle.value,
        settings: {
            showRowDivider: currentTableSettings.value.showRowDivider ?? true,
            stripedRows: currentTableSettings.value.stripedRows ?? true,
            showShadow: currentTableSettings.value.showShadow ?? false,
            showBorder: currentTableSettings.value.showBorder ?? true,
            virtualScroll: currentTableSettings.value.virtualScroll ?? false,
            virtualScrollItemSize: currentTableSettings.value.virtualScrollItemSize ?? 46
        }
    }),
    refresh: handleRefresh,
    clearSelection: () => {
        if (dataTableRef.value) {
            dataTableRef.value.clearSelection();
        }
    }
});
</script>

<template>
    <div class="configurable-table">
        <!-- 搜索和工具栏 -->
        <ListSearch :filter-configs="filterConfigs ?? []" placeholder="请输入搜索内容" :loading="loading"
            :model-value="searchParams" @search="handleFilterChange">
            <template #actions>
                <!-- 刷新按钮 -->
                <Button icon="pi pi-refresh" class="mr-2" severity="secondary" outlined :disabled="loading"
                    @click="handleRefresh" />

                <!-- 导出按钮 -->
                <Button icon="pi pi-download" class="mr-2" severity="secondary" outlined :disabled="loading || !hasData"
                    @click="exportData" />

                <!-- 列设置 -->
                <Button icon="pi pi-cog" class="mr-2" severity="secondary" outlined @click="openColumnSettings" />
            </template>
        </ListSearch>

        <!-- 分割线 -->
        <Divider type="dashed" />

        <!-- 表格容器 -->
        <div class="table-container">
            <DataTable ref="dataTableRef"  :value="value" :data-key="dataKey"
                :show-gridlines="showGridlines" :paginator="false" :scrollable="scrollable" :resizable-columns="true"
                :scroll-height="virtualScroll ? '400px' : 'flex'" :column-resize-mode="'expand'"
                :responsive-layout="responsiveLayout" :striped-rows="stripedRows" :loading="loading"
                :class="computedTableClass" :style="computedTableStyle" :selection-mode="selectionMode"
                :selection="selection" v-bind="{...virtualScrollConfig,...$attrs}" @row-click="handleRowClick"
                @row-dblclick="handleRowDblClick" @sort="(event: any) => handleSortEvent(event)"
                @selection-change="handleSelectionChange">
                <!-- 动态生成列 - 优化key策略 -->
                <template v-for="(column, columnIndex) in processedColumns"
                    :key="`${column.key || column.field || columnIndex}-${column.header || column.title}`">
                    <Column :field="column.field" :header="column.header || column.title"
                        :sortable="column.sortable ?? false" :frozen="column.frozen" :align-frozen="column.alignFrozen"
                        :header-style="hasData ? getHeaderStyle(column) : undefined"
                        :style="getColumnStyle(column, hasData)" :selection-mode="(column as any).selectionMode">
                        <!-- 自定义列内容 -->
                        <template v-if="$slots[`column-${column.key || column.field}`]" #body="slotProps">
                            <slot :name="`column-${column.key || column.field}`" v-bind="slotProps" />
                        </template>

                        <!-- 渲染函数内容 -->
                        <template v-else-if="column.render" #body="slotProps">
                            <component :is="column.render!(slotProps.data, slotProps.index)" />
                        </template>

                        <!-- 文本内容 -->
                        <template v-else-if="column.text" #body="slotProps">
                            <div v-if="(column as any).ellipsis || (column as any).showTooltip" v-tooltip="(column as any).showTooltip ? {
                                value: getTooltipContent(column, slotProps.data, slotProps.index),
                                ...getTooltipOptions(column)
                            } : undefined" :style="getColumnBodyStyle(column)">
                                {{ getDisplayText(column, slotProps.data, slotProps.index) }}
                            </div>
                            <template v-else>
                                {{ getDisplayText(column, slotProps.data, slotProps.index) }}
                            </template>
                        </template>

                        <!-- 默认字段内容 -->
                        <template v-else #body="slotProps">
                            <div v-if="(column as any).ellipsis || (column as any).showTooltip" v-tooltip="(column as any).showTooltip ? {
                                value: getTooltipContent(column, slotProps.data, slotProps.index),
                                ...getTooltipOptions(column)
                            } : undefined" :style="getColumnBodyStyle(column)">
                                {{ getDisplayText(column, slotProps.data, slotProps.index) }}
                            </div>
                            <template v-else>
                                {{ column.field ? slotProps.data[column.field] : '' }}
                            </template>
                        </template>
                    </Column>
                </template>

                <!-- 额外的列插槽 -->
                <slot />

                <!-- 优化的空状态 -->
                <template #empty>
                    <slot name="empty">
                        <div class="empty-state">
                            <i class="pi pi-inbox empty-icon" />
                            <p class="empty-text">暂无数据</p>
                            <Button v-if="!loading" label="刷新" icon="pi pi-refresh" text @click="handleRefresh" />
                        </div>
                    </slot>
                </template>

                <!-- 优化的加载状态 -->
                <template #loading>
                    <slot name="loading">
                        <div class="loading-state">
                            <i class="pi pi-spin pi-spinner loading-icon" />
                            <p class="loading-text">加载中...</p>
                        </div>
                    </slot>
                </template>
            </DataTable>
            <!-- 独立分页器组件 -->
            <Paginator v-model:first="first" :rows="rows" :total-records="totalRecords"
                :rows-per-page-options="rowsPerPageOptions" :template="paginatorTemplate"
                :current-page-report-template="currentPageReportTemplate" :page-link-size="pageLinkSize"
                :always-show="alwaysShowPaginator" class="mt-3" @page="handlePaginatorPage" />
        </div>

        <!-- 列设置组件 -->
        <TableColumnSettings ref="columnSettingsRef" :columns="internalColumns"
            :selected-style="(selectedStyle as 'small' | 'normal' | 'large')"
            :table-settings="currentTableSettings as any" @update:columns="handleColumnsChange"
            @column-change="handleColumnChange" @style-change="handleStyleChange"
            @setting-change="handleTableSettingChange" @update:selected-style="(selectedStyle as any) = $event"
            @update:table-settings="currentTableSettings = $event as any">
            <template #column-label="{ column }">
                <slot name="column-label" :column="column">
                    {{ column.header || column.title || column.field || column.key }}
                </slot>
            </template>
        </TableColumnSettings>
    </div>
</template>

<style lang="scss" scoped>
.configurable-table {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.table-container {
    flex: 1;
    position: relative;
    overflow: hidden;
}

.empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--surface-500);
}

.empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
}

.empty-text {
    font-size: 1.125rem;
    margin-bottom: 1rem;
}

.loading-state {
    text-align: center;
    padding: 2rem;
}

.loading-icon {
    font-size: 1.5rem;
    color: var(--primary-color);
}

.loading-text {
    margin-top: 0.5rem;
    color: var(--surface-600);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .configurable-table {
        padding: 0 0.5rem;
    }

    :deep(.p-datatable) {
        font-size: 0.875rem;
    }

    :deep(.p-datatable .p-datatable-tbody > tr > td) {
        padding: 0.5rem 0.25rem;
    }
}

/* 深色主题支持 */
@media (prefers-color-scheme: dark) {
    .empty-state {
        color: var(--surface-400);
    }

    .loading-text {
        color: var(--surface-400);
    }
}




/* 表头样式 */
:deep(.p-datatable-header-cell) {
    --p-datatable-header-cell-padding: 1rem;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
    background-color: #f8fafc;
    color: #374151;
    font-weight: 600;
}

:deep(.p-datatable .p-datatable-thead > tr > th:hover) {
    background-color: #f1f5f9;
}

/* 快速修复 - 添加到现有样式中 */
.table-container {
    contain: layout style paint;
    transform: translateZ(0);
}

:deep(.p-datatable) {
    contain: layout;
    will-change: transform;
}

:deep(.p-datatable *) {
    transition-duration: 0s !important;
    animation-duration: 0s !important;
}
</style>
