<script setup lang="ts">
import { ListSearch } from '@/components';
import TableColumnSettings from '@/components/table-column-settings/index.vue';
import { useTableConfiguration, useTableEvents, useTablePersistence, useTableStyles } from '@/composables';
import type {
    ConfigurableTableEmits,
    ConfigurableTableProps,
    TableColumn
} from '@/types/table';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';



// 使用全局事件类型
type Emits<T = any> = ConfigurableTableEmits<T>;

const props = withDefaults(defineProps<ConfigurableTableProps>(), {
    dataKey: 'id',
    showGridlines: false,
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
    stripedRows: false,
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
        stripedRows: false,
        showShadow: false,
        showBorder: true,
        virtualScroll: false,
        virtualScrollItemSize: 46
    }),
    actions: () => ({
        field: 'column-actions',
        header: '操作',
        headerStyle: {
            display: 'flex',
            justifyContent: 'center'
        },
        frozen: false,
    })
});

const emit = defineEmits<Emits>();

// 使用 composables 管理复杂逻辑
const {
    internalColumns,
    processedColumns,
    actionColumn,
    handleColumnsChange,
    handleColumnChange
} = useTableConfiguration(props, emit as any);

const {
    computedTableClass,
    computedTableStyle,
    selectedStyle,
    currentTableSettings,
    showGridlines,
    showStripedRows,
    handleStyleChange,
    handleTableSettingChange,
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
const first = ref((props.current - 1) * props.rows);
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
const hasData = computed(() => props.data && props.data.length > 0);

// 表格基础配置
const tableBaseConfig = computed(() => {
    const baseConfig = {
        // 显示网格线
        showGridlines: showGridlines.value,
        // 显示斑马纹
        stripedRows: showStripedRows.value,
        // 滚动高度
        scrollHeight: props.virtualScroll ? '400px' : 'flex',
        // 是否可滚动
        scrollable: props.scrollable,
        // 列是否可调整宽度
        resizableColumns: true,
        // 列调整宽度模式
        columnResizeMode: 'expand',
        // 响应式布局
        responsiveLayout: props.responsiveLayout,
        // 加载状态
        loading: props.loading,
        // 选择模式
        selectionMode: props.selectionMode,
        // 选中的行
        selection: props.selection,
        // virtualScrollerOptions
        virtualScrollerOptions: {},
        // 分页器
        paginator: false,
    }


    if (props.virtualScroll && currentTableSettings.value.virtualScroll) {
        baseConfig.virtualScrollerOptions = {
            itemSize: props.virtualScrollItemSize || currentTableSettings.value.virtualScrollItemSize || 46,
            showLoader: true,
            loading: props.loading
        }
    }



    return baseConfig;
})

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
        showDelay: 300,
        hideDelay: 0,
        autoHide: true,
        escape: true
    };

    return { ...defaultOptions, ...column.tooltipOptions };
};

/**
 * 使用 render 函数渲染操作列内容
 * @param column - 操作列配置
 * @param slotProps - 插槽属性
 * @returns VNode
 */
