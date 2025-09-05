import type { FilterConfig, SearchParams } from "./search";

/**
 * 表格列对齐方式
 */
export type TableColumnAlign = 'left' | 'center' | 'right';

/**
 * 表格列垂直对齐方式
 */
export type TableColumnVerticalAlign = 'top' | 'middle' | 'bottom';

/**
 * 表格列固定位置
 */
export type TableColumnFixed = 'left' | 'right';

/**
 * 表格列类型
 */
export type TableColumnType = 'text' | 'number' | 'date' | 'selection' | 'index' | 'expand' | 'custom';

/**
 * 表格排序方向
 */
export type TableSortOrder = 'asc' | 'desc';

/**
 * 表格选择模式
 */
export type TableSelectionMode = 'single' | 'multiple';

/**
 * 表格大小
 */
export type TableSize = 'small' | 'normal' | 'large';

/**
 * 表格响应式布局
 */
export type TableResponsiveLayout = 'stack' | 'scroll';

/**
 * 表格列设置按钮位置
 */
export type TableColumnSettingsPosition = 'header' | 'toolbar';

/**
 * 表格列基础配置
 */
export interface TableBaseColumn<T = any> {
    /** 列唯一标识 */
    key?: string;
    /** 列标题 */
    title?: string;
    /** 列标题（header 别名） */
    header?: string;
    /** 数据字段名 */
    field?: string;
    /** 列宽度 */
    width?: number | string;
    /** 最小宽度 */
    minWidth?: number;
    /** 最大宽度 */
    maxWidth?: number;
    /** 是否可排序 */
    sortable?: boolean;
    /** 是否可筛选 */
    filterable?: boolean;
    /** 是否可调整大小 */
    resizable?: boolean;
    /** 是否显示该列 */
    visible?: boolean;
    /** 是否禁用该列 */
    disabled?: boolean | Ref<boolean> | ((row: T, index: number) => boolean);
    /** 水平对齐方式 */
    align?: TableColumnAlign;
    /** 垂直对齐方式 */
    verticalAlign?: TableColumnVerticalAlign;
    /** 固定位置 */
    fixed?: TableColumnFixed | boolean;
    /** 是否冻结列 */
    frozen?: boolean;
    /** 冻结列对齐方式 */
    alignFrozen?: 'left' | 'right';
    /** 列类型 */
    type?: TableColumnType;
    /** 选择模式 */
    selectionMode?: TableSelectionMode;
    /** 是否显示省略号 */
    ellipsis?: boolean;
    /** 排序顺序 */
    order?: number;
    /** 自定义文本内容 */
    text?: string | ((row: T, index: number) => string);
    /** 自定义渲染函数 */
    render?: (row: T, index: number) => any;
    /** 插槽名称 */
    slotName?: string;
    /** 列的CSS类名 */
    class?: string;
    /** 自定义类名 */
    className?: string;
    /** 列的样式 */
    style?: Record<string, any>;
    /** 列标题的样式 */
    headerStyle?: Record<string, any>;
    /** 列内容的样式 */
    bodyStyle?: Record<string, any>;
    /** 列头内容的样式 */
    headerCellStyle?: Record<string, any>;
    /** 列内容的样式 */
    cellStyle?: Record<string, any>;
    /** 是否显示tooltip */
    showTooltip?: boolean;
    /** tooltip显示的字段名（默认使用field字段） */
    tooltipField?: string;
    /** 自定义tooltip内容 */
    tooltipContent?: string | ((row: T, index: number) => string);
    /** tooltip配置选项 */
    tooltipOptions?: {
        /** 是否启用提示 */
        enabled?: boolean;
        /** 提示内容 */
        content?: string | ((row: T) => string);
        /** 提示位置 */
        position?: 'top' | 'bottom' | 'left' | 'right';
        /** 显示延迟 */
        showDelay?: number;
        /** 隐藏延迟 */
        hideDelay?: number;
        /** 是否自动隐藏 */
        autoHide?: boolean;
        /** 是否转义HTML */
        escape?: boolean;
        /** 自定义类名 */
        class?: string;
    };
    /** 额外属性 */
    props?: Record<string, any>;
    /** 其他扩展属性 */
    [key: string]: any;
}

/**
 * 表格列组配置
 */
