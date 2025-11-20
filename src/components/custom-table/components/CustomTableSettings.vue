<script setup lang="ts">
import { computed, ref, watch, withDefaults } from 'vue';
import type { TableColumns } from '@/composables/useColumns.ts';
import { reorderColumns } from '@/composables/useColumns.ts';
import type { CustomTableSettingsProps, CustomTableSettingsEmits, CustomTableColumn } from '../types/types.ts';
import {
    DEFAULT_TABLE_SETTINGS,
    STYLE_OPTIONS,
    TABLE_SETTINGS_OPTIONS,
} from '../const/constants.ts';

const props = withDefaults(defineProps<CustomTableSettingsProps>(), {
    title: '表格设置',
    showStyleOptions: true,
    showTableSettings: true,
    enableDrag: true,
    selectedStyle: 'normal',
    tableSettings: () => ({ ...DEFAULT_TABLE_SETTINGS }),
    styleOptions: () => [...STYLE_OPTIONS],
    tableSettingsOptions: () => [...TABLE_SETTINGS_OPTIONS],
});

const emit = defineEmits<CustomTableSettingsEmits>();

// 组件引用
const popoverRef = ref();

// 内部状态
const internalColumns = ref([...props.columns]);
const currentTableSettings = ref({ ...props.tableSettings });

// 监听 props 变化
watch(
    () => props.columns,
    (newColumns) => {
        internalColumns.value = [...newColumns];
    },
    { deep: true }
);

watch(
    () => props.tableSettings,
    (newSettings) => {
        currentTableSettings.value = { ...newSettings };
    },
    { deep: true }
);

// 计算属性
const sortedColumns = computed(() => {
    return [...internalColumns.value].sort((a, b) => {
        const aOrder = (a as any).order || 0;
        const bOrder = (b as any).order || 0;
        return aOrder - bOrder;
    });
});

/**
 * 计算表格样式类
 */
const tableClasses = computed(() => {
    const classes: string[] = [];

    switch (props.selectedStyle) {
        case 'small':
            classes.push('p-datatable-sm');
            break;
        case 'large':
            classes.push('p-datatable-lg');
            break;
        case 'normal':
        default:
            break;
    }

    if (currentTableSettings.value.stripedRows) {
        classes.push('p-datatable-striped');
    }

    if (currentTableSettings.value.showBorder) {
        classes.push('p-datatable-gridlines');
    }

    return classes;
});

/**
 * 计算表格内联样式
 */
const tableStyles = computed(() => {
    const styles: Record<string, string> = {};

    if (currentTableSettings.value.showShadow) {
        styles.boxShadow = '0 2px 12px 0 rgba(0, 0, 0, 0.1)';
    }

    return styles;
});

/**
 * 计算行样式配置
 */
const rowStyleConfig = computed(() => {
    return {
        showDivider: currentTableSettings.value.showRowDivider,
        striped: currentTableSettings.value.stripedRows,
        shadow: currentTableSettings.value.showShadow,
        border: currentTableSettings.value.showBorder
    };
});

/**
 * 获取表格尺寸配置
 */
const tableSizeConfig = computed(() => {
    const sizeMap = {
        small: {
            size: 'small',
            cellPadding: '0.25rem 0.5rem',
            fontSize: '0.875rem'
        },
        normal: {
            size: 'normal',
            cellPadding: '0.5rem 0.75rem',
            fontSize: '1rem'
        },
        large: {
            size: 'large',
            cellPadding: '0.75rem 1rem',
            fontSize: '1rem'
        }
    };

    return sizeMap[props.selectedStyle as keyof typeof sizeMap] || sizeMap.normal;
});

/**
 * 切换弹窗显示状态
 */
function toggle(event: Event): void {
    popoverRef.value?.toggle(event);
}

/**
 * 处理样式变化
 */
function handleStyleChange(styleName: 'small' | 'normal' | 'large'): void {
    emit('update:selectedStyle', styleName);
    emit('style-change', styleName);
}

/**
 * 处理表格设置变化
 */
function handleTableSettingChange(key: string, value: any): void {
    currentTableSettings.value[key] = value;
    emit('update:tableSettings', { ...currentTableSettings.value });
    emit('setting-change', key, value);
}

/**
 * 获取列的唯一标识
 */
function getColumnKey(column: CustomTableColumn): string {
    return column.key || column.field || '';
}

/**
 * 获取列的显示文本
 */
function getColumnDisplayText(column: CustomTableColumn): string {
    return column.header || column.title || column.text || column.field || column.key || '';
}

/**
 * 获取列的冻结状态
 */
