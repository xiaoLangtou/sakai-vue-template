# ConfigurableTable 组件使用文档

## 组件名称

`ConfigurableTable` - 可配置表格组件

## 组件描述

一个功能强大、高度可配置的表格组件，基于 PrimeVue DataTable 构建，支持排序、筛选、分页、列配置、状态持久化、响应式布局等特性。

## 基础使用示例

```vue
<template>
    <ConfigurableTable
        :data="tableData"
        :columns="columns"
        :loading="loading"
        :total-records="totalRecords"
        :paginator="true"
        :rows="10"
        :show-search="true"
        :show-refresh="true"
        :show-column-settings="true"
        :persist-state="true"
        persist-state-key="my-table"
        @page="handlePage"
        @sort="handleSort"
        @filter="handleFilter"
        @row-click="handleRowClick"
    >
        <!-- 自定义列插槽 -->
        <template #status="{ data }">
            <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
        </template>

        <!-- 操作列插槽 -->
        <template #column-actions="{ data, index }">
            <Button icon="pi pi-pencil" class="p-button-text" @click="editItem(data)" />
            <Button icon="pi pi-trash" class="p-button-text p-button-danger" @click="deleteItem(data)" />
        </template>
    </ConfigurableTable>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { TableColumn } from '@/types/custom-table';

const tableData = ref([]);
const loading = ref(false);
const totalRecords = ref(0);

const columns: TableColumn[] = [
    {
        field: 'id',
        header: 'ID',
        sortable: true,
        width: 80
    },
    {
        field: 'name',
        header: '姓名',
        sortable: true,
        filterable: true,
        ellipsis: true,
        showTooltip: true
    },
    {
        field: 'email',
        header: '邮箱',
        sortable: true,
        filterable: true
    },
    {
        field: 'status',
        header: '状态',
        sortable: true,
        slotName: 'status'
    }
];

const handlePage = (event: any) => {
    console.log('分页事件:', event);
};

const handleSort = (event: any) => {
    console.log('排序事件:', event);
};

const handleFilter = (event: any) => {
    console.log('筛选事件:', event);
};

const handleRowClick = (event: any) => {
    console.log('行点击事件:', event);
};
</script>
```

## 高级使用示例

### 使用 render 函数

```vue
<template>
    <ConfigurableTable :data="tableData" :columns="columns" :actions="actionColumn" />
</template>

<script setup lang="ts">
import { h } from 'vue';
import { Button, Tag } from 'primevue';

const columns = [
    {
        field: 'name',
        header: '姓名',
        render: (row: any) => h('strong', row.name)
    },
    {
        field: 'status',
        header: '状态',
        render: (row: any) =>
            h(Tag, {
                value: row.status,
                severity: getStatusSeverity(row.status)
            })
    }
];

const actionColumn = {
    header: '操作',
    render: (row: any, index: number) => [
        h(Button, {
            icon: 'pi pi-pencil',
            class: 'p-button-text',
            onClick: () => editItem(row)
        }),
        h(Button, {
            icon: 'pi pi-trash',
            class: 'p-button-text p-button-danger',
            onClick: () => deleteItem(row)
        })
    ]
};
</script>
```

## Attributes (Props)