export interface TableColumnGroup<T = any> {
    /** 列组唯一标识 */
    key?: string;
    /** 列组标题 */
    title?: string;
    /** 列组标题（header 别名） */
    header?: string;
    /** 子列 */
    children?: TableColumn<T>[];
    /** 数据字段名 */
    field?: string;
    /** 列宽度 */
    width?: number | string;
    /** 最小宽度 */
    minWidth?: number;
    /** 最大宽度 */
    maxWidth?: number;
    /** 是否可排序 */
    sortable?: boolean;
    /** 水平对齐方式 */
    align?: TableColumnAlign;
    /** 垂直对齐方式 */
    verticalAlign?: TableColumnVerticalAlign;
    /** 是否冻结列 */
    frozen?: boolean;
    /** 冻结列对齐方式 */
    alignFrozen?: 'left' | 'right';
    /** 选择模式 */
    selectionMode?: TableSelectionMode;
    /** 是否禁用该列组 */
    disabled?: TableBaseColumn<T>['disabled'];
    /** 自定义文本内容 */
    text?: TableBaseColumn<T>['text'];
    /** 自定义渲染函数 */
    render?: TableBaseColumn<T>['render'];
    /** 列标题的样式 */
    headerStyle?: Record<string, any>;
    /** 列的样式 */
    style?: Record<string, any>;
    /** 自定义类名 */
    className?: string;
    /** 是否显示省略号 */
    ellipsis?: boolean;
    /** 是否显示tooltip */
    showTooltip?: boolean;
    /** tooltip显示的字段名（默认使用field字段） */
    tooltipField?: string;
    /** 自定义tooltip内容 */
    tooltipContent?: string | ((row: T, index: number) => string);
    /** tooltip配置选项 */
    tooltipOptions?: TableBaseColumn<T>['tooltipOptions'];
    /** 插槽名称 */
    slotName?: string;
}

/**
 * 表格列配置（联合类型）
 */
export type TableColumn<T = any> = TableBaseColumn<T> | TableColumnGroup<T>;

/**
 * 表格列数组类型
 */
export type TableColumns<T = any> = Array<TableColumn<T>>;

/**
 * 表格排序配置
 */
export interface TableSort {
    /** 排序字段 */
    field: string;
    /** 排序方向 */
    order: TableSortOrder;
}

/**
 * 表格筛选配置
 */
export interface TableFilter {
    /** 筛选字段 */
    field: string;
    /** 筛选值 */
    value: any;
    /** 筛选操作符 */
    operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'notIn';
}

/**
 * 表格分页配置
 */
export interface TablePagination {
    /** 当前页码 */
    page: number;
    /** 每页条数 */
    size: number;
    /** 总条数 */
    total?: number;
    /** 每页条数选项 */
    pageSizeOptions?: number[];
    /** 是否显示快速跳转 */
    showQuickJumper?: boolean;
    /** 是否显示总数 */
    showTotal?: boolean;
    /** 是否显示每页条数选择器 */
    showSizeChanger?: boolean;
}

/**
 * 表格样式配置属性
 */
export interface TableStylesProps {
    /** 表格大小 */
    size: TableSize;
    /** 表格设置 */
    tableSettings: TableSettings;
    /** 表格样式类 */
    tableClass?: string;
    /** 表格样式 */
    tableStyle?: Record<string, any>;
    /** 是否显示斑马纹 */
    stripedRows?: boolean;
}

/**
 * 表格配置
 */
export interface TableSettings {
    /** 表格大小 */
    size?: TableSize;
    /** 是否显示边框 */
    showBorder?: boolean;
    /** 是否显示阴影 */
    showShadow?: boolean;
    /** 是否显示斑马纹 */
    stripedRows?: boolean;
    /** 是否显示行分割线 */
    showRowDivider?: boolean;
    /** 是否显示列分割线 */
    showColumnDivider?: boolean;
    /** 是否悬停高亮 */
    hoverHighlight?: boolean;
    /** 行高 */
    rowHeight?: number;
    /** 表头高度 */
    headerHeight?: number;
    /** 是否固定表头 */
    fixedHeader?: boolean;
    /** 表格最大高度 */
    maxHeight?: number;
    /** 是否显示表头 */
    showHeader?: boolean;
    /** 是否显示表尾 */
    showFooter?: boolean;
    /** 空数据提示 */
    emptyText?: string;
    /** 加载提示 */
    loadingText?: string;
    /** 是否启用虚拟滚动 */
    virtualScroll?: boolean;
    /** 虚拟滚动行高 */
    virtualScrollItemSize?: number;
}

/**
 * 表格事件发射器类型
 */
export interface TableEventsEmits<T = any> {
    'row-click': [event: { originalEvent: Event; data: T; index: number }];
    'row-dblclick': [event: { originalEvent: Event; data: T; index: number }];
    'selection-change': [selection: T[]];
    'filter-change': [params: SearchParams];
    'state-restore': [state: any];
    'state-save': [state: any];
    refresh: [];
    page: [event: any];
    sort: [event: any];
    filter: [event: any];
    'update:selection': [selection: T | T[]];
    'update:columns': [columns: TableColumns<T>];
    'cell-edit-complete': [event: any];
    'cell-edit-cancel': [event: any];
    'row-expand': [event: any];
    'row-collapse': [event: any];
    'column-resize-end': [event: any];
    'column-reorder': [event: any];
    'column-change': [column: TableColumn<T>, type: 'visibility' | 'frozen' | 'order'];
}



