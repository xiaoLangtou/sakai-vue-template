import { ref } from 'vue';
import type { SearchParams } from '@/types/search';
import type { TableEventsEmits } from '@/types/table';

export function useTableEvents<T = any>(emit: (event: keyof TableEventsEmits<T>, ...args: any[]) => void) {
    // 内部状态
    const lastClickTime = ref(0);
    const clickTimer = ref<NodeJS.Timeout | null>(null);
    const selectedRows = ref<T[]>([]);
    const expandedRows = ref<T[]>([]);

    /**
     * 处理行点击事件
     */
    const handleRowClick = (event: { originalEvent: Event; data: T; index: number }): void => {
        const now = Date.now();

        // 清除之前的单击定时器
        if (clickTimer.value) {
            clearTimeout(clickTimer.value);
            clickTimer.value = null;
        }

        // 检查是否是双击
        if (now - lastClickTime.value < 300) {
            // 双击事件
            handleRowDblClick(event);
            lastClickTime.value = 0;
            return;
        }

        // 设置单击定时器
        clickTimer.value = setTimeout(() => {
            emit('row-click', event);
            lastClickTime.value = now;
            clickTimer.value = null;
        }, 300);
    };

    /**
     * 处理行双击事件
     */
    const handleRowDblClick = (event: { originalEvent: Event; data: T; index: number }): void => {
        // 清除单击定时器
        if (clickTimer.value) {
            clearTimeout(clickTimer.value);
            clickTimer.value = null;
        }

        emit('row-dblclick', event);
    };

    /**
     * 处理选择变化事件
     */
    const handleSelectionChange = (event: { originalEvent: Event; value: T | T[] }): void => {
        const selection = Array.isArray(event.value) ? event.value : [event.value];
        selectedRows.value = selection;

        emit('selection-change', selection);
        emit('update:selection', event.value);
    };

    /**
     * 处理分页事件
     */
    const handlePage = (event: {
        originalEvent: Event;
        first: number;
        rows: number;
        page: number;
        pageCount: number;
    }): void => {
        emit('page', event);
    };

    /**
     * 处理排序事件
     */
    const handleSort = (event: {
        originalEvent: Event;
        sortField: string;
        sortOrder: number;
        multiSortMeta?: Array<{ field: string; order: number }>;
    }): void => {
        emit('sort', event);
    };

    /**
     * 处理筛选事件
     */
    const handleFilter = (event: {
        originalEvent: Event;
        filters: Record<string, any>;
    }): void => {
        emit('filter', event);
    };

    /**
     * 处理筛选变化事件
     */
    const handleFilterChange = (params: SearchParams): void => {
        emit('filter-change', params);
    };

    /**
     * 处理刷新事件
     */
    const handleRefresh = (): void => {
        emit('refresh');
    };

    /**
     * 处理单元格编辑完成事件
     */
    const handleCellEditComplete = (event: {
        originalEvent: Event;
        data: T;
        newData: T;
        field: string;
        index: number;
    }): void => {
        emit('cell-edit-complete', event);
    };

    /**
     * 处理单元格编辑取消事件
     */
    const handleCellEditCancel = (event: {
        originalEvent: Event;
        data: T;
        field: string;
        index: number;
    }): void => {
        emit('cell-edit-cancel', event);
    };

    /**
     * 处理行展开事件
     */
    const handleRowExpand = (event: {
        originalEvent: Event;
        data: T;
    }): void => {
        const index = expandedRows.value.findIndex(row => row === event.data);
        if (index === -1) {
            expandedRows.value.push(event.data);
        }
        emit('row-expand', event);
    };

    /**
     * 处理行折叠事件
     */
    const handleRowCollapse = (event: {
        originalEvent: Event;
        data: T;
    }): void => {
        const index = expandedRows.value.findIndex(row => row === event.data);
        if (index > -1) {
            expandedRows.value.splice(index, 1);
        }
        emit('row-collapse', event);
    };

    /**
     * 处理列大小调整结束事件
     */
    const handleColumnResizeEnd = (event: {
        originalEvent: Event;
        element: HTMLElement;
        column: any;
        delta: number;
    }): void => {
        emit('column-resize-end', event);
    };

    /**
     * 处理列重新排序事件
     */
    const handleColumnReorder = (event: {
        originalEvent: Event;
        dragIndex: number;
        dropIndex: number;
        columns: any[];
    }): void => {
        emit('column-reorder', event);
    };

    /**
     * 清除所有选择
     */
    const clearSelection = (): void => {
        selectedRows.value = [];
        emit('selection-change', []);
        emit('update:selection', []);
    };

    /**
     * 选择所有行
     */
    const selectAll = (data: T[]): void => {
        selectedRows.value = [...data];
        emit('selection-change', selectedRows.value);
        emit('update:selection', selectedRows.value);
    };

    /**
     * 切换行选择状态
     */
    const toggleRowSelection = (row: T): void => {
        const index = selectedRows.value.findIndex(selectedRow => selectedRow === row);
        if (index > -1) {
            selectedRows.value.splice(index, 1);
        } else {
            selectedRows.value.push(row);
        }
        emit('selection-change', selectedRows.value);
        emit('update:selection', selectedRows.value);
    };

    /**
     * 展开所有行
     */
    const expandAll = (data: T[]): void => {
        expandedRows.value = [...data];
    };

    /**
     * 折叠所有行
     */
    const collapseAll = (): void => {
        expandedRows.value = [];
    };

    /**
     * 切换行展开状态
     */
    const toggleRowExpansion = (row: T): void => {
        const index = expandedRows.value.findIndex(expandedRow => expandedRow === row);
        if (index > -1) {
            expandedRows.value.splice(index, 1);
        } else {
            expandedRows.value.push(row);
        }
    };

    /**
     * 获取选中的行
     */
    const getSelectedRows = (): T[] => {
        return [...selectedRows.value];
    };

    /**
     * 获取展开的行
     */
    const getExpandedRows = (): T[] => {
        return [...expandedRows.value];
    };

    /**
     * 检查行是否被选中
     */
    const isRowSelected = (row: T): boolean => {
        return selectedRows.value.includes(row);
    };

    /**
     * 检查行是否被展开
     */
    const isRowExpanded = (row: T): boolean => {
        return expandedRows.value.includes(row);
    };

    return {
        // 事件处理函数
        handleRowClick,
        handleRowDblClick,
        handleSelectionChange,
        handlePage,
        handleSort,
        handleFilter,
        handleFilterChange,
        handleRefresh,
        handleCellEditComplete,
        handleCellEditCancel,
        handleRowExpand,
        handleRowCollapse,
        handleColumnResizeEnd,
        handleColumnReorder,

        // 工具函数
        clearSelection,
        selectAll,
        toggleRowSelection,
        expandAll,
        collapseAll,
        toggleRowExpansion,
        getSelectedRows,
        getExpandedRows,
        isRowSelected,
        isRowExpanded,

        // 响应式状态
        selectedRows,
        expandedRows
    };
}
