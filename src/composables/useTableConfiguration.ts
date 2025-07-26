// 管理表格配置逻辑
import { ref, watch, shallowRef } from 'vue';
import { useColumns } from './useColumns';

export function useTableConfiguration(props: any, emit: any) {
    // 使用 shallowRef 减少深度响应式开销
    const internalColumns = shallowRef([...props.columns]);
    const processedColumns = useColumns(internalColumns);

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

    const handleColumnsChange = (columns: any) => {
        internalColumns.value = [...columns];
        emit('update:columns', columns);
    };

    const handleColumnChange = (column: any, type: string) => {
        emit('column-change', column, type);
    };

    return {
        internalColumns,
        processedColumns,
        handleColumnsChange,
        handleColumnChange
    };
}
