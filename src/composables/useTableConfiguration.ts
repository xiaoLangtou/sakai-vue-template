// 管理表格配置逻辑
import { watch, shallowRef, computed } from 'vue';
import { useColumns } from './useColumns';
import type { TableColumns, TableColumn, CustomTableProps } from '@/types/table';

export function useTableConfiguration<T = any>(props: CustomTableProps<T>, emit: (event: string, ...args: any[]) => void) {
    const internalColumns = shallowRef([...props.columns]);
    const processedColumns = useColumns(internalColumns);
    const actionColumn = computed(() => {
        return {
            field: 'column-actions',
            header: '操作',
            headerStyle: {
                display: 'flex',
                justifyContent: 'center'
            },
            frozen: false,
            slotName: 'column-actions',
            ...props.actions
        };
    });

    // 优化：使用浅层监听，只在数组引用变化时触发
    watch(
        () => props.columns,
        (newColumns) => {
            // 只有当列数组真正发生变化时才更新
            if (newColumns !== internalColumns.value) {
                internalColumns.value = [...newColumns];
            }
        },
        { flush: 'sync' } // 同步更新，减少延迟
    );

    const handleColumnsChange = (columns: TableColumns<T>) => {
        internalColumns.value = [...columns];
        emit('update:columns', columns);
    };

    const handleColumnChange = (column: TableColumn<T>, type: 'visibility' | 'frozen' | 'order') => {
        emit('column-change', column, type);
    };

    return {
        internalColumns,
        processedColumns,
        actionColumn,
        handleColumnsChange,
        handleColumnChange
    };
}
