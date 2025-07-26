# PrimeVue DataTable API

API defines helper props, events and others for the PrimeVue DataTable module.

## DataTable

DataTable displays data in tabular format.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| value | array | null | 要显示的对象数组。 |
| dataKey | string\|function | null | 用于行键的行数据的属性名或获取函数。 |
| rows | number | null | 每页显示的行数。 |
| first | number | 0 | 要显示的第一行的索引。 |
| totalRecords | number | null | 总记录数，未定义时默认为值的长度。 |
| paginator | boolean | false | 当指定为true时，启用分页。 |
| paginatorPosition | string | both | 分页器的位置，选项为"top"、"bottom"或"both"。 |
| alwaysShowPaginator | boolean | true | 即使只有一页也是否显示分页器。 |
| paginatorTemplate | string | FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown | 分页器的模板。 |
| pageLinkSize | number | 5 | 要显示的页面链接数。 |
| rowsPerPageOptions | array | null | 在每页行数下拉菜单中显示的整数值数组。 |
| currentPageReportTemplate | string | ({currentPage} of {totalPages}) | 当前页面报告元素的模板。 |
| lazy | boolean | false | 定义数据是否以懒加载方式加载和交互。 |
| loading | boolean | false | 显示加载器以指示数据加载正在进行中。 |
| loadingIcon | string | pi pi-spinner | 指示数据加载正在进行中时显示的图标。 |
| sortField | string\|function | null | 默认用于排序的数据属性名或获取函数。 |
| sortOrder | number | null | 默认排序数据的顺序。 |
| defaultSortOrder | number | 1 | 未排序列的默认排序顺序。 |
| multiSortMeta | array | null | 默认用于排序数据的SortMeta对象数组。 |
| sortMode | string | single | 定义排序是在单列还是多列上工作。 |
| removableSort | boolean | false | 启用时，列可以有未排序状态。 |
| filters | object | null | 用键值对定义过滤器的过滤器对象。 |
| filterDisplay | string | menu | 过滤器元素的布局。 |
| globalFilterFields | array | null | 全局过滤器的字段 |
| filterLocale | string | undefined | 过滤时使用的区域设置。默认区域设置是主机环境的当前区域设置。 |
| selection | any | null | 单选模式下的选定行或多选模式下的值数组。 |
| selectionMode | string | null | 指定选择模式，有效值为"single"和"multiple"。 |
| compareSelectionBy | string | deepEquals | 定义行是否被选中的算法，有效值为"equals"（按引用比较）和"deepEquals"（比较所有字段）。 |
| metaKeySelection | boolean | true | 定义选择是否需要metaKey。 |
| contextMenu | boolean | false | 启用上下文菜单集成。 |
| contextMenuSelection | object | null | 使用上下文菜单选择的行实例。 |
| selectAll | boolean | null | 是否选择所有数据。 |
| rowHover | boolean | false | 启用时，行的背景在悬停时改变。 |
| csvSeparator | string | , | 用作csv分隔符的字符。 |
| exportFilename | string | download | 导出文件的名称。 |
| exportFunction | function | null | 导出数据的自定义函数。 |
| autoLayout | boolean | false | 单元格宽度是否根据其内容缩放。 |
| resizableColumns | boolean | false | 启用时，可以使用拖放调整列的大小。 |
| columnResizeMode | string | fit | 定义列调整大小时整个表格宽度是否应该改变，有效值为"fit"和"expand"。 |
| reorderableColumns | boolean | false | 启用时，可以使用拖放重新排序列。 |
| expandedRows | array\|object | null | 显示为展开的行数据集合。 |
| expandedRowIcon | string | pi pi-chevron-down | 将行显示为展开的行切换器图标。 |
| collapsedRowIcon | string | pi pi-chevron-right | 将行显示为折叠的行切换器图标。 |
| rowGroupMode | string | null | 定义行组模式，有效值为"subheader"和"rowspan"。 |
| groupRowsBy | string\|array\|function | null | 用于行分组的一个或多个字段名。 |
| expandableRowGroups | boolean | false | 行组是否可以展开。 |
| expandedRowGroups | array\|object | null | 其组将呈现为展开的组字段值数组。 |
| stateStorage | string | session | 定义有状态表保持其状态的位置，有效值为"session"（sessionStorage）和"local"（localStorage）。 |
| stateKey | string | null | 在状态存储中使用的有状态表的唯一标识符。 |
| editMode | string | null | 定义单元格编辑模式，有效值为"cell"和"row"。 |
| editingRows | array\|object | null | 在行编辑模式下表示当前编辑数据的行集合。 |
| rowClass | function | null | 以行数据为参数并返回字符串以为行应用特定类的函数。 |
| rowStyle | function | null | 以行数据为参数并返回行内联样式的函数。 |
| scrollable | boolean | false | 指定时，启用水平和/或垂直滚动。 |
| scrollDirection | string | vertical | 滚动的方向，选项为"vertical"、"horizontal"和"both"。 |
| scrollHeight | string | null | 固定像素中滚动视口的高度或动态大小的"flex"关键字。 |
| virtualScrollerOptions | object | null | 是否使用virtualScroller功能。VirtualScroller组件的属性可以像对象一样在其中使用。 |
| frozenColumns | array | null | 表示冻结的动态列的对象数组。 |
| frozenValue | array | null | 要显示为冻结的对象数组。 |
| breakpoint | string | 960px | 使用堆栈响应式布局时定义最大宽度边界的断点。 |
| showGridlines | boolean | false | 是否在单元格之间显示网格线。 |
| stripedRows | boolean | false | 是否显示交替颜色的行。 |
| highlightOnSelect | boolean | false | 自动突出显示第一项。 |
| size | string | null | 定义表格的大小。 |
| tableStyle | object | null | 表格元素的内联样式。 |
| tableClass | string | null | 表格元素的样式类。 |
| tableProps | object | null | 用于将TableHTMLAttributes的所有属性传递给组件内的表格元素。 |
| filterInputProps | object | null | 用于将HTMLInputElement的所有属性传递给列过滤器覆盖层内的过滤器输入。 |
| filterButtonProps | object | null | 用于将HTMLButtonElement的所有属性传递给列过滤器覆盖层内的过滤器按钮。 |
| editButtonProps | object | null | 用于将HTMLButtonElement的所有属性传递给行编辑器内的编辑按钮。 |
| pt | object | null | 用于将属性传递给组件内的DOM元素。 |
| ptOptions | object | null | 用于配置组件的passthrough(pt)选项。 |
| unstyled | boolean | false | 启用时，它会删除核心中与组件相关的样式。 |

