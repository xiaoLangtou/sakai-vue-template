<script lang="ts" setup>
import { computed, h, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { ListSearch } from '@/components';
import CustomTableSettings from './components/CustomTableSettings.vue';
import { useTableConfiguration, useTableEvents, useTablePersistence, useTableStyles } from '@/composables';
import type { CustomTableColumn, CustomTableEmits, CustomTableProps } from './types/types.ts';
import { DEBOUNCE_DELAYS, DEFAULT_ACTION_COLUMN, DEFAULT_PAGINATION_CONFIG, DEFAULT_TABLE_CONFIG, DEFAULT_TABLE_SETTINGS, DEFAULT_TOOLTIP_OPTIONS, FROZEN_COLUMN_CONFIG } from './const/constants.ts';

const props = withDefaults(defineProps<CustomTableProps>(), {
    ...DEFAULT_TABLE_CONFIG,
    ...DEFAULT_PAGINATION_CONFIG,
    rowsPerPageOptions: () => [5, 10, 20, 50],
    tableSettings: () => ({ ...DEFAULT_TABLE_SETTINGS }),
    actions: () => ({ ...DEFAULT_ACTION_COLUMN })
});

const emit = defineEmits<CustomTableEmits>();

// 使用 composables 管理复杂逻辑
const { internalColumns, processedColumns, actionColumn, handleColumnsChange, handleColumnChange } = useTableConfiguration(props, emit);

const { computedTableClass, computedTableStyle, selectedStyle, currentTableSettings, showGridlines, showStripedRows, handleStyleChange, handleTableSettingChange, getColumnBodyStyle, getHeaderStyle } = useTableStyles(props);

const { handleRowClick, handleRowDblClick, handleSort: handleSortEvent, handleFilterChange, handleRefresh, handleSelectionChange } = useTableEvents(emit);

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
        ...event
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
        paginator: false
    };
    if (props.virtualScroll && currentTableSettings.value.virtualScroll) {
        baseConfig.virtualScrollerOptions = {
            itemSize: props.virtualScrollItemSize || currentTableSettings.value.virtualScrollItemSize || 46,
            showLoader: true,
            loading: props.loading
        };
    }

    return baseConfig;
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

const getTooltipContent = (column: CustomTableColumn, rowData: any, index: number): string => {
    if (column.tooltipContent) {
        return typeof column.tooltipContent === 'function' ? column.tooltipContent(rowData, index) : column.tooltipContent;
    }

    const field = column.tooltipField || column.field;
    if (field && rowData) {
        const fieldPath = getFieldPath(field);
        const value = getNestedValue(rowData, fieldPath);
        return value?.toString() || '';
    }

    return '';
};

const getDisplayText = (column: CustomTableColumn, rowData: any, index: number): string => {
    if (column.text) {
        return typeof column.text === 'function' ? column.text(rowData, index) : column.text;
    }

    if (column.field && rowData) {
        const fieldPath = getFieldPath(column.field);
        const value = getNestedValue(rowData, fieldPath);
        return value?.toString() || '';
    }

    return '';
};

const getTooltipOptions = (column: CustomTableColumn): Record<string, any> => {
    return { ...DEFAULT_TOOLTIP_OPTIONS, ...column.tooltipOptions };
};

/**
 * 使用 render 函数渲染操作列内容
 * @param column - 操作列配置
 * @param slotProps - 插槽属性
 * @returns VNode
 */
const renderActionColumn = (column: CustomTableColumn, slotProps: any) => {
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

/**
 * 更新固定列位置
 * 优化后的实现：使用 PrimeVue 原生 API 和强制更新
 */
const updateFrozenColumns = () => {
    if (!dataTableRef.value) return;

    nextTick(() => {
        try {
            // 强制更新组件以触发固定列重新计算
            if (typeof dataTableRef.value.$forceUpdate === 'function') {
                dataTableRef.value.$forceUpdate();
            }

            // 备用方案：直接操作 DOM（仅在必要时使用）
            const tableElement = dataTableRef.value.$el;
            if (tableElement) {
                requestAnimationFrame(() => {
                    FROZEN_COLUMN_CONFIG.selectors.forEach((selector) => {
                        const frozenCells = tableElement.querySelectorAll(selector);
                        frozenCells.forEach((cell: any) => {
                            const vueInstance = cell.__vueParentComponent;
                            if (vueInstance?.ctx?.updateStickyPosition) {
                                vueInstance.ctx.updateStickyPosition();
                            }
                        });
                    });
                });
            }
        } catch (error) {
            console.warn('Failed to update frozen columns:', error);
        }
    });
};

// 窗口大小变化处理
const handleWindowResize = () => {
    updateFrozenColumns();
};

// 防抖处理窗口大小变化
let resizeTimer: NodeJS.Timeout | null = null;
const debouncedHandleResize = () => {
    if (resizeTimer) {
        clearTimeout(resizeTimer);
    }
    resizeTimer = setTimeout(handleWindowResize, DEBOUNCE_DELAYS.RESIZE);
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
    }, DEBOUNCE_DELAYS.SAVE_STATE);
};

// 监听状态变化并保存
watch([internalColumns, selectedStyle, currentTableSettings], debouncedSaveState, { deep: true });