/**
 * 表格数据源
 */
export interface TableDataSource {
    /** 数据列表 */
    data: any[];
    /** 总条数 */
    total?: number;
    /** 是否加载中 */
    loading?: boolean;
    /** 错误信息 */
    error?: string;
}

/**
 * 表格导出配置
 */
export interface TableExportConfig {
    /** 导出格式 */
    format: 'csv' | 'excel' | 'json';
    /** 文件名 */
    filename?: string;
    /** 是否包含表头 */
    includeHeader?: boolean;
    /** 导出的列 */
    columns?: string[];
    /** 导出的数据 */
    data?: any[];
}

/**
 * 表格工具栏配置
 */
export interface TableToolbar {
    /** 是否显示刷新按钮 */
    showRefresh?: boolean;
    /** 是否显示列设置按钮 */
    showColumnSettings?: boolean;
    /** 是否显示导出按钮 */
    showExport?: boolean;
    /** 是否显示全屏按钮 */
    showFullscreen?: boolean;
    /** 自定义工具栏内容 */
    customTools?: any[];
}

/**
 * 表格状态持久化配置
 */
export interface TablePersistenceProps {
    /** 是否启用状态持久化 */
    persistState: boolean;
    /** 持久化存储键 */
    persistStateKey?: string;
    /** 是否持久化列配置 */
    persistColumns?: boolean;
    /** 是否持久化分页状态 */
    persistPagination?: boolean;
    /** 是否持久化排序状态 */
    persistSorting?: boolean;
    /** 是否持久化筛选状态 */
    persistFilters?: boolean;
    /** 是否持久化选择状态 */
    persistSelection?: boolean;
    /** 是否持久化展开状态 */
    persistExpansion?: boolean;
}

/**
 * 表格持久化状态
 */
export interface TablePersistenceState {
    /** 列配置 */
    columns: any;
    /** 选中的样式 */
    selectedStyle: any;
    /** 表格设置 */
    tableSettings: any;
    /** 分页状态 */
    pagination?: any;
    /** 排序状态 */
    sorting?: any;
    /** 筛选状态 */
    filters?: any;
    /** 选择状态 */
    selection?: any;
    /** 展开的行 */
    expandedRows?: any;
    /** 事件发射器 */
    emit?: any;
}

/**
 * 表格状态
 */
export interface TableState {
    /** 列配置 */
    columns: TableColumns<any>;
    /** 选中的样式 */
    selectedStyle: TableSize;
    /** 表格设置 */
    tableSettings: Record<string, any>;
    /** 分页状态 */
    pagination?: {
        first: number;
        rows: number;
        page: number;
    };
    /** 排序状态 */
    sorting?: {
        sortField: string;
        sortOrder: number;
        multiSortMeta?: Array<{ field: string; order: number }>;
    };
    /** 筛选状态 */
    filters?: Record<string, any>;
    /** 选择状态 */
    selection?: any[];
    /** 展开的行 */
    expandedRows?: any[];
}



/**
 * Configurable Table 组件属性接口
 */
