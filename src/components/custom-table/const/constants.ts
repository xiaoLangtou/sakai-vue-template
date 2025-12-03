import type { ActionColumnConfig, TableStyleConfig } from '@/components';

/**
 * 默认表格样式配置
 */
export const DEFAULT_TABLE_SETTINGS: TableStyleConfig = {
    showRowDivider: true,
    stripedRows: false,
    showShadow: false,
    showBorder: true,
    virtualScroll: false,
    virtualScrollItemSize: 46,
    showGridlines: false
};

/**
 * 默认操作列配置
 */
export const DEFAULT_ACTION_COLUMN: ActionColumnConfig = {
    field: 'column-actions',
    header: '操作',
    headerStyle: {
        display: 'flex',
        justifyContent: 'center'
    },
    frozen: false
};

/**
 * 默认分页配置
 */
export const DEFAULT_PAGINATION_CONFIG = {
    current: 1,
    rows: 10,
    totalRecords: 0,
    rowsPerPageOptions: [5, 10, 20, 50],
    paginatorTemplate: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown',
    currentPageReportTemplate: '共 {totalRecords} 条记录',
    pageLinkSize: 5,
    alwaysShowPaginator: true
};

/**
 * 默认表格配置
 */
export const DEFAULT_TABLE_CONFIG = {
    dataKey: 'id',
    showGridlines: false,
    paginator: true,
    scrollable: true,
    responsiveLayout: 'scroll' as const,
    stripedRows: false,
    loading: false,
    showColumnSettings: true,
    columnSettingsPosition: 'header' as const,
    showToolbar: true,
    size: 'normal' as const,
    virtualScroll: false,
    virtualScrollItemSize: 46,
    persistState: false
};

/**
 * 表格尺寸配置映射
 */
export const TABLE_SIZE_CONFIG = {
    small: {
        size: 'small',
        cellPadding: '0.25rem 0.5rem',
        fontSize: '0.875rem',
        rowHeight: 36
    },
    normal: {
        size: 'normal',
        cellPadding: '0.5rem 0.75rem',
        fontSize: '1rem',
        rowHeight: 46
    },
    large: {
        size: 'large',
        cellPadding: '0.75rem 1rem',
        fontSize: '1rem',
        rowHeight: 56
    }
} as const;

/**
 * 样式选项配置
 */
export const STYLE_OPTIONS = [
    {
        name: 'small' as const,
        label: '紧凑',
        preview: {
            header: 'width: 70%',
            row: 'width: 60%'
        }
    },
    {
        name: 'normal' as const,
        label: '标准',
        preview: {
            header: 'width: 80%',
            row: 'width: 75%'
        }
    },
    {
        name: 'large' as const,
        label: '宽松',
        preview: {
            header: 'width: 85%',
            row: 'width: 80%'
        }
    }
];

/**
 * 表格设置选项
 */
export const TABLE_SETTINGS_OPTIONS = [
    { key: 'stripedRows', label: '斑马纹填充' },
    { key: 'showBorder', label: '显示边框' }
];

/**
 * Tooltip 默认配置
 */
export const DEFAULT_TOOLTIP_OPTIONS = {
    showDelay: 300,
    hideDelay: 0,
    autoHide: true,
    escape: true
};

/**
 * 防抖延迟配置（毫秒）
 */
export const DEBOUNCE_DELAYS = {
    /** 窗口 resize 防抖延迟 */
    RESIZE: 10,
    /** 状态保存防抖延迟 */
    SAVE_STATE: 300
} as const;

/**
 * 固定列配置
 */
export const FROZEN_COLUMN_CONFIG = {
    /** 固定列选择器 */
    selectors: ['.p-datatable-thead th[data-p-frozen-column="true"]', '.p-datatable-tbody td[data-p-frozen-column="true"]'],
    /** 更新延迟（毫秒） */
    updateDelay: 0
} as const;