### Emits

| Name | Parameters | Description |
|------|------------|-------------|
| page | event: Custom page event | 分页时调用的回调。 |
| sort | event: Custom sort event | 排序时调用的回调。 |
| filter | event: Custom filter event | 过滤时调用的回调。 |
| value-change | value: New value | 值更改时调用的回调。 |
| row-click | event: Custom row click event | 单击行时调用的回调。 |
| row-dblclick | event: Custom row double click event | 双击行时调用的回调。 |
| row-contextmenu | event: Custom row context menu event | 使用上下文菜单选择行时调用的回调。 |
| row-select | event: Custom row select event | 选择行时调用的回调。 |
| row-unselect | event: Custom row unselect event | 取消选择行时调用的回调。 |
| row-expand | event: Custom row expand event | 展开行时调用的回调。 |
| row-collapse | event: Custom row collapse event | 折叠行时调用的回调。 |
| row-group-expand | event: Custom row group expand event | 展开行组时调用的回调。 |
| row-group-collapse | event: Custom row group collapse event | 折叠行组时调用的回调。 |
| cell-edit-init | event: Custom cell edit init event | 启动单元格编辑时调用的回调。 |
| cell-edit-complete | event: Custom cell edit complete event | 完成单元格编辑时调用的回调。 |
| cell-edit-cancel | event: Custom cell edit cancel event | 取消单元格编辑时调用的回调。 |
| row-edit-init | event: Custom row edit init event | 启动行编辑时调用的回调。 |
| row-edit-save | event: Custom row edit save event | 保存行编辑时调用的回调。 |
| row-edit-cancel | event: Custom row edit cancel event | 取消行编辑时调用的回调。 |
| column-resize-end | event: Custom column resize event | 调整列大小时调用的回调。 |
| column-reorder | event: Custom column reorder event | 重新排序列时调用的回调。 |
| row-reorder | event: Custom row reorder event | 重新排序行时调用的回调。 |
| select-all-change | event: Custom select all change event | 选择或取消选择所有行时调用的回调。 |
| state-restore | state: Restored state object | 恢复状态时调用的回调。 |
| state-save | state: Current state object | 保存状态时调用的回调。 |

