# CustomTable 表格组件

企业级可配置表格组件，基于 PrimeVue DataTable 封装。

## 目录结构

```
/src/components/table/
├── custom-table/              # 主表格组件
│   └── index.vue
├── custom-table-settings/     # 表格设置组件
│   └── index.vue
├── types.ts                   # 类型定义
├── constants.ts               # 常量配置
└── README.md                  # 文档
```

## 快速开始

### 基础用法

```vue
<template>
    <CustomTable :data="tableData" :columns="columns" :total-records="total" @page="handlePageChange" @refresh="handleRefresh" />
</template>

<script setup lang="ts">
import { CustomTable } from '@/components';
import type { CustomTableColumn } from '@/components/custom-table/types';

const columns: CustomTableColumn[] = [
    { field: 'name', header: '姓名', sortable: true },
    { field: 'age', header: '年龄', sortable: true },
    { field: 'email', header: '邮箱' }
];

const tableData = ref([
    { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
    { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
]);
</script>
```

### 固定列

```vue
<script setup lang="ts">
const columns: CustomTableColumn[] = [
    {
        field: 'name',
        header: '姓名',
        frozen: true, // 固定列
        alignFrozen: 'left' // 固定到左侧
    },
    { field: 'age', header: '年龄' },
    {
        field: 'actions',
        header: '操作',
        frozen: true,
        alignFrozen: 'right' // 固定到右侧
    }
];
</script>
```

### 自定义渲染

```vue
<template>
    <CustomTable :data="tableData" :columns="columns">
        <!-- 使用插槽 -->
        <template #column-status="{ data }">
            <Tag :severity="data.status === 1 ? 'success' : 'danger'">
                {{ data.status === 1 ? '启用' : '禁用' }}
            </Tag>
        </template>
    </CustomTable>
</template>

<script setup lang="ts">
import { h } from 'vue';

// 使用 render 函数
const columns: CustomTableColumn[] = [
    { field: 'name', header: '姓名' },
    {
        field: 'status',
        header: '状态',
        render: (data, index) => {
            return h(
                Tag,
                {
                    severity: data.status === 1 ? 'success' : 'danger'
                },
                () => (data.status === 1 ? '启用' : '禁用')
            );
        }
    }
];
</script>
```

## API 文档

### CustomTable Props

| 属性               | 类型                     | 默认值     | 说明             |
| ------------------ | ------------------------ | ---------- | ---------------- |
| data               | `T[]`                    | `[]`       | 表格数据         |
| columns            | `CustomTableColumn[]`    | `[]`       | 列配置           |
| dataKey            | `string`                 | `'id'`     | 数据唯一标识字段 |
| loading            | `boolean`                | `false`    | 加载状态         |
| paginator          | `boolean`                | `true`     | 是否启用分页     |
| current            | `number`                 | `1`        | 当前页码         |
| rows               | `number`                 | `10`       | 每页显示条数     |
| totalRecords       | `number`                 | `0`        | 总记录数         |
| size               | `TableSize`              | `'normal'` | 表格尺寸         |
| virtualScroll      | `boolean`                | `false`    | 是否启用虚拟滚动 |
| persistState       | `boolean`                | `false`    | 是否持久化状态   |
| showColumnSettings | `boolean`                | `true`     | 是否显示列设置   |
| selectionMode      | `'single' \| 'multiple'` | -          | 选择模式         |
| selection          | `T \| T[]`               | -          | 选中的行         |

完整 Props 定义见 [types.ts](types/types.ts)

### CustomTable Events

| 事件             | 参数                  | 说明     |
| ---------------- | --------------------- | -------- |
| page             | `PageEvent`           | 分页变化 |
| sort             | `SortEvent`           | 排序变化 |
| row-click        | `RowClickEvent`       | 行点击   |
| row-dblclick     | `RowClickEvent`       | 行双击   |
| filter-change    | `Record<string, any>` | 过滤变化 |
| refresh          | -                     | 刷新     |
| selection-change | `T \| T[]`            | 选择变化 |
| column-change    | `column, type`        | 列变化   |

### CustomTableColumn 配置