// 监听当前页变化
watch(
    () => props.current,
    (newVal: number) => {
        first.value = (newVal - 1) * props.rows;
        rows.value = props.rows;
    }
);

// 监听列变化，更新固定列
watch(
    () => processedColumns.value,
    () => {
        updateFrozenColumns();
    },
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
    <div class="custom-table">
        <!-- 搜索和工具栏 -->
        <ListSearch :filter-configs="filterConfigs ?? []" :loading="loading" :model-value="searchParams" placeholder="请输入搜索内容" @search="handleFilterChange">
            <template #actions>
                <!-- 刷新按钮 -->
                <Button :disabled="loading" class="mr-2" icon="pi pi-refresh" outlined severity="secondary" @click="handleRefresh" />

                <!-- 导出按钮 -->
                <Button :disabled="loading || !hasData" class="mr-2" icon="pi pi-download" outlined severity="secondary" @click="exportData" />

                <!-- 列设置 -->
                <Button class="mr-2" icon="pi pi-cog" outlined severity="secondary" @click="openColumnSettings" />
            </template>
        </ListSearch>

        <!-- 分割线 -->
        <Divider type="dashed" />

        <!-- 表格容器 -->
        <div class="table-container">
            <DataTable
                ref="dataTableRef"
                :value="data"
                v-bind="{ ...$attrs, ...tableBaseConfig, rowHover: true, dataKey: dataKey, style: computedTableStyle, class: computedTableClass }"
                @sort="(event: any) => handleSortEvent(event)"
                @row-click="handleRowClick"
                @row-dblclick="handleRowDblClick"
                @selection-change="handleSelectionChange"
            >
                <!-- 动态生成列 - 优化key策略 -->
                <template v-for="(column, columnIndex) in processedColumns" :key="`${column.key || column.field || columnIndex}-${column.header || column.title}`">
                    <Column
                        :align-frozen="column.alignFrozen"
                        :body-style="getColumnBodyStyle(column)"
                        :field="column.field"
                        :frozen="column.frozen"
                        :header="column.header || column.title"
                        :header-style="hasData ? getHeaderStyle(column) : undefined"
                        :selection-mode="(column as any).selectionMode"
                        :sortable="column.sortable ?? false"
                    >
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
                            <div
                                v-if="(column as any).ellipsis || (column as any).showTooltip"
                                v-tooltip.bottom="
                                    (column as any).showTooltip
                                        ? {
                                              value: getTooltipContent(column, slotProps.data, slotProps.index),
                                              ...getTooltipOptions(column)
                                          }
                                        : undefined
                                "
                                class="w-full overflow-hidden text-ellipsis"
                            >
                                {{ getDisplayText(column, slotProps.data, slotProps.index) }}
                            </div>
                            <template v-else>
                                {{ column.field ? slotProps.data[column.field] : '' }}
                            </template>
                        </template>
                    </Column>
                </template>
                <!-- 操作列 -->
                <Column :body-style="hasData ? getColumnBodyStyle(actionColumn) : undefined" :header-style="hasData ? getHeaderStyle(actionColumn) : undefined" v-bind="actionColumn">
                    <template #body="slotProps">
                        <!-- 优先使用 render 函数 -->
                        <component :is="renderActionColumn(actionColumn as any, slotProps)" v-if="(actionColumn as any).render" />
                        <!-- 否则使用插槽 -->
                        <slot v-else :name="(actionColumn as any).slotName ? (actionColumn as any).slotName : actionColumn.field" v-bind="slotProps"></slot>
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
                            <Button v-if="!loading" icon="pi pi-refresh" label="刷新" text @click="handleRefresh" />
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
            <Paginator
                v-model:first="first"
                :always-show="alwaysShowPaginator"
                :current-page-report-template="currentPageReportTemplate"
                :page-link-size="pageLinkSize"
                :rows="rows"
                :rows-per-page-options="rowsPerPageOptions"
                :template="paginatorTemplate"
                :total-records="totalRecords"
                class="mt-3"
                @page="handlePaginatorPage"
            />
        </div>

        <!-- 列设置组件 -->
        <CustomTableSettings
            ref="columnSettingsRef"
            :columns="internalColumns"
            :selected-style="selectedStyle"
            :table-settings="currentTableSettings"
            @update:columns="handleColumnsChange"
            @column-change="handleColumnChange"
            @style-change="handleStyleChange"
            @setting-change="handleTableSettingChange"
            @update:selected-style="selectedStyle = $event"
            @update:table-settings="currentTableSettings = $event"
        >
            <template #column-label="{ column }">
                <slot :column="column" name="column-label">
                    {{ column.header || column.title || column.field || column.key }}
                </slot>
            </template>
        </CustomTableSettings>
    </div>
</template>

<style lang="scss" scoped>
.custom-table {
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
    .custom-table {
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

:deep(.p-datatable.p-datatable-striped .p-datatable-tbody > tr.p-row-odd td.p-datatable-frozen-column) {
    background: var(--p-datatable-row-striped-background);
}

:deep(.p-datatable-hoverable .p-datatable-tbody > tr:not(.p-datatable-row-selected):hover .p-datatable-frozen-column) {
    background: var(--p-datatable-row-hover-background);
    color: var(--p-datatable-row-hover-color);
}
</style>