### Slots

| Name | Parameters | Description |
|------|------------|-------------|
| header | - | 表格头部的自定义内容。 |
| footer | - | 表格底部的自定义内容。 |
| paginatorstart | - | 分页器左侧的自定义内容。 |
| paginatorend | - | 分页器右侧的自定义内容。 |
| empty | - | 没有数据显示时的自定义内容。 |
| groupheader | data: Row data, index: Row index | 组头部的自定义内容。 |
| groupfooter | data: Row data, index: Row index | 组底部的自定义内容。 |
| loading | - | 自定义加载模板。 |
| expansion | data: Row data, index: Row index | 行展开的自定义内容。 |
| frozenheader | - | 冻结头部的自定义内容。 |
| frozenbody | - | 冻结主体的自定义内容。 |
| frozenfooter | - | 冻结底部的自定义内容。 |

### Methods

| Name | Parameters | Return Type | Description |
|------|------------|-------------|-------------|
| exportCSV | options: Export options | void | 将数据导出为CSV格式。 |
| filter | value: Filter value, field: Field name, matchMode: Match mode | void | 过滤数据。 |
| reset | - | void | 重置表格状态。 |
| resetPage | - | void | 重置页面到第一页。 |
| clearState | - | void | 清除表格状态。 |
| closeEditingCell | - | void | 关闭编辑单元格。 |
| saveState | - | void | 保存当前状态。 |
| restoreState | - | void | 恢复保存的状态。 |

## Column

Column component for DataTable.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| columnKey | string | null | 如果未定义field属性，则为列的标识符。 |
| field | string\|function | null | 列表示的属性。 |
| sortField | string\|function | null | 排序时使用的属性名，默认为field。 |
| filterField | string\|function | null | 过滤时使用的属性名，默认为field。 |
| dataType | string | text | 数据类型。其值用于过滤和排序。 |
| sortable | boolean | false | 定义列是否可排序。 |
| header | string | null | 列的头部文本。 |
| footer | string | null | 列的底部文本。 |
| style | object | null | 列的内联样式。 |
| class | string | null | 列的样式类。 |
| headerStyle | object | null | 列头部的内联样式。 |
| headerClass | string | null | 列头部的样式类。 |
| bodyStyle | object | null | 列主体的内联样式。 |
| bodyClass | string | null | 列主体的样式类。 |
| footerStyle | object | null | 列底部的内联样式。 |
| footerClass | string | null | 列底部的样式类。 |
| showFilterMenu | boolean | true | 是否显示过滤器覆盖层。 |
| showFilterOperator | boolean | true | 启用时，显示匹配所有和匹配任何操作符选择器。 |
| showClearButton | boolean | true | 显示清除列过滤的按钮。 |
| showApplyButton | boolean | true | 显示应用列过滤的按钮。 |
| showFilterMatchModes | boolean | true | 是否显示匹配模式选择器。 |
| showAddButton | boolean | true | 显示添加更多过滤约束的按钮。 |
| filterMatchModeOptions | array | null | 用于覆盖全局匹配模式选项的标签值对数组。 |
| maxConstraints | number | 2 | 列过滤器的最大约束数。 |
| excludeGlobalFilter | boolean | false | 是否从全局过滤中排除。 |
| filterHeaderClass | string | null | 列过滤器头部的样式类。 |
| filterHeaderStyle | object | null | 列过滤器头部的内联样式。 |
| filterMenuClass | string | null | 列过滤器覆盖层的样式类。 |
| filterMenuStyle | object | null | 列过滤器覆盖层的内联样式。 |
| selectionMode | string | null | 定义基于列的选择模式。 |
| expander | boolean | false | 显示切换行展开的图标。 |
| colspan | number | null | 分组时跨越的列数。 |
| rowspan | number | null | 分组时跨越的行数。 |
| rowReorder | boolean | false | 此列是否显示重新排序行的图标。 |
| rowReorderIcon | string | pi pi-bars | 重新排序行的拖拽手柄图标。 |
| reorderableColumn | boolean | true | 定义列本身是否可以通过拖拽重新排序。 |
| rowEditor | boolean | false | 启用时，列显示行编辑器控件。 |
| frozen | boolean | false | 列是否在水平滚动中固定。 |
| alignFrozen | string | left | 冻结列的位置，有效值为left和right。 |
| exportable | boolean | true | 列是否包含在数据导出中。 |
| exportHeader | string | null | 要导出为CSV的列的自定义导出头部。 |
| exportFooter | string | null | 要导出为CSV的列的自定义导出底部。 |
| filterMatchMode | string | null | 定义搜索选项时使用的过滤算法。 |
| hidden | boolean | false | 列是否被渲染。 |
| pt | object | null | 用于将属性传递给组件内的DOM元素。 |
| ptOptions | object | null | 用于配置组件的passthrough(pt)选项。 |
| unstyled | boolean | false | 启用时，它会删除核心中与组件相关的样式。 |