export interface ConfigurableTableProps<T = any> {
    /** 表格数据 */
    data: T[];
    /** 列配置 */
    columns: TableColumns<T>;
    /** 表格大小 */
    size?: TableSize;
    /** 表格设置 */
    tableSettings?: TableSettings;
    /** 表格样式类 */
    tableClass?: string;
    /** 表格样式 */
    tableStyle?: Record<string, any>;
    /** 是否显示斑马纹 */
    stripedRows?: boolean;
    /** 是否加载中 */
    loading?: boolean;
    /** 是否启用分页 */
    paginator?: boolean;
    /** 每页显示条数 */
    rows?: number;
    /** 总记录数 */
    totalRecords?: number;
    /** 当前页码 */
    first?: number;
    /** 分页器位置 */
    paginatorPosition?: 'top' | 'bottom' | 'both';
    /** 分页器模板 */
    paginatorTemplate?: string;
    /** 每页显示条数选项 */
    rowsPerPageOptions?: number[];
    /** 是否启用滚动 */
    scrollable?: boolean;
    /** 滚动高度 */
    scrollHeight?: string;
    /** 是否启用虚拟滚动 */
    virtualScroll?: boolean;
    /** 虚拟滚动行高 */
    virtualScrollItemSize?: number;
    /** 虚拟滚动延迟 */
    virtualScrollDelay?: number;
    /** 虚拟滚动选项 */
    virtualScrollOptions?: any;
    /** 是否启用筛选 */
    filterDisplay?: 'menu' | 'row';
    /** 全局筛选字段 */
    globalFilterFields?: string[];
    /** 筛选模式 */
    filterMode?: 'lenient' | 'strict';
    /** 筛选延迟 */
    filterDelay?: number;
    /** 筛选区域设置 */
    filterLocale?: string;
    /** 选择模式 */
    selectionMode?: 'single' | 'multiple';
    /** 当前选中的行 */
    selection?: T | T[];
    /** 数据键 */
    dataKey?: string;
    /** 元数据键 */
    metaKeySelection?: boolean;
    /** 上下文菜单选择 */
    contextMenuSelection?: T;
    /** 行组模式 */
    rowGroupMode?: 'subheader' | 'rowspan';
    /** 分组行字段 */
    groupRowsBy?: string;
    /** 可展开行 */
    expandableRows?: boolean;
    /** 展开的行 */
    expandedRows?: T[];
    /** 行展开模式 */
    rowExpandMode?: 'single' | 'multiple';
    /** 响应式布局 */
    responsiveLayout?: TableResponsiveLayout;
    /** 断点 */
    breakpoint?: string;
    /** 是否显示网格线 */
    showGridlines?: boolean;
    /** 是否显示搜索 */
    showSearch?: boolean;
    /** 搜索占位符 */
    searchPlaceholder?: string;
    /** 是否显示刷新按钮 */
    showRefresh?: boolean;
    /** 是否显示导出按钮 */
    showExport?: boolean;
    /** 导出文件名 */
    exportFilename?: string;
    /** 是否显示列设置 */
    showColumnSettings?: boolean;
    /** 列设置位置 */
    columnSettingsPosition?: TableColumnSettingsPosition;
    /** 是否启用状态持久化 */
    persistState?: boolean;
    /** 持久化存储键 */
    persistStateKey?: string;
    /** 是否持久化列配置 */
    persistColumns?: boolean;
    /** 是否持久化分页状态 */
    persistPagination?: boolean;
    /** 是否持久化排序状态 */
    persistSorting?: boolean;
    /** 是否持久化筛选状态 */
    persistFilters?: boolean;
    /** 是否持久化选择状态 */
    persistSelection?: boolean;
    /** 是否持久化展开状态 */
    persistExpansion?: boolean;
    /** 操作列配置 */
    actions?: Partial<TableColumn<T>>;
    /** 当前页 */
    current?: number;
    /** 分页器页码链接大小 */
    pageLinkSize?: number;
    /** 当前页报告模板 */
    currentPageReportTemplate?: string;
    /** 是否总是显示分页器 */
    alwaysShowPaginator?: boolean;
    /** 表格标题 */
    title?: string;
    /** 工具栏插槽内容 */
    showToolbar?: boolean;
    /** 筛选配置 */
    filterConfigs?: FilterConfig[];
    /** 搜索参数 */
    searchParams?: SearchParams;
}

/**
 * Configurable Table 组件事件接口
 */
export interface ConfigurableTableEmits<T = any> extends TableEventsEmits<T> {
    /** 更新选择 */
    'update:selection': [selection: T | T[]];
    /** 更新列配置 */
    'update:columns': [columns: TableColumns<T>];
    /** 更新第一条记录索引 */
    'update:first': [first: number];
    /** 更新每页显示条数 */
    'update:rows': [rows: number];
    /** 更新展开的行 */
    'update:expandedRows': [expandedRows: T[]];
    /** 更新筛选器 */
    'update:filters': [filters: any];
    /** 导出数据 */
    'export-data': [data: T[]];
}



/**
 * 表格实例方法
 */
export interface TableInstance {
    /** 刷新数据 */
    refresh: () => void;
    /** 清空选择 */
    clearSelection: () => void;
    /** 设置选择 */
    setSelection: (selection: any[]) => void;
    /** 获取选择 */
    getSelection: () => any[];
    /** 导出数据 */
    exportData: (config?: TableExportConfig) => void;
    /** 获取表格配置 */
    getTableConfig: () => TableState;
    /** 设置表格配置 */
    setTableConfig: (config: Partial<TableState>) => void;
    /** 重置表格配置 */
    resetTableConfig: () => void;
    /** 滚动到指定行 */
    scrollToRow: (index: number) => void;
    /** 滚动到顶部 */
    scrollToTop: () => void;
    /** 滚动到底部 */
    scrollToBottom: () => void;
}
