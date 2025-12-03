import { ref, watch, nextTick } from 'vue';
import type { TablePersistenceProps, TablePersistenceState, TableState } from '@/types/table';

export function useTablePersistence(props: TablePersistenceProps, state: TablePersistenceState) {
    const isRestoring = ref(false);
    const storageKey = ref(props.persistStateKey || 'custom-table-state');

    // 防抖保存状态
    const saveStateDebounced = (() => {
        let timeout: NodeJS.Timeout;
        return () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                saveState();
            }, 300);
        };
    })();

    /**
     * 保存状态到本地存储
     */
    const saveState = (): void => {
        if (!props.persistState || isRestoring.value) {
            return;
        }

        try {
            const stateToSave: Partial<TableState> = {};

            // 保存列配置
            if (props.persistColumns !== false && state.columns?.value) {
                stateToSave.columns = state.columns.value.map((col: any) => ({
                    key: col.key,
                    field: col.field,
                    header: col.header,
                    visible: col.visible,
                    frozen: col.frozen,
                    width: col.width,
                    sortable: col.sortable,
                    order: col.order
                }));
            }

            // 保存样式设置
            if (state.selectedStyle?.value) {
                stateToSave.selectedStyle = state.selectedStyle.value;
            }

            // 保存表格设置
            if (state.tableSettings?.value) {
                stateToSave.tableSettings = { ...state.tableSettings.value };
            }

            // 保存分页状态
            if (props.persistPagination && state.pagination?.value) {
                stateToSave.pagination = { ...state.pagination.value };
            }

            // 保存排序状态
            if (props.persistSorting && state.sorting?.value) {
                stateToSave.sorting = { ...state.sorting.value };
            }

            // 保存筛选状态
            if (props.persistFilters && state.filters?.value) {
                stateToSave.filters = { ...state.filters.value };
            }

            // 保存选择状态
            if (props.persistSelection && state.selection?.value) {
                stateToSave.selection = [...state.selection.value];
            }

            // 保存展开状态
            if (props.persistExpansion && state.expandedRows?.value) {
                stateToSave.expandedRows = [...state.expandedRows.value];
            }

            // 添加时间戳和版本信息
            const stateWithMeta = {
                ...stateToSave,
                timestamp: Date.now(),
                version: '1.0.0'
            };

            localStorage.setItem(storageKey.value, JSON.stringify(stateWithMeta));

            // 触发保存事件
            if (state.emit) {
                state.emit('state-save', stateWithMeta);
            }
        } catch (error) {
            console.warn('Failed to save custom-table state:', error);
        }
    };

    /**
     * 从本地存储恢复状态
     */
    const restoreState = async (): Promise<void> => {
        if (!props.persistState) {
            return;
        }

        try {
            isRestoring.value = true;

            const savedState = localStorage.getItem(storageKey.value);
            if (!savedState) {
                return;
            }

            const parsedState: TableState & { timestamp: number; version: string } = JSON.parse(savedState);

            // 检查状态版本和时间戳
            const maxAge = 30 * 24 * 60 * 60 * 1000; // 30天
            if (parsedState.timestamp && Date.now() - parsedState.timestamp > maxAge) {
                clearState();
                return;
            }

            await nextTick();

            // 恢复列配置
            if (props.persistColumns !== false && parsedState.columns && state.columns) {
                const restoredColumns = parsedState.columns
                    .map((savedCol: any) => {
                        const originalCol = state.columns.value.find((col: any) => col.key === savedCol.key || col.field === savedCol.field);

                        if (originalCol) {
                            return {
                                ...originalCol,
                                visible: savedCol.visible,
                                frozen: savedCol.frozen,
                                width: savedCol.width,
                                order: savedCol.order
                            };
                        }
                        return null;
                    })
                    .filter(Boolean);

                if (restoredColumns.length > 0) {
                    state.columns.value = restoredColumns;
                }
            }

            // 恢复样式设置
            if (parsedState.selectedStyle && state.selectedStyle) {
                state.selectedStyle.value = parsedState.selectedStyle;
            }

            // 恢复表格设置
            if (parsedState.tableSettings && state.tableSettings) {
                state.tableSettings.value = {
                    ...state.tableSettings.value,
                    ...parsedState.tableSettings
                };
            }

            // 恢复分页状态
            if (props.persistPagination && parsedState.pagination && state.pagination) {
                state.pagination.value = { ...parsedState.pagination };
            }

            // 恢复排序状态
            if (props.persistSorting && parsedState.sorting && state.sorting) {
                state.sorting.value = { ...parsedState.sorting };
            }

            // 恢复筛选状态
            if (props.persistFilters && parsedState.filters && state.filters) {
                state.filters.value = { ...parsedState.filters };
            }

            // 恢复选择状态
            if (props.persistSelection && parsedState.selection && state.selection) {
                state.selection.value = [...parsedState.selection];
            }

            // 恢复展开状态
            if (props.persistExpansion && parsedState.expandedRows && state.expandedRows) {
                state.expandedRows.value = [...parsedState.expandedRows];
            }

            // 触发恢复事件
            if (state.emit) {
                state.emit('state-restore', parsedState);
            }
        } catch (error) {
            console.warn('Failed to restore custom-table state:', error);
        } finally {
            isRestoring.value = false;
        }
    };

    /**
     * 清除保存的状态
     */
    const clearState = (): void => {
        try {
            localStorage.removeItem(storageKey.value);
        } catch (error) {
            console.warn('Failed to clear custom-table state:', error);
        }
    };

    /**
     * 获取保存的状态
     */
    const getSavedState = (): TableState | null => {
        try {
            const savedState = localStorage.getItem(storageKey.value);
            return savedState ? JSON.parse(savedState) : null;
        } catch (error) {
            console.warn('Failed to get saved custom-table state:', error);
            return null;
        }
    };

    /**
     * 检查是否有保存的状态
     */
    const hasSavedState = (): boolean => {
        return getSavedState() !== null;
    };

    /**
     * 重置为默认状态
     */
    const resetToDefault = (): void => {
        clearState();

        // 重置所有状态到默认值
        if (state.selectedStyle) {
            state.selectedStyle.value = 'normal';
        }

        if (state.tableSettings) {
            state.tableSettings.value = {
                showRowDivider: true,
                stripedRows: true,
                showShadow: false,
                showBorder: true
            };
        }

        if (state.pagination) {
            state.pagination.value = {
                first: 0,
                rows: 10,
                page: 0
            };
        }

        if (state.sorting) {
            state.sorting.value = {};
        }

        if (state.filters) {
            state.filters.value = {};
        }

        if (state.selection) {
            state.selection.value = [];
        }

        if (state.expandedRows) {
            state.expandedRows.value = [];
        }
    };

    /**
     * 导出状态配置
     */
    const exportState = (): string => {
        const currentState = getSavedState();
        return JSON.stringify(currentState, null, 2);
    };

    /**
     * 导入状态配置
     */
    const importState = (stateJson: string): boolean => {
        try {
            const importedState = JSON.parse(stateJson);
            localStorage.setItem(storageKey.value, JSON.stringify(importedState));
            restoreState();
            return true;
        } catch (error) {
            console.warn('Failed to import custom-table state:', error);
            return false;
        }
    };

    // 监听状态变化并自动保存
    if (props.persistState) {
        // 监听列变化
        if (props.persistColumns !== false && state.columns) {
            watch(state.columns, saveStateDebounced, { deep: true });
        }

        // 监听样式变化
        if (state.selectedStyle) {
            watch(state.selectedStyle, saveStateDebounced);
        }

        // 监听表格设置变化
        if (state.tableSettings) {
            watch(state.tableSettings, saveStateDebounced, { deep: true });
        }

        // 监听分页变化
        if (props.persistPagination && state.pagination) {
            watch(state.pagination, saveStateDebounced, { deep: true });
        }

        // 监听排序变化
        if (props.persistSorting && state.sorting) {
            watch(state.sorting, saveStateDebounced, { deep: true });
        }

        // 监听筛选变化
        if (props.persistFilters && state.filters) {
            watch(state.filters, saveStateDebounced, { deep: true });
        }

        // 监听选择变化
        if (props.persistSelection && state.selection) {
            watch(state.selection, saveStateDebounced, { deep: true });
        }

        // 监听展开变化
        if (props.persistExpansion && state.expandedRows) {
            watch(state.expandedRows, saveStateDebounced, { deep: true });
        }
    }

    return {
        saveState,
        restoreState,
        clearState,
        getSavedState,
        hasSavedState,
        resetToDefault,
        exportState,
        importState,
        isRestoring
    };
}
