import { computed, unref } from 'vue';
import type { Ref, MaybeRef } from 'vue';
import type { TableBaseColumn, TableColumnGroup, TableColumn, TableColumns } from '@/types/table';

/**
 * 判断是否为列组
 */

/**
 * 判断是否为列组
 */
function isColumnGroup<T>(column: TableColumn<T>): column is TableColumnGroup<T> {
    return 'children' in column && Array.isArray(column.children);
}

/**
 * 判断列是否被禁用
 */
function isColumnDisabled<T>(column: TableColumn<T>, row?: T, index?: number): boolean {
    const { disabled } = column;
    if (typeof disabled === 'boolean') {
        return disabled;
    }
    if (typeof disabled === 'function' && row !== undefined && index !== undefined) {
        return disabled(row, index);
    }
    if (disabled && typeof disabled === 'object' && 'value' in disabled) {
        return disabled.value;
    }
    return false;
}

/**
 * 使用表格列管理
 * @param columns - 列配置数组
 * @returns 处理后的列配置
 */
export function useColumns<T>(columns: MaybeRef<TableColumns<T>>) {
    // 缓存处理过的列，避免重复计算
    const processedColumnsCache = new WeakMap<TableColumn<T>, TableColumn<T>>();

    const processColumn = (col: TableColumn<T>): TableColumn<T> => {
        // 检查缓存
        if (processedColumnsCache.has(col)) {
            return processedColumnsCache.get(col)!;
        }

        // 直接使用原始列配置，不强制设置默认 minWidth
        const processedCol = { ...col };

        // 如果是列组，递归处理子列
        if (isColumnGroup(processedCol) && processedCol.children) {
            processedCol.children = processedCol.children.filter((childCol) => !isColumnDisabled(childCol)).map((childCol) => processColumn(childCol));
        }

        // 缓存结果
        processedColumnsCache.set(col, processedCol);
        return processedCol;
    };

    const value = computed(() => {
        const cols = unref(columns);
        return cols.filter((col) => !isColumnDisabled(col)).map((col) => processColumn(col));
    });

    return value;
}

/**
 * 根据 key 查找指定列
 * @param columns - 列配置数组
 * @param key - 列的唯一标识
 * @returns 找到的列配置
 */
export function useColumn<T>(columns: MaybeRef<TableColumns<T>>, key: string): TableColumn<T> | undefined {
    const cols = unref(columns);

    // 递归查找列（包括列组中的子列）
    function findColumn(columnList: TableColumns<T>): TableColumn<T> | undefined {
        for (const col of columnList) {
            // 检查当前列
            if ((col as TableBaseColumn<T>).key === key) {
                return col;
            }

            // 如果是列组，递归查找子列
            if (isColumnGroup(col) && col.children) {
                const found = findColumn(col.children);
                if (found) {
                    return found;
                }
            }
        }
        return undefined;
    }

    return findColumn(cols);
}

/**
 * 获取所有可见列（扁平化处理，包括列组中的子列）
 * @param columns - 列配置数组
 * @returns 扁平化的可见列数组
 */
export function useFlatColumns<T>(columns: MaybeRef<TableColumns<T>>): Ref<TableBaseColumn<T>[]> {
    return computed(() => {
        const cols = unref(columns);
        const flatColumns: TableBaseColumn<T>[] = [];

        function flattenColumns(columnList: TableColumn<T>[]) {
            for (const col of columnList) {
                if (isColumnGroup(col) && col.children) {
                    // 递归处理列组
                    flattenColumns(col.children);
                } else {
                    // 添加基础列
                    if (!isColumnDisabled(col)) {
                        flatColumns.push(col as TableBaseColumn<T>);
                    }
                }
            }
        }

        flattenColumns(cols);
        return flatColumns;
    });
}

/**
 * 拖拽排序列
 * @param columns - 列配置数组
 * @param fromIndex - 源索引
 * @param toIndex - 目标索引
 * @returns 重新排序后的列数组
 */
export function reorderColumns<T>(columns: TableColumns<T>, fromIndex: number, toIndex: number): TableColumns<T> {
    const newColumns = [...columns];
    const [movedColumn] = newColumns.splice(fromIndex, 1);
    newColumns.splice(toIndex, 0, movedColumn);

    // 更新order属性
    return newColumns.map((col, index) => ({
        ...col,
        order: index
    }));
}