const renderActionColumn = (column: TableColumn<any>, slotProps: any) => {
    const { h } = require('vue');

    if (column.render && typeof column.render === 'function') {
        const result = column.render(slotProps.data, slotProps.index);
        // 如果render函数返回的是VNode，直接返回；否则包装成文本节点
        return typeof result === 'object' && result !== null ? result : h('span', {}, result);
    }

    // 如果没有render函数，返回空span
    return h('span', {}, '');
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

// 窗口大小变化处理
const handleWindowResize = () => {
    // 强制重新计算表格布局
    if (dataTableRef.value) {
        nextTick(() => {
            try {
                // // 方法1: 通过强制更新组件来触发固定列重新计算
                // // 这是更优雅的方式，利用Vue的响应式系统
                if (typeof dataTableRef.value.$forceUpdate === 'function') {
                    dataTableRef.value.$forceUpdate();
                }
                const tableElement = dataTableRef.value.$el;
                if (tableElement) {
                    // 定义更新固定列位置的函数
                    const updateFrozenCellsPosition = () => {
                        // 查找所有固定列单元格，使用多种选择器确保覆盖所有情况
                        const selectors = [
                            '.p-datatable-thead th[data-p-frozen-column="true"]',
                        ];

                        selectors.forEach(selector => {
                            const frozenCells = tableElement.querySelectorAll(selector);
                            frozenCells.forEach((cell: any) => {
                                const vueInstance = cell.__vueParentComponent;
                                if (vueInstance?.ctx?.updateStickyPosition) {
                                    vueInstance.ctx.updateStickyPosition();
                                }
                            });
                        });
                    };

                    // 使用多重延迟确保DOM完全更新后再执行
                    requestAnimationFrame(() => {
                        updateFrozenCellsPosition();
                    });
                }
            } catch (error) {
                console.warn('Failed to update frozen columns:', error);
            }
        });
    }
};

// 防抖处理窗口大小变化
let resizeTimer: NodeJS.Timeout | null = null;
const debouncedHandleResize = () => {
    if (resizeTimer) {
        clearTimeout(resizeTimer);
    }
    resizeTimer = setTimeout(handleWindowResize, 10);
};

// 生命周期
onMounted(() => {
    if (props.persistState) {
        restoreState();
    }

    // 添加窗口大小变化监听
    window.addEventListener('resize', debouncedHandleResize);
});

// 组件卸载时清理
onBeforeUnmount(() => {
    // 清理防抖定时器
    if (saveStateTimer) {
        clearTimeout(saveStateTimer);
        saveStateTimer = null;
    }

    // 清理窗口resize定时器
    if (resizeTimer) {
        clearTimeout(resizeTimer);
        resizeTimer = null;
    }

    // 移除窗口大小变化监听
    window.removeEventListener('resize', debouncedHandleResize);

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

watch(() => props.current, (newVal: number) => {
    first.value = (newVal - 1) * props.rows;
    rows.value = props.rows;
})


// 暴露组件方法
defineExpose({
    openColumnSettings,
    exportData,
    getTableConfig: () => ({
        classes: computedTableClass.value,
        styles: computedTableStyle.value,
        selectedStyle: selectedStyle.value,
        settings: {
            ...tableBaseConfig.value
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
            <DataTable ref="dataTableRef" :value="data"
                v-bind="{ ...$attrs, ...tableBaseConfig, rowHover: true, dataKey: dataKey, style: computedTableStyle, class: computedTableClass }"
                @row-click="handleRowClick" @row-dblclick="handleRowDblClick"
                @sort="(event: any) => handleSortEvent(event)" @selection-change="handleSelectionChange">
                <!-- 动态生成列 - 优化key策略 -->
                <template v-for="(column, columnIndex) in processedColumns"
                    :key="`${column.key || column.field || columnIndex}-${column.header || column.title}`">
                    <Column :field="column.field" :header="column.header || column.title"
                        :sortable="column.sortable ?? false" :frozen="column.frozen" :align-frozen="column.alignFrozen"
                        :header-style="hasData ? getHeaderStyle(column) : undefined"
                        :body-style="getColumnBodyStyle(column)" :selection-mode="(column as any).selectionMode">
                        <!-- 自定义列内容 -->
                        <template v-if="$slots[`column-${column.key || column.field}`]" #body="slotProps">
                            <slot :name="`column-${column.key || column.field}`" v-bind="slotProps" />
                        </template>

                        <!-- 渲染函数内容 -->
                        <template v-else-if="column.render" #body="slotProps">
                            <component :is="column.render!(slotProps.data, slotProps.index)" />
                        </template>

                        <!-- 默认字段内容 -->
                        <template v-else #body="slotProps">
                            <div v-if="(column as any).ellipsis || (column as any).showTooltip" v-tooltip.bottom="(column as any).showTooltip ? {
                                value: getTooltipContent(column, slotProps.data, slotProps.index),
                                ...getTooltipOptions(column)
                            } : undefined" class="w-full overflow-hidden text-ellipsis">
                                {{ getDisplayText(column, slotProps.data, slotProps.index) }}
                            </div>
                            <template v-else>
                                {{ column.field ? slotProps.data[column.field] : '' }}
                            </template>
                        </template>
                    </Column>
                </template>
                <!-- 操作列 -->
                <Column v-bind="actionColumn" :header-style="hasData ? getHeaderStyle(actionColumn) : undefined"
                    :body-style="hasData ? getColumnBodyStyle(actionColumn) : undefined">
                    <template #body="slotProps">
                        <!-- 优先使用 render 函数 -->
                        <component v-if="(actionColumn as any).render"
                            :is="renderActionColumn(actionColumn as any, slotProps)" />
                        <!-- 否则使用插槽 -->
                        <slot v-else
                            :name="(actionColumn as any).slotName ? (actionColumn as any).slotName : actionColumn.field"
                            v-bind="slotProps"></slot>
                    </template>
                </Column>
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
            :table-settings="(currentTableSettings as any)" @update:columns="handleColumnsChange"
            @column-change="handleColumnChange" @style-change="handleStyleChange"
            @setting-change="handleTableSettingChange" @update:selected-style="(selectedStyle as any) = $event"
            @update:table-settings="currentTableSettings = ($event as any)">
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

:deep(.p-datatable-frozen-column) {
    &:not(:last-child) {
        border-right: 0 !important;
    }
}

:deep(.p-datatable.p-datatable-striped .p-datatable-tbody>tr.p-row-odd td.p-datatable-frozen-column) {
    background: var(--p-datatable-row-striped-background);

}

:deep(.p-datatable-hoverable .p-datatable-tbody > tr:not(.p-datatable-row-selected):hover .p-datatable-frozen-column) {
    background: var(--p-datatable-row-hover-background);
    color: var(--p-datatable-row-hover-color);
}
</style>
