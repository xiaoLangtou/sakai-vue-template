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
export type TableSize = 'small' | 'default' | 'large';

/**
 * 表格列基础配置
 */
export interface TableBaseColumn {
  /** 列唯一标识 */
  key: string;
  /** 列标题 */
  title?: string;
  /** 数据字段名 */
  field?: string;
  /** 列宽度 */
  width?: number;
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
  /** 是否显示 */
  visible?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 水平对齐方式 */
  align?: TableColumnAlign;
  /** 垂直对齐方式 */
  verticalAlign?: TableColumnVerticalAlign;
  /** 固定位置 */
  fixed?: TableColumnFixed;
  /** 是否冻结 */
  frozen?: boolean;
  /** 列类型 */
  type?: TableColumnType;
  /** 是否显示省略号 */
  ellipsis?: boolean;
  /** 排序顺序 */
  order?: number;
  /** 自定义渲染函数 */
  render?: (row: any, index: number) => string | any;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: Record<string, any>;
  /** 提示信息配置 */
  tooltipOptions?: {
    /** 是否启用提示 */
    enabled?: boolean;
    /** 提示内容 */
    content?: string | ((row: any) => string);
    /** 提示位置 */
    position?: 'top' | 'bottom' | 'left' | 'right';
  };
  /** 额外属性 */
  props?: Record<string, any>;
}

/**
 * 表格列组配置
 */
export interface TableColumnGroup {
  /** 列组唯一标识 */
  key: string;
  /** 列组标题 */
  title: string;
  /** 子列 */
  children: (TableColumn | TableColumnGroup)[];
  /** 水平对齐方式 */
  align?: TableColumnAlign;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: Record<string, any>;
}

/**
 * 表格列配置（联合类型）
 */
export type TableColumn = TableBaseColumn | TableColumnGroup;

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
}

/**
 * 表格事件
 */
export interface TableEvents {
  /** 行点击事件 */
  'row-click'?: (row: any, index: number, event: Event) => void;
  /** 行双击事件 */
  'row-dblclick'?: (row: any, index: number, event: Event) => void;
  /** 行右键事件 */
  'row-contextmenu'?: (row: any, index: number, event: Event) => void;
  /** 单元格点击事件 */
  'cell-click'?: (row: any, column: TableColumn, index: number, event: Event) => void;
  /** 单元格双击事件 */
  'cell-dblclick'?: (row: any, column: TableColumn, index: number, event: Event) => void;
  /** 选择变化事件 */
  'selection-change'?: (selection: any[]) => void;
  /** 排序变化事件 */
  'sort-change'?: (sort: TableSort) => void;
  /** 筛选变化事件 */
  'filter-change'?: (filters: TableFilter[]) => void;
  /** 分页变化事件 */
  'page-change'?: (pagination: TablePagination) => void;
  /** 列宽变化事件 */
  'column-resize'?: (column: TableColumn, width: number) => void;
  /** 列顺序变化事件 */
  'column-reorder'?: (columns: TableColumn[]) => void;
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
 * 表格状态
 */
export interface TableState {
  /** 当前选中的行 */
  selection: any[];
  /** 当前排序 */
  sort?: TableSort;
  /** 当前筛选 */
  filters: TableFilter[];
  /** 当前分页 */
  pagination?: TablePagination;
  /** 展开的行键 */
  expandedKeys: Record<string, boolean>;
  /** 列配置 */
  columns: TableColumn[];
  /** 表格设置 */
  settings: TableSettings;
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