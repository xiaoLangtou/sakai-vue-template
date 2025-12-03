import type { VNode } from 'vue';

/**
 * 表格列配置
 */
export interface CustomTableColumn<T = any> {
    /** 列唯一标识 */
    key?: string;
    /** 字段名（支持嵌套：user.name） */
    field?: string;
    /** 列标题 */
    header?: string;
    /** 列标题（别名） */
    title?: string;
    /** 列宽度 */
    width?: string | number;
    /** 最小宽度 */
    minWidth?: string | number;
    /** 是否可排序 */
    sortable?: boolean;
    /** 是否禁用（隐藏） */
    disabled?: boolean;
    /** 是否固定列 */
    frozen?: boolean;
    /** 固定列对齐方向 */
    alignFrozen?: 'left' | 'right';
    /** 列排序 */
    order?: number;
    /** 文本对齐 */
    align?: 'left' | 'center' | 'right';
    /** 是否显示省略号 */
    ellipsis?: boolean;
    /** 是否显示 Tooltip */
    showTooltip?: boolean;
    /** Tooltip 字段 */
    tooltipField?: string;
    /** Tooltip 内容 */
    tooltipContent?: string | ((data: T, index: number) => string);
    /** Tooltip 配置 */
    tooltipOptions?: Record<string, any>;
    /** 自定义渲染函数 */
    render?: (data: T, index: number) => VNode | string;
    /** 自定义文本 */
    text?: string | ((data: T, index: number) => string);
    /** 头部样式 */
    headerStyle?: Record<string, any>;
    /** 单元格样式 */
    bodyStyle?: Record<string, any>;
    /** 选择模式 */
    selectionMode?: 'single' | 'multiple';
    /** 插槽名称 */
    slotName?: string;
}

/**
 * 操作列配置
 */
export interface ActionColumnConfig<T = any> {
    /** 列字段名 */
    field: string;
    /** 列标题 */
    header: string;
    /** 头部样式 */
    headerStyle?: Record<string, any>;
    /** 单元格样式 */
    bodyStyle?: Record<string, any>;
    /** 是否固定 */
    frozen?: boolean;
    /** 固定方向 */
    alignFrozen?: 'left' | 'right';
    /** 自定义渲染函数 */
    render?: (data: T, index: number) => VNode | string;
    /** 插槽名称 */
    slotName?: string;
}

/**
 * 表格样式配置
 */
export interface TableStyleConfig {
    /** 是否显示行分割线 */
    showRowDivider?: boolean;
    /** 是否显示斑马纹 */
    stripedRows?: boolean;
    /** 是否显示阴影 */
    showShadow?: boolean;
    /** 是否显示边框 */
    showBorder?: boolean;
    /** 是否启用虚拟滚动 */
    virtualScroll?: boolean;
    /** 虚拟滚动项高度 */
    virtualScrollItemSize?: number;
    /** 是否显示网格线 */
    showGridlines?: boolean;
}

/**
 * 表格尺寸类型
 */
export type TableSize = 'small' | 'normal' | 'large';

/**
 * 分页事件参数
 */
export interface PageEvent {
    /** 当前页第一条记录的索引 */
    first: number;
    /** 每页显示的行数 */
    rows: number;
    /** 当前页码（从 0 开始） */
    page: number;
    /** 总页数 */
    pageCount: number;
}

/**
 * 排序事件参数
 */
export interface SortEvent {
    /** 排序字段 */
    sortField: string;
    /** 排序顺序：1 升序，-1 降序 */
    sortOrder: 1 | -1;
}

/**
 * 行点击事件参数
 */
export interface RowClickEvent<T = any> {
    /** 原始事件 */
    originalEvent: Event;
    /** 行数据 */
    data: T;
    /** 行索引 */
    index: number;
}

/**
 * CustomTable 组件 Props
 */
