# CustomPagination 自定义分页组件

基于 PrimeVue Paginator 组件的二次封装，保持与官方组件完全一致的 API，同时提供了额外的自定义样式和功能扩展。

## ✨ 特性

- **完全兼容**：与 PrimeVue Paginator 保持 100% API 兼容
- **类型安全**：完整的 TypeScript 类型定义
- **插槽透传**：支持所有原生插槽的透传
- **样式增强**：提供了额外的视觉效果和动画
- **易于扩展**：可以轻松添加自定义功能

## 📦 基础用法

### 简单分页

```vue
<template>
  <CustomPagination
    :totalRecords="totalRecords"
    :rows="rows"
    :first="first"
    @page="onPageChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { PageState } from 'primevue/paginator';

const totalRecords = ref(120);
const rows = ref(10);
const first = ref(0);

const onPageChange = (event: PageState) => {
  first.value = event.first;
  rows.value = event.rows;
  console.log('当前页:', event.page);
  console.log('每页行数:', event.rows);
  console.log('起始索引:', event.first);
};
</script>
```

### 带行数选择的分页

```vue
<template>
  <CustomPagination
    :totalRecords="500"
    :rows="20"
    :rowsPerPageOptions="[10, 20, 50, 100]"
    currentPageReportTemplate="显示第 {first} 到 {last} 条记录，共 {totalRecords} 条"
    @page="onPageChange"
  />
</template>
```

### 自定义模板

```vue
<template>
  <CustomPagination
    :totalRecords="200"
    :rows="10"
    template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
    @page="onPageChange"
  />
</template>
```

## 🎛️ 属性 (Props)

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `totalRecords` | `number` | `0` | 总记录数 |
| `rows` | `number` | `10` | 每页显示的行数 |
| `first` | `number` | `0` | 第一条记录的索引 |
| `pageLinkSize` | `number` | `5` | 页面链接的数量 |
| `rowsPerPageOptions` | `number[]` | `undefined` | 每页行数选项 |
| `template` | `string` | `'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'` | 分页器模板 |
| `currentPageReportTemplate` | `string` | `'显示第 {first} 到 {last} 条记录，共 {totalRecords} 条'` | 当前页报告模板 |
| `alwaysShow` | `boolean` | `false` | 是否总是显示分页器 |
| `dt` | `any` | `undefined` | 设计令牌 |
| `pt` | `any` | `undefined` | 透传属性 |
| `ptOptions` | `any` | `undefined` | 透传选项 |
| `unstyled` | `boolean` | `false` | 是否无样式 |

## 🎪 事件 (Events)

| 事件名 | 参数 | 描述 |
|--------|------|------|
| `page` | `PageState` | 页面变化时触发 |

### PageState 接口

```typescript
interface PageState {
  first: number;      // 起始记录索引
  rows: number;       // 每页行数
  page: number;       // 当前页码（从0开始）
  pageCount?: number; // 总页数
}
```

## 🎨 插槽 (Slots)

组件支持所有 PrimeVue Paginator 的原生插槽：

| 插槽名 | 参数 | 描述 |
|--------|------|------|
| `start` | `{ state: PageState }` | 分页器开始位置的自定义内容 |
| `end` | `{ state: PageState }` | 分页器结束位置的自定义内容 |
| `firsticon` | `{ class: string }` | 第一页按钮图标 |
| `previcon` | `{ class: string }` | 上一页按钮图标 |
| `nexticon` | `{ class: string }` | 下一页按钮图标 |
| `lasticon` | `{ class: string }` | 最后一页按钮图标 |
| `rowsperpagedropdownicon` | `{ class: string }` | 每页行数下拉框图标 |
| `jumptopagedropdownicon` | `{ class: string }` | 跳转页面下拉框图标 |
| `container` | `{ first, last, rows, page, pageCount, pageLinks, totalRecords, ...callbacks }` | 完全自定义分页器容器 |

### 插槽使用示例

