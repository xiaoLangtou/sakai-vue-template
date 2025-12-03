import { ref, computed, watch } from 'vue';
import type { TableColumn, TableSettings, TableStylesProps } from '@/types/table';

export function useTableStyles(props: TableStylesProps) {
    const selectedStyle = ref<'small' | 'normal' | 'large'>(props.size);
    const currentTableSettings = ref<TableSettings>({ ...props.tableSettings });

    // 监听 props 变化
    watch(
        () => props.tableSettings,
        (newSettings) => {
            currentTableSettings.value = { ...newSettings };
        },
        { deep: true }
    );

    watch(
        () => props.size,
        (newSize) => {
            selectedStyle.value = newSize;
        }
    );

    // 计算表格样式类
    const computedTableClass = computed(() => {
        const classes: string[] = [];

        if (props.tableClass) {
            classes.push(props.tableClass);
        }

        // 根据尺寸添加样式类
        switch (selectedStyle.value) {
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

        return classes.join(' ');
    });

    // 计算表格样式
    const computedTableStyle = computed(() => {
        const styles: Record<string, string> = {
            ...props.tableStyle
        };

        if (currentTableSettings.value.showShadow) {
            styles.boxShadow = '0 2px 12px 0 rgba(0, 0, 0, 0.1)';
            styles.borderRadius = '8px';
        }

        return styles;
    });

    // 计算是否显示网格线
    const showGridlines = computed(() => {
        return currentTableSettings.value.showBorder;
    });

    // 计算是否显示斑马纹
    const showStripedRows = computed(() => {
        return currentTableSettings.value.stripedRows;
    });

    // 获取列的body样式
    const getColumnBodyStyle = (column: TableColumn<any>): Record<string, any> => {
        const style: Record<string, any> = {
            minWidth: '80px',
            ...column.style
        };

        // 设置宽度（与表头保持一致）
        if (column.width) {
            const width = typeof column.width === 'number' ? `${column.width}px` : column.width;
            style.width = width;
            style.minWidth = width;
            style.maxWidth = width;
        }

        // 设置最小宽度
        if (column.minWidth && !column.width) {
            style.minWidth = typeof column.minWidth === 'number' ? `${column.minWidth}px` : column.minWidth;
        }

        // 设置最大宽度
        if (column.maxWidth && !column.width) {
            style.maxWidth = typeof column.maxWidth === 'number' ? `${column.maxWidth}px` : column.maxWidth;
        }

        // 处理文本省略
        if ((column as any).ellipsis) {
            style.overflow = 'hidden';
            style.textOverflow = 'ellipsis';
            style.whiteSpace = 'nowrap';
            if (!column.width) {
                style.maxWidth = '100%';
            }
        }

        // 文本对齐
        if (column.align) {
            style.textAlign = column.align;
        }

        // 垂直对齐
        if (column.verticalAlign) {
            style.verticalAlign = column.verticalAlign;
        }

        // 处理固定列样式
        if (column.frozen) {
            style.position = 'sticky';
            style.zIndex = '1';
            style.backgroundColor = 'inherit';
            style.boxShadow = 'none';

            if (column.alignFrozen === 'left') {
                style.left = '0';
            } else if (column.alignFrozen === 'right') {
                style.right = '0';
            }
        }

        return style;
    };

    // 获取表头样式
    const getHeaderStyle = (column: TableColumn<any>): Record<string, any> => {
        const style: Record<string, any> = {
            ...column.headerStyle
        };

        // 文本对齐
        if (column.align) {
            style.textAlign = column.align;
        }

        // 设置宽度
        if (column.width) {
            style.width = typeof column.width === 'number' ? `${column.width}px` : column.width;
        }

        // 设置最小宽度
        if (column.minWidth) {
            style.minWidth = typeof column.minWidth === 'number' ? `${column.minWidth}px` : column.minWidth;
        }

        // 处理固定列样式
        if (column.frozen) {
            style.position = 'sticky';
            style.zIndex = '2';
            style.boxShadow = 'none';

            if (column.alignFrozen === 'left') {
                style.left = '0';
            } else if (column.alignFrozen === 'right') {
                style.right = '0';
            }
        }

        return style;
    };

    // 处理样式变化
    const handleStyleChange = (styleName: string): void => {
        if (styleName === 'small' || styleName === 'normal' || styleName === 'large') {
            selectedStyle.value = styleName;
        }
    };

    // 处理表格设置变化
    const handleTableSettingChange = (key: string, value: any): void => {
        if (key in currentTableSettings.value) {
            (currentTableSettings.value as any)[key] = value;
        }
    };

    // 重置样式到默认值
    const resetStyles = (): void => {
        selectedStyle.value = 'normal';
        currentTableSettings.value = {
            showRowDivider: true,
            stripedRows: true,
            showShadow: false,
            showBorder: true,
            virtualScroll: false,
            virtualScrollItemSize: 46
        };
    };

    // 获取当前主题样式
    const getCurrentTheme = (): 'light' | 'dark' => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    };

    return {
        selectedStyle,
        currentTableSettings,
        computedTableClass,
        computedTableStyle,
        showGridlines,
        showStripedRows,
        getColumnBodyStyle,
        getHeaderStyle,
        handleStyleChange,
        handleTableSettingChange,
        resetStyles,
        getCurrentTheme
    };
}