export interface CustomTableProps<T = any> {
    /** 表格数据 */
    data: T[];
    /** 列配置 */
    columns: CustomTableColumn<T>[];
    /** 数据唯一标识字段 */
    dataKey?: string;
    /** 是否显示网格线 */
    showGridlines?: boolean;
    /** 是否启用分页 */
    paginator?: boolean;
    /** 当前页码（从 1 开始） */
    current?: number;
    /** 每页显示的行数 */
    rows?: number;
    /** 总记录数 */
    totalRecords?: number;
    /** 是否可滚动 */
    scrollable?: boolean;
    /** 每页显示行数选项 */
    rowsPerPageOptions?: number[];
    /** 分页器模板 */
    paginatorTemplate?: string;
    /** 当前页报告模板 */
    currentPageReportTemplate?: string;
    /** 页码链接数量 */
    pageLinkSize?: number;
    /** 是否始终显示分页器 */
    alwaysShowPaginator?: boolean;
    /** 响应式布局模式 */
    responsiveLayout?: 'stack' | 'scroll';
    /** 是否显示斑马纹 */
    stripedRows?: boolean;
    /** 是否加载中 */
    loading?: boolean;
    /** 是否显示列设置 */
    showColumnSettings?: boolean;
    /** 列设置位置 */
    columnSettingsPosition?: 'header' | 'footer';
    /** 是否显示工具栏 */
    showToolbar?: boolean;
    /** 表格尺寸 */
    size?: TableSize;
    /** 是否启用虚拟滚动 */
    virtualScroll?: boolean;
    /** 虚拟滚动项高度 */
    virtualScrollItemSize?: number;
    /** 是否持久化状态 */
    persistState?: boolean;
    /** 表格样式配置 */
    tableSettings?: TableStyleConfig;
    /** 操作列配置 */
    actions?: ActionColumnConfig<T>;
    /** 选择模式 */
    selectionMode?: 'single' | 'multiple';
    /** 选中的行 */
    selection?: T | T[];
    /** 过滤配置 */
    filterConfigs?: any[];
    /** 搜索参数 */
    searchParams?: Record<string, any>;
}

/**
 * CustomTable 组件 Emits
 */
export interface CustomTableEmits<T = any> {
    /** 分页事件 */
    (e: 'page', event: PageEvent): void;
    /** 排序事件 */
    (e: 'sort', event: SortEvent): void;
    /** 行点击事件 */
    (e: 'row-click', event: RowClickEvent<T>): void;
    /** 行双击事件 */
    (e: 'row-dblclick', event: RowClickEvent<T>): void;
    /** 过滤变化事件 */
    (e: 'filter-change', filters: Record<string, any>): void;
    /** 刷新事件 */
    (e: 'refresh'): void;
    /** 选择变化事件 */
    (e: 'selection-change', selection: T | T[]): void;
    /** 列变化事件 */
    (e: 'column-change', column: CustomTableColumn<T>, type: 'visibility' | 'frozen' | 'order'): void;
    /** 样式变化事件 */
    (e: 'style-change', styleName: TableSize): void;
    /** 设置变化事件 */
    (e: 'setting-change', key: string, value: any): void;
}

/**
 * CustomTableSettings 组件 Props
 */
export interface CustomTableSettingsProps {
    /** 列配置 */
    columns: CustomTableColumn[];
    /** 标题 */
    title?: string;
    /** 是否显示样式选项 */
    showStyleOptions?: boolean;
    /** 是否显示表格设置 */
    showTableSettings?: boolean;
    /** 是否启用拖拽 */
    enableDrag?: boolean;
    /** 选中的样式 */
    selectedStyle?: TableSize;
    /** 表格设置 */
    tableSettings?: TableStyleConfig;
    /** 样式选项 */
    styleOptions?: Array<{
        name: TableSize;
        label: string;
        preview: {
            header: string;
            row: string;
        };
    }>;
    /** 表格设置选项 */
    tableSettingsOptions?: Array<{
        key: string;
        label: string;
    }>;
}

/**
 * CustomTableSettings 组件 Emits
 */
export interface CustomTableSettingsEmits {
    (e: 'update:columns', columns: CustomTableColumn[]): void;
    (e: 'column-change', column: CustomTableColumn, type: 'visibility' | 'frozen' | 'order'): void;
    (e: 'style-change', styleName: TableSize): void;
    (e: 'setting-change', key: string, value: any): void;
    (e: 'update:selectedStyle', styleName: TableSize): void;
    (e: 'update:tableSettings', settings: TableStyleConfig): void;
}