| 属性        | 类型                                | 说明                            |
| ----------- | ----------------------------------- | ------------------------------- |
| key         | `string`                            | 列唯一标识                      |
| field       | `string`                            | 字段名（支持嵌套：`user.name`） |
| header      | `string`                            | 列标题                          |
| width       | `string \| number`                  | 列宽度                          |
| sortable    | `boolean`                           | 是否可排序                      |
| frozen      | `boolean`                           | 是否固定列                      |
| alignFrozen | `'left' \| 'right'`                 | 固定列对齐方向                  |
| disabled    | `boolean`                           | 是否禁用（隐藏）                |
| ellipsis    | `boolean`                           | 是否显示省略号                  |
| showTooltip | `boolean`                           | 是否显示 Tooltip                |
| render      | `(data, index) => VNode \| string`  | 自定义渲染函数                  |
| text        | `string \| (data, index) => string` | 自定义文本                      |
| headerStyle | `Record<string, any>`               | 头部样式                        |
| bodyStyle   | `Record<string, any>`               | 单元格样式                      |

## 配置说明

### 常量配置 (constants.ts)

所有默认配置都提取到了 `constants.ts` 文件中：

- `DEFAULT_TABLE_CONFIG` - 默认表格配置
- `DEFAULT_PAGINATION_CONFIG` - 默认分页配置
- `DEFAULT_TABLE_SETTINGS` - 默认表格样式配置
- `DEFAULT_ACTION_COLUMN` - 默认操作列配置
- `TABLE_SIZE_CONFIG` - 表格尺寸配置映射
- `STYLE_OPTIONS` - 样式选项配置
- `DEBOUNCE_DELAYS` - 防抖延迟配置
- `FROZEN_COLUMN_CONFIG` - 固定列配置

### 类型定义 (types.ts)

完整的 TypeScript 类型定义：

- `CustomTableColumn` - 列配置类型
- `CustomTableProps` - 组件 Props 类型
- `CustomTableEmits` - 组件 Emits 类型
- `ActionColumnConfig` - 操作列配置类型
- `TableStyleConfig` - 表格样式配置类型
- `TableSize` - 表格尺寸类型
- `PageEvent` - 分页事件类型
- `SortEvent` - 排序事件类型
- `RowClickEvent` - 行点击事件类型

## 高级功能

### 状态持久化

```vue
<CustomTable :data="tableData" :columns="columns" persist-state persist-state-key="my-table" />
```

### 虚拟滚动

```vue
<CustomTable :data="largeDataset" :columns="columns" virtual-scroll :virtual-scroll-item-size="46" />
```

### 列设置

用户可以通过列设置面板：

- 拖拽排序列
- 显示/隐藏列
- 固定列到左侧或右侧
- 切换表格尺寸（紧凑/标准/宽松）
- 切换斑马纹、边框等样式

## 优化说明

### v2.0 更新 (2024-11-18)

1. **组件重命名**

    - `ConfigurableTable` → `CustomTable`
    - `TableColumnSettings` → `CustomTableSettings`

2. **配置优化**

    - 提取公共配置到 `constants.ts`
    - 减少硬编码，提高可维护性

3. **固定列优化**

    - 优化固定列位置更新逻辑
    - 使用 PrimeVue 原生 API
    - 添加列变化监听，自动更新固定列

4. **类型完善**

    - 完整的 TypeScript 类型定义
    - 移除 `any` 类型断言
    - 添加泛型支持

5. **性能优化**
    - 字段路径缓存
    - 防抖处理（resize、状态保存）
    - 虚拟滚动支持

## 迁移指南

### 从 ConfigurableTable 迁移

```diff
- import { ConfigurableTable } from '@/components';
+ import { CustomTable } from '@/components';

- <ConfigurableTable ... />
+ <CustomTable ... />
```

类型定义也需要更新：

```diff
- import type { ConfigurableTableProps } from '@/types/table';
+ import type { CustomTableProps } from '@/components/table/types';
```

**注意**：旧的类型名已标记为 `@deprecated`，但仍然可用以保持向后兼容。

## 示例

更多示例请参考：

- `/src/views/system/dict/index.vue` - 字典管理
- `/src/views/admin/role/index.vue` - 角色管理
- `/src/views/system/dict/dict-items.vue` - 字典项管理

## 相关文档

- [PrimeVue DataTable](https://primevue.org/datatable/)
- [项目开发规范](../../../AGENTS.md)