| 参数                      | 说明                 | 类型                          | 可选值                       | 默认值         |
| ------------------------- | -------------------- | ----------------------------- | ---------------------------- | -------------- |
| data                      | 表格数据             | `T[]`                         | -                            | `[]`           |
| columns                   | 列配置               | `TableColumns<T>`             | -                            | `[]`           |
| size                      | 表格尺寸             | `TableSize`                   | `small` / `normal` / `large` | `normal`       |
| tableSettings             | 表格设置             | `TableSettings`               | -                            | `{}`           |
| tableClass                | 表格自定义类名       | `string`                      | -                            | -              |
| tableStyle                | 表格自定义样式       | `Record<string, any>`         | -                            | -              |
| stripedRows               | 是否显示斑马纹       | `boolean`                     | -                            | `false`        |
| loading                   | 是否显示加载状态     | `boolean`                     | -                            | `false`        |
| paginator                 | 是否启用分页         | `boolean`                     | -                            | `false`        |
| rows                      | 每页显示行数         | `number`                      | -                            | `10`           |
| totalRecords              | 总记录数             | `number`                      | -                            | `0`            |
| first                     | 当前页第一条记录索引 | `number`                      | -                            | `0`            |
| paginatorPosition         | 分页器位置           | `string`                      | `top` / `bottom` / `both`    | `bottom`       |
| paginatorTemplate         | 分页器模板           | `string`                      | -                            | -              |
| rowsPerPageOptions        | 每页行数选项         | `number[]`                    | -                            | `[10, 20, 50]` |
| scrollable                | 是否可滚动           | `boolean`                     | -                            | `false`        |
| scrollHeight              | 滚动高度             | `string`                      | -                            | -              |
| virtualScroll             | 是否启用虚拟滚动     | `boolean`                     | -                            | `false`        |
| virtualScrollItemSize     | 虚拟滚动项高度       | `number`                      | -                            | `46`           |
| virtualScrollDelay        | 虚拟滚动延迟         | `number`                      | -                            | `0`            |
| virtualScrollOptions      | 虚拟滚动选项         | `any`                         | -                            | -              |
| filterDisplay             | 筛选显示方式         | `string`                      | `menu` / `row`               | `menu`         |
| globalFilterFields        | 全局筛选字段         | `string[]`                    | -                            | -              |
| filterMode                | 筛选模式             | `string`                      | `lenient` / `strict`         | `lenient`      |
| filterDelay               | 筛选延迟             | `number`                      | -                            | `300`          |
| filterLocale              | 筛选语言             | `string`                      | -                            | -              |
| selectionMode             | 选择模式             | `string`                      | `single` / `multiple`        | -              |
| selection                 | 选中项               | `T \| T[]`                    | -                            | -              |
| dataKey                   | 数据主键             | `string`                      | -                            | -              |
| metaKeySelection          | 是否启用元键选择     | `boolean`                     | -                            | `true`         |
| contextMenuSelection      | 右键菜单选中项       | `T`                           | -                            | -              |
| rowGroupMode              | 行分组模式           | `string`                      | `subheader` / `rowspan`      | -              |
| groupRowsBy               | 分组字段             | `string`                      | -                            | -              |
| expandableRows            | 是否可展开行         | `boolean`                     | -                            | `false`        |
| expandedRows              | 展开的行             | `T[]`                         | -                            | `[]`           |
| rowExpandMode             | 行展开模式           | `string`                      | `single` / `multiple`        | `multiple`     |
| responsiveLayout          | 响应式布局           | `TableResponsiveLayout`       | `stack` / `scroll`           | `scroll`       |
| breakpoint                | 响应式断点           | `string`                      | -                            | `960px`        |
| showGridlines             | 是否显示网格线       | `boolean`                     | -                            | `false`        |
| showSearch                | 是否显示搜索框       | `boolean`                     | -                            | `false`        |
| searchPlaceholder         | 搜索框占位符         | `string`                      | -                            | `搜索...`      |
| showRefresh               | 是否显示刷新按钮     | `boolean`                     | -                            | `false`        |
| showExport                | 是否显示导出按钮     | `boolean`                     | -                            | `false`        |
| exportFilename            | 导出文件名           | `string`                      | -                            | `table-data`   |
| showColumnSettings        | 是否显示列设置       | `boolean`                     | -                            | `false`        |
| columnSettingsPosition    | 列设置按钮位置       | `TableColumnSettingsPosition` | `header` / `toolbar`         | `header`       |
| persistState              | 是否持久化状态       | `boolean`                     | -                            | `false`        |
| persistStateKey           | 持久化状态键名       | `string`                      | -                            | `table-state`  |
| persistColumns            | 是否持久化列配置     | `boolean`                     | -                            | `true`         |
| persistPagination         | 是否持久化分页状态   | `boolean`                     | -                            | `true`         |
| persistSorting            | 是否持久化排序状态   | `boolean`                     | -                            | `true`         |
| persistFilters            | 是否持久化筛选状态   | `boolean`                     | -                            | `true`         |
| persistSelection          | 是否持久化选择状态   | `boolean`                     | -                            | `false`        |
| persistExpansion          | 是否持久化展开状态   | `boolean`                     | -                            | `false`        |
| actions                   | 操作列配置           | `Partial<TableColumn<T>>`     | -                            | -              |
| current                   | 当前页码             | `number`                      | -                            | `1`            |
| pageLinkSize              | 分页链接数量         | `number`                      | -                            | `5`            |
| currentPageReportTemplate | 当前页报告模板       | `string`                      | -                            | -              |
| alwaysShowPaginator       | 是否总是显示分页器   | `boolean`                     | -                            | `true`         |
| title                     | 表格标题             | `string`                      | -                            | -              |
| showToolbar               | 是否显示工具栏       | `boolean`                     | -                            | `false`        |
| filterConfigs             | 筛选配置             | `FilterConfig[]`              | -                            | -              |
| searchParams              | 搜索参数             | `SearchParams`                | -                            | -              |