function getColumnFrozen(column: CustomTableColumn): boolean | undefined {
    return column.frozen;
}

/**
 * 获取列的固定方向
 */
function getColumnFrozenDirection(column: CustomTableColumn): 'left' | 'right' | 'none' {
    if (!column.frozen) {
        return 'none';
    }
    return column.alignFrozen || 'left';
}

/**
 * 检查列是否可见
 */
function isColumnVisible(columnKey: string): boolean {
    const column = internalColumns.value.find((col) => getColumnKey(col) === columnKey);
    return column ? !(column as any).disabled : false;
}

/**
 * 处理列可见性切换
 */
function handleToggleVisibility(column: CustomTableColumn): void {
    const columnKey = getColumnKey(column);
    const targetColumn = internalColumns.value.find((col) => getColumnKey(col) === columnKey);

    if (targetColumn) {
        targetColumn.disabled = !targetColumn.disabled;
        emit('update:columns', [...internalColumns.value]);
        emit('column-change', targetColumn, 'visibility');
    }
}

/**
 * 处理固定方向变化
 */
function handleFrozenDirectionChange(columnKey: string, direction: 'left' | 'right' | 'none'): void {
    const targetColumn = internalColumns.value.find((col) => getColumnKey(col) === columnKey);

    if (targetColumn) {
        if (direction === 'none') {
            targetColumn.frozen = false;
            targetColumn.alignFrozen = undefined;
        } else {
            targetColumn.frozen = true;
            targetColumn.alignFrozen = direction;
        }

        emit('update:columns', [...internalColumns.value]);
        emit('column-change', targetColumn, 'frozen');
    }
}

/**
 * 拖拽开始事件处理
 */
function onColumnDragStart(event: DragEvent, index: number): void {
    if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', index.toString());
        event.dataTransfer.effectAllowed = 'move';
    }
}

/**
 * 拖拽悬停事件处理
 */
function onColumnDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
    }
}

/**
 * 拖拽放置事件处理
 */
function onColumnDrop(event: DragEvent, toIndex: number): void {
    event.preventDefault();
    if (event.dataTransfer) {
        const fromIndex = parseInt(event.dataTransfer.getData('text/plain'));

        if (fromIndex !== toIndex) {
            internalColumns.value = reorderColumns(internalColumns.value, fromIndex, toIndex);
            emit('update:columns', [...internalColumns.value]);
            emit('column-change', { fromIndex, toIndex }, 'order');
        }
    }
}

/**
 * 获取完整的表格配置
 */
function getTableConfig() {
    return {
        classes: tableClasses.value,
        styles: tableStyles.value,
        rowConfig: rowStyleConfig.value,
        sizeConfig: tableSizeConfig.value,
        selectedStyle: props.selectedStyle,
        settings: currentTableSettings.value
    };
}

// 暴露组件方法和计算属性
defineExpose({
    toggle,
    tableClasses,
    tableStyles,
    rowStyleConfig,
    tableSizeConfig,
    getTableConfig
});
</script>