```vue
<template>
  <CustomPagination
    :totalRecords="100"
    :rows="10"
    @page="onPageChange"
  >
    <!-- 自定义开始内容 -->
    <template #start="{ state }">
      <div class="flex items-center gap-2">
        <i class="pi pi-list"></i>
        <span>数据列表</span>
      </div>
    </template>
    
    <!-- 自定义结束内容 -->
    <template #end="{ state }">
      <div class="text-sm text-gray-500">
        共 {{ state.pageCount }} 页
      </div>
    </template>
    
    <!-- 自定义图标 -->
    <template #firsticon="{ class }">
      <i :class="['pi pi-angle-double-left', class]"></i>
    </template>
    
    <template #previcon="{ class }">
      <i :class="['pi pi-angle-left', class]"></i>
    </template>
    
    <template #nexticon="{ class }">
      <i :class="['pi pi-angle-right', class]"></i>
    </template>
    
    <template #lasticon="{ class }">
      <i :class="['pi pi-angle-double-right', class]"></i>
    </template>
  </CustomPagination>
</template>
```

## 🎯 模板配置

`template` 属性支持以下组件：

- `FirstPageLink` - 第一页链接
- `PrevPageLink` - 上一页链接
- `PageLinks` - 页码链接
- `NextPageLink` - 下一页链接
- `LastPageLink` - 最后一页链接
- `RowsPerPageDropdown` - 每页行数下拉框
- `CurrentPageReport` - 当前页报告
- `JumpToPageDropdown` - 跳转页面下拉框
- `JumpToPageInput` - 跳转页面输入框

### 模板示例

```vue
<!-- 简化版分页器 -->
<CustomPagination
  template="PrevPageLink PageLinks NextPageLink"
  :totalRecords="100"
  :rows="10"
/>

<!-- 完整版分页器 -->
<CustomPagination
  template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
  :totalRecords="500"
  :rows="20"
  :rowsPerPageOptions="[10, 20, 50]"
/>
```

## 🎨 样式定制

组件提供了额外的样式增强：

```scss
.custom-pagination {
  :deep(.p-paginator) {
    // 圆角边框
    border-radius: var(--p-border-radius);
    
    .p-paginator-pages {
      .p-paginator-page {
        // 悬停动画效果
        transition: all 0.2s ease;
        
        &:hover {
          transform: translateY(-1px);
        }
      }
    }
    
    .p-dropdown {
      // 下拉框最小宽度
      min-width: 80px;
    }
  }
}
```

### 自定义样式示例

```vue
<template>
  <CustomPagination
    class="my-custom-pagination"
    :totalRecords="100"
    :rows="10"
  />
</template>

<style lang="scss">
.my-custom-pagination {
  :deep(.p-paginator) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    .p-paginator-page {
      color: white;
      border-color: rgba(255, 255, 255, 0.3);
      
      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      
      &.p-paginator-page-selected {
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }
}
</style>
```

## 🔧 高级用法

### 与表格组件结合使用

```vue
<template>
  <div>
    <!-- 数据表格 -->
    <DataTable
      :value="paginatedData"
      :loading="loading"
    >
      <Column field="id" header="ID" />
      <Column field="name" header="名称" />
      <Column field="email" header="邮箱" />
    </DataTable>
    
    <!-- 分页组件 -->
    <CustomPagination
      :totalRecords="totalRecords"
      :rows="rows"
      :first="first"
      :rowsPerPageOptions="[10, 25, 50]"
      @page="onPageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { PageState } from 'primevue/paginator';

const data = ref([]);
const totalRecords = ref(0);
const rows = ref(10);
const first = ref(0);
const loading = ref(false);

const paginatedData = computed(() => {
  const start = first.value;
  const end = start + rows.value;
  return data.value.slice(start, end);
});

const onPageChange = (event: PageState) => {
  first.value = event.first;
  rows.value = event.rows;
  loadData();
};

const loadData = async () => {
  loading.value = true;
  try {
    // 模拟 API 调用
    const response = await fetch(`/api/data?page=${first.value / rows.value}&size=${rows.value}`);
    const result = await response.json();
    data.value = result.data;
    totalRecords.value = result.total;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>
```

## 📝 注意事项

1. **类型安全**：确保导入正确的类型定义
2. **事件处理**：`@page` 事件会在页面变化时触发，需要更新相关的响应式数据
3. **性能优化**：对于大数据集，建议使用服务端分页
4. **样式兼容**：自定义样式时注意与 PrimeVue 主题的兼容性

## 🔗 相关链接

- [PrimeVue Paginator 官方文档](https://primevue.org/paginator)
- [PrimeVue 主题定制](https://primevue.org/theming)