/**
 * 切换列的冻结状态
 * @param columns - 列配置数组
 * @param columnKey - 列的唯一标识
 * @param direction - 固定方向 ('none' | 'left' | 'right')，可选
 * @returns 更新后的列数组
 */
export function toggleColumnFrozen<T>(columns: TableColumns<T>, columnKey: string, direction?: 'none' | 'left' | 'right'): TableColumns<T> {
    return columns.map((col) => {
        if ((col as TableBaseColumn<T>).key === columnKey) {
            const baseCol = col as TableBaseColumn<T>;

            if (direction !== undefined) {
                // 使用指定的方向
                if (direction === 'none') {
                    return {
                        ...col,
                        frozen: false,
                        alignFrozen: undefined
                    };
                } else {
                    return {
                        ...col,
                        frozen: true,
                        alignFrozen: direction
                    };
                }
            } else {
                // 兼容原有的切换逻辑
                const newFrozenState = !baseCol.frozen;
                return {
                    ...col,
                    frozen: newFrozenState,
                    // 如果设置为固定列，确保有默认的对齐方式
                    alignFrozen: newFrozenState ? baseCol.alignFrozen || 'left' : baseCol.alignFrozen
                };
            }
        }
        return col;
    });
}

/**
 * 获取冻结的列
 * @param columns - 列配置数组
 * @returns 冻结的列数组
 */
export function getFrozenColumns<T>(columns: MaybeRef<TableColumns<T>>): Ref<TableBaseColumn<T>[]> {
    return computed(() => {
        const cols = unref(columns);
        const flatColumns: TableBaseColumn<T>[] = [];

        function collectFrozenColumns(columnList: TableColumn<T>[]) {
            for (const col of columnList) {
                if (isColumnGroup(col) && col.children) {
                    collectFrozenColumns(col.children);
                } else {
                    const baseCol = col as TableBaseColumn<T>;
                    if (baseCol.frozen && !isColumnDisabled(col)) {
                        flatColumns.push(baseCol);
                    }
                }
            }
        }

        collectFrozenColumns(cols);
        return flatColumns.sort((a, b) => (a.order || 0) - (b.order || 0));
    });
}

/**
 * 获取左固定列
 * @param columns - 列配置数组
 * @returns 左固定列数组
 */
export function getLeftFrozenColumns<T>(columns: MaybeRef<TableColumns<T>>): Ref<TableBaseColumn<T>[]> {
    return computed(() => {
        const cols = unref(columns);
        const flatColumns: TableBaseColumn<T>[] = [];

        function collectLeftFrozenColumns(columnList: TableColumn<T>[]) {
            for (const col of columnList) {
                if (isColumnGroup(col) && col.children) {
                    collectLeftFrozenColumns(col.children);
                } else {
                    const baseCol = col as TableBaseColumn<T>;
                    if (baseCol.frozen && baseCol.alignFrozen === 'left' && !isColumnDisabled(col)) {
                        flatColumns.push(baseCol);
                    }
                }
            }
        }

        collectLeftFrozenColumns(cols);
        return flatColumns.sort((a, b) => (a.order || 0) - (b.order || 0));
    });
}

/**
 * 获取右固定列
 * @param columns - 列配置数组
 * @returns 右固定列数组
 */
export function getRightFrozenColumns<T>(columns: MaybeRef<TableColumns<T>>): Ref<TableBaseColumn<T>[]> {
    return computed(() => {
        const cols = unref(columns);
        const flatColumns: TableBaseColumn<T>[] = [];

        function collectRightFrozenColumns(columnList: TableColumn<T>[]) {
            for (const col of columnList) {
                if (isColumnGroup(col) && col.children) {
                    collectRightFrozenColumns(col.children);
                } else {
                    const baseCol = col as TableBaseColumn<T>;
                    if (baseCol.frozen && baseCol.alignFrozen === 'right' && !isColumnDisabled(col)) {
                        flatColumns.push(baseCol);
                    }
                }
            }
        }

        collectRightFrozenColumns(cols);
        return flatColumns.sort((a, b) => (a.order || 0) - (b.order || 0));
    });
}