<template>
    <Popover ref="popoverRef">
        <div class="w-80">
            <!-- 头部 -->
            <div class="p-4 border-b border-surface-200">
                <h3 class="text-lg font-semibold text-surface-900 m-0">{{ title }}</h3>
            </div>

            <div class="p-4 space-y-6">
                <!-- 外观选择 -->
                <div v-if="showStyleOptions">
                    <h4 class="text-sm font-medium text-surface-700 mb-3">外观</h4>
                    <div class="grid grid-cols-3 gap-3">
                        <div
                            v-for="style in styleOptions"
                            :key="style.name"
                            class="relative p-3 border border-surface-200 rounded-lg cursor-pointer hover:bg-surface-50 transition-colors"
                            :class="selectedStyle === style.name ? 'border-primary bg-primary-50' : ''"
                            @click="handleStyleChange(style.name)"
                        >
                            <!-- 选中状态图标 -->
                            <div v-if="selectedStyle === style.name" class="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center">
                                <i class="pi pi-check text-xs"></i>
                            </div>

                            <!-- 样式预览 -->
                            <div class="space-y-1 mb-2">
                                <div class="h-1 bg-surface-300 rounded" :style="style.preview.header"></div>
                                <div class="h-1 bg-surface-200 rounded" :style="style.preview.row"></div>
                                <div class="h-1 bg-surface-200 rounded" :style="style.preview.row"></div>
                            </div>

                            <div class="text-xs text-center font-medium text-surface-700">
                                {{ style.label }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 开关选项 -->
                <div v-if="showTableSettings" class="space-y-4">
                    <div v-for="setting in tableSettingsOptions" :key="setting.key" class="flex items-center justify-between">
                        <span class="text-sm font-medium text-surface-700">{{ setting.label }}</span>
                        <ToggleSwitch :model-value="currentTableSettings[setting.key]" class="ml-auto" @update:model-value="handleTableSettingChange(setting.key, $event)" />
                    </div>
                </div>

                <!-- 可选列 -->
                <div>
                    <h4 class="text-sm font-medium text-surface-700 mb-3">可选列</h4>
                    <div class="space-y-2 overflow-y-auto max-h-60">
                        <div
                            v-for="(column, index) in sortedColumns"
                            :key="getColumnKey(column)"
                            class="flex items-center gap-3 p-2 rounded-md hover:bg-surface-50 transition-colors"
                            :draggable="enableDrag"
                            @dragstart="onColumnDragStart($event, index)"
                            @dragover="onColumnDragOver($event)"
                            @drop="onColumnDrop($event, index)"
                        >
                            <!-- 拖拽手柄 -->
                            <i v-if="enableDrag" class="pi pi-arrows-alt text-surface-400 cursor-move text-sm"></i>

                            <!-- 列名 -->
                            <span class="text-sm text-surface-700 flex-1 truncate">
                                <slot name="column-label" :column="column">
                                    {{ getColumnDisplayText(column) }}
                                </slot>
                            </span>

                            <!-- 固定列控制 -->
                            <div class="flex items-center gap-1">
                                <!-- 固定左侧 -->
                                <div v-tooltip.top="'固定到左侧'" class="freeze-button freeze-left" :class="{ active: getColumnFrozenDirection(column) === 'left' }" @click="handleFrozenDirectionChange(getColumnKey(column), 'left')">
                                    <div class="freeze-icon">
                                        <div class="freeze-bar left"></div>
                                        <div class="freeze-content"></div>
                                    </div>
                                </div>

                                <!-- 取消固定 -->
                                <div v-tooltip.top="'取消固定'" class="freeze-button freeze-none" :class="{ active: getColumnFrozenDirection(column) === 'none' }" @click="handleFrozenDirectionChange(getColumnKey(column), 'none')">
                                    <div class="freeze-icon">
                                        <div class="freeze-content full"></div>
                                    </div>
                                </div>

                                <!-- 固定右侧 -->
                                <div v-tooltip.top="'固定到右侧'" class="freeze-button freeze-right" :class="{ active: getColumnFrozenDirection(column) === 'right' }" @click="handleFrozenDirectionChange(getColumnKey(column), 'right')">
                                    <div class="freeze-icon">
                                        <div class="freeze-content"></div>
                                        <div class="freeze-bar right"></div>
                                    </div>
                                </div>
                            </div>

                            <!-- 选中状态 -->
                            <Checkbox :model-value="isColumnVisible(getColumnKey(column))" :binary="true" class="flex-shrink-0" @update:model-value="() => handleToggleVisibility(column)" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Popover>
</template>

<style scoped>
.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* 固定列按钮样式 */
.freeze-button {
    width: 24px;
    height: 20px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    position: relative;
}

.freeze-button:hover {
    border-color: #3b82f6;
    background: #f8fafc;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.freeze-button.active {
    border-color: #3b82f6;
    background: #dbeafe;
    box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1);
}

.freeze-button.active:hover {
    background: #bfdbfe;
}

.freeze-icon {
    width: 14px;
    height: 10px;
    position: relative;
    display: flex;
    align-items: center;
}

.freeze-bar {
    width: 2px;
    height: 10px;
    background: #6b7280;
    border-radius: 1px;
    transition: background-color 0.2s ease;
}

.freeze-button.active .freeze-bar {
    background: #3b82f6;
}

.freeze-content {
    flex: 1;
    height: 6px;
    background: #e5e7eb;
    border-radius: 1px;
    margin: 0 1px;
    transition: background-color 0.2s ease;
}

.freeze-content.full {
    width: 14px;
    margin: 0;
}

.freeze-button.active .freeze-content {
    background: #93c5fd;
}

.freeze-bar.left {
    order: 1;
}

.freeze-bar.right {
    order: 3;
}

.freeze-left .freeze-content {
    order: 2;
}

.freeze-right .freeze-content {
    order: 1;
}

/* 增强悬浮效果 */
.freeze-button:hover .freeze-bar {
    background: #4f46e5;
}

.freeze-button:hover .freeze-content {
    background: #c7d2fe;
}

.freeze-button.active:hover .freeze-bar {
    background: #2563eb;
}

.freeze-button.active:hover .freeze-content {
    background: #7c3aed;
}
</style>