## Events

| 事件名              | 说明               | 参数                                                                |
| ------------------- | ------------------ | ------------------------------------------------------------------- |
| row-click           | 行点击事件         | `{ originalEvent: Event, data: T, index: number }`                  |
| row-dblclick        | 行双击事件         | `{ originalEvent: Event, data: T, index: number }`                  |
| selection-change    | 选择变化事件       | `selection: T[]`                                                    |
| filter-change       | 筛选变化事件       | `params: SearchParams`                                              |
| state-restore       | 状态恢复事件       | `state: any`                                                        |
| state-save          | 状态保存事件       | `state: any`                                                        |
| refresh             | 刷新事件           | -                                                                   |
| page                | 分页事件           | `event: any`                                                        |
| sort                | 排序事件           | `event: any`                                                        |
| filter              | 筛选事件           | `event: any`                                                        |
| update:selection    | 选择更新事件       | `selection: T \| T[]`                                               |
| update:columns      | 列更新事件         | `columns: TableColumns<T>`                                          |
| update:first        | 首行索引更新事件   | `first: number`                                                     |
| update:rows         | 行数更新事件       | `rows: number`                                                      |
| update:expandedRows | 展开行更新事件     | `expandedRows: T[]`                                                 |
| update:filters      | 筛选更新事件       | `filters: any`                                                      |
| cell-edit-complete  | 单元格编辑完成事件 | `event: any`                                                        |
| cell-edit-cancel    | 单元格编辑取消事件 | `event: any`                                                        |
| row-expand          | 行展开事件         | `event: any`                                                        |
| row-collapse        | 行收起事件         | `event: any`                                                        |
| column-resize-end   | 列调整大小结束事件 | `event: any`                                                        |
| column-reorder      | 列重排序事件       | `event: any`                                                        |
| column-change       | 列变化事件         | `column: TableColumn<T>, type: 'visibility' \| 'frozen' \| 'order'` |
| export-data         | 导出数据事件       | `data: T[]`                                                         |

## Slots

| 插槽名         | 说明           | 参数                                        |
| -------------- | -------------- | ------------------------------------------- |
| header         | 表格头部插槽   | -                                           |
| footer         | 表格底部插槽   | -                                           |
| empty          | 空状态插槽     | -                                           |
| loading        | 加载状态插槽   | -                                           |
| expansion      | 行展开内容插槽 | `{ data: T, index: number }`                |
| groupheader    | 分组头部插槽   | `{ data: any }`                             |
| groupfooter    | 分组底部插槽   | `{ data: any }`                             |
| column-actions | 操作列插槽     | `{ data: T, index: number }`                |
| column-label   | 列标签插槽     | `{ column: TableColumn<T> }`                |
| [field]        | 动态列插槽     | `{ data: T, field: string, index: number }` |