/**
 * 获取非固定列
 * @param columns - 列配置数组
 * @returns 非固定列数组
 */
export function getNormalColumns<T>(columns: MaybeRef<TableColumns<T>>): Ref<TableBaseColumn<T>[]> {
    return computed(() => {
        const cols = unref(columns);
        const flatColumns: TableBaseColumn<T>[] = [];

        function collectNormalColumns(columnList: TableColumn<T>[]) {
            for (const col of columnList) {
                if (isColumnGroup(col) && col.children) {
                    collectNormalColumns(col.children);
                } else {
                    const baseCol = col as TableBaseColumn<T>;
                    if (!baseCol.frozen && !isColumnDisabled(col)) {
                        flatColumns.push(baseCol);
                    }
                }
            }
        }

        collectNormalColumns(cols);
        return flatColumns.sort((a, b) => (a.order || 0) - (b.order || 0));
    });
}

/**
 * 获取分组后的列配置（左固定、普通、右固定）
 * @param columns - 列配置数组
 * @returns 分组后的列配置
 */
export function getGroupedColumns<T>(columns: MaybeRef<TableColumns<T>>) {
    return computed(() => {
        const leftFrozen = getLeftFrozenColumns(columns).value;
        const normal = getNormalColumns(columns).value;
        const rightFrozen = getRightFrozenColumns(columns).value;

        return {
            leftFrozen,
            normal,
            rightFrozen,
            all: [...leftFrozen, ...normal, ...rightFrozen]
        };
    });
}

/**
 * 计算固定列的偏移量
 * @param columns - 列配置数组
 * @param columnKey - 列的唯一标识
 * @returns 偏移量（像素）
 */
export function getColumnOffset<T>(columns: MaybeRef<TableColumns<T>>, columnKey: string): number {
    const groupedColumns = getGroupedColumns(columns).value;

    // 查找列在哪个分组中
    const leftIndex = groupedColumns.leftFrozen.findIndex((col) => col.key === columnKey);
    const rightIndex = groupedColumns.rightFrozen.findIndex((col) => col.key === columnKey);

    if (leftIndex !== -1) {
        // 计算左固定列的偏移量
        return groupedColumns.leftFrozen.slice(0, leftIndex).reduce((offset, col) => {
            const width = col.width ? parseInt(String(col.width)) : col.minWidth || 0;
            return offset + width;
        }, 0);
    }

    if (rightIndex !== -1) {
        // 计算右固定列的偏移量
        return groupedColumns.rightFrozen.slice(rightIndex + 1).reduce((offset, col) => {
            const width = col.width ? parseInt(String(col.width)) : col.minWidth || 0;
            return offset + width;
        }, 0);
    }

    return 0;
}

/**
 * 批量设置列的固定状态
 * @param columns - 列配置数组
 * @param columnKeys - 列的唯一标识数组
 * @param direction - 固定方向
 * @returns 更新后的列数组
 */
export function batchSetColumnsFrozen<T>(columns: TableColumns<T>, columnKeys: string[], direction: 'none' | 'left' | 'right'): TableColumns<T> {
    return columns.map((col) => {
        const baseCol = col as TableBaseColumn<T>;
        if (columnKeys.includes(baseCol.key || '')) {
            if (direction === 'none') {
                return {
                    ...col,
                    frozen: false,
                    alignFrozen: undefined
                };
            } else {
                return {
                    ...col,
                    frozen: true,
                    alignFrozen: direction
                };
            }
        }
        return col;
    });
}

/**
 * 获取列的显示文本
 * @param column - 列配置
 * @param row - 行数据
 * @param index - 行索引
 * @returns 显示文本
 */
export function getColumnText<T>(column: TableBaseColumn<T>, row: T, index: number): string {
    const { text, field, key } = column;

    if (typeof text === 'function') {
        return text(row, index);
    }

    if (typeof text === 'string') {
        return text;
    }

    // 尝试从行数据中获取值
    const dataKey = field || key;
    if (dataKey && row && typeof row === 'object') {
        const value = (row as any)[dataKey];
        return value != null ? String(value) : '';
    }

    return '';
}