### Slots

| Name | Parameters | Description |
|------|------------|-------------|
| header | column: Column object | 列头部的自定义内容。 |
| body | data: Row data, column: Column object, field: Field name, index: Row index, frozenRow: Whether row is frozen, editorInitCallback: Callback to invoke to initialize the row editor, rowToggleCallback: Callback to invoke to toggle the row expansion | 列主体的自定义内容。 |
| footer | column: Column object | 列底部的自定义内容。 |
| editor | data: Row data, column: Column object, field: Field name, index: Row index, frozenRow: Whether row is frozen, editorSaveCallback: Callback to invoke to save the edited row, editorCancelCallback: Callback to invoke to cancel the row edit | 列编辑器的自定义内容。 |
| filter | field: Field name, filterModel: Filter metadata, filterCallback: Callback to invoke to apply filter | 列过滤器的自定义内容。 |
| filterheader | field: Field name, filterModel: Filter metadata, filterCallback: Callback to invoke to apply filter | 列过滤器头部的自定义内容。 |
| filterfooter | field: Field name, filterModel: Filter metadata, filterCallback: Callback to invoke to apply filter | 列过滤器底部的自定义内容。 |
| filterclear | field: Field name, filterModel: Filter metadata, filterCallback: Callback to invoke to clear filter | 列过滤器清除的自定义内容。 |
| filterapply | field: Field name, filterModel: Filter metadata, filterCallback: Callback to invoke to apply filter | 列过滤器应用的自定义内容。 |
| loading | data: Row data, column: Column object, field: Field name, index: Row index, frozenRow: Whether row is frozen | 列主体的自定义加载内容。 |

## ColumnGroup

ColumnGroup component for DataTable.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| type | string | null | 定义组的类型。 |
| pt | object | null | 用于将属性传递给组件内的DOM元素。 |
| ptOptions | object | null | 用于配置组件的passthrough(pt)选项。 |
| unstyled | boolean | false | 启用时，它会删除核心中与组件相关的样式。 |

## Row

Row component for DataTable.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| pt | object | null | 用于将属性传递给组件内的DOM元素。 |
| ptOptions | object | null | 用于配置组件的passthrough(pt)选项。 |
| unstyled | boolean | false | 启用时，它会删除核心中与组件相关的样式。 |