## Methods

| 方法名           | 说明         | 参数                          | 返回值       |
| ---------------- | ------------ | ----------------------------- | ------------ |
| refresh          | 刷新表格     | -                             | `void`       |
| clearSelection   | 清空选择     | -                             | `void`       |
| setSelection     | 设置选择     | `selection: any[]`            | `void`       |
| getSelection     | 获取选择     | -                             | `any[]`      |
| exportData       | 导出数据     | `config?: TableExportConfig`  | `void`       |
| getTableConfig   | 获取表格配置 | -                             | `TableState` |
| setTableConfig   | 设置表格配置 | `config: Partial<TableState>` | `void`       |
| resetTableConfig | 重置表格配置 | -                             | `void`       |
| scrollToRow      | 滚动到指定行 | `index: number`               | `void`       |
| scrollToTop      | 滚动到顶部   | -                             | `void`       |
| scrollToBottom   | 滚动到底部   | -                             | `void`       |

## Types

### TableColumn

```typescript
interface TableBaseColumn<T = any> {
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
    align?: 'left' | 'center' | 'right';
    /** 垂直对齐方式 */
    verticalAlign?: 'top' | 'middle' | 'bottom';
    /** 固定位置 */
    fixed?: 'left' | 'right' | boolean;
    /** 是否冻结列 */
    frozen?: boolean;
    /** 冻结列对齐方式 */
    alignFrozen?: 'left' | 'right';
    /** 列类型 */
    type?: 'text' | 'number' | 'date' | 'selection' | 'index' | 'expand' | 'custom';
    /** 选择模式 */
    selectionMode?: 'single' | 'multiple';
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
```

### TableSettings

```typescript
interface TableSettings {
    /** 表格尺寸 */
    size?: 'small' | 'normal' | 'large';
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
    /** 是否启用悬停高亮 */
    hoverHighlight?: boolean;
    /** 行高 */
    rowHeight?: number;
    /** 表头高度 */
    headerHeight?: number;
    /** 是否固定表头 */
    fixedHeader?: boolean;
    /** 最大高度 */
    maxHeight?: number;
    /** 是否显示表头 */
    showHeader?: boolean;
    /** 是否显示表尾 */
    showFooter?: boolean;
    /** 空数据文本 */
    emptyText?: string;
    /** 加载文本 */
    loadingText?: string;
    /** 是否启用虚拟滚动 */
    virtualScroll?: boolean;
    /** 虚拟滚动项高度 */
    virtualScrollItemSize?: number;
}
```

### TablePagination

```typescript
interface TablePagination {
    /** 当前页码 */
    page: number;
    /** 每页大小 */
    size: number;
    /** 总记录数 */
    total?: number;
    /** 每页大小选项 */
    pageSizeOptions?: number[];
    /** 是否显示快速跳转 */
    showQuickJumper?: boolean;
    /** 是否显示总数 */
    showTotal?: boolean;
    /** 是否显示页面大小选择器 */
    showSizeChanger?: boolean;
}
```

### TableExportConfig

```typescript
interface TableExportConfig {
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
```

## 最佳实践

### 1. 性能优化

- 对于大数据集，启用虚拟滚动
- 使用 `dataKey` 属性提高渲染性能
- 合理设置 `filterDelay` 避免频繁筛选

### 2. 状态持久化

- 为不同表格设置唯一的 `persistStateKey`
- 根据需要选择性启用持久化功能
- 注意持久化数据的版本兼容性

### 3. 响应式设计

- 使用 `responsiveLayout="stack"` 适配移动端
- 合理设置列的最小宽度
- 使用 `ellipsis` 和 `showTooltip` 处理长文本

### 4. 自定义渲染

- 优先使用插槽进行简单自定义
- 复杂逻辑使用 `render` 函数
- 注意 `render` 函数的性能影响

### 5. 事件处理

- 使用防抖处理频繁触发的事件
- 合理使用 `v-model` 进行双向绑定
- 注意事件参数的类型定义
