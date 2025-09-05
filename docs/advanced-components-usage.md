# 高级组件使用文档

本文档包含项目中高级功能组件的详细使用说明，包括全局搜索、浮动配置器、表格列设置、页面头部等组件。

## GlobalSearch 全局搜索组件

### 组件描述

`GlobalSearch` 是一个功能强大的全局搜索对话框组件，支持搜索页面、菜单、用户、文档等多种类型的内容，提供搜索历史记录和键盘快捷键支持。

### 基础使用

```vue
<template>
  <GlobalSearch
    v-model:visible="searchVisible"
    @search="handleSearch"
    @select="handleSelect"
  />
</template>

<script setup>
import { ref } from 'vue'
import { GlobalSearch } from '@/components'

const searchVisible = ref(false)

const handleSearch = (query) => {
  console.log('搜索查询:', query)
}

const handleSelect = (result) => {
  console.log('选择结果:', result)
  // 导航到选中的页面
  if (result.path) {
    router.push(result.path)
  }
}
</script>
```

### 高级使用

```vue
<template>
  <GlobalSearch
    v-model:visible="searchVisible"
    placeholder="搜索页面、用户或设置..."
    :max-history="20"
    @search="handleSearch"
    @select="handleSelect"
  />
</template>

<script setup>
import { ref } from 'vue'
import { GlobalSearch } from '@/components'

const searchVisible = ref(false)

const handleSearch = (query) => {
  // 自定义搜索逻辑
  console.log('执行搜索:', query)
}

const handleSelect = (result) => {
  // 处理选择结果
  console.log('选择了:', result.title)
  
  // 根据类型执行不同操作
  switch (result.type) {
    case 'page':
      router.push(result.path)
      break
    case 'user':
      // 打开用户详情
      break
    case 'setting':
      // 打开设置页面
      break
  }
}
</script>
```

### Attributes (Props)

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| visible | 是否显示搜索对话框 | boolean | — | false |
| placeholder | 搜索输入框占位符 | string | — | 'Type a command or search...' |
| maxHistory | 最大搜索历史数量 | number | — | 10 |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:visible | 显示状态变化时触发 | (value: boolean) |
| search | 执行搜索时触发 | (query: string) |
| select | 选择搜索结果时触发 | (result: SearchResult) |

### Types

```typescript
interface SearchResult {
  id: string
  title: string
  description?: string
  type: 'page' | 'menu' | 'user' | 'document' | 'setting'
  path?: string
  icon?: string
  category?: string
}

interface SearchCategory {
  key: string
  label: string
  icon: any
  color: string
}
```

---

## FloatingConfigurator 浮动配置器组件

### 组件描述

`FloatingConfigurator` 是一个浮动在页面右上角的配置器组件，提供主题切换和应用配置功能。

### 基础使用

```vue
<template>
  <FloatingConfigurator />
</template>

<script setup>
import { FloatingConfigurator } from '@/components'
</script>
```

### 功能特性

- **主题切换**: 支持明暗主题切换
- **应用配置**: 提供应用外观配置选项
- **浮动定位**: 固定在页面右上角
- **响应式设计**: 适配不同屏幕尺寸

### 样式定制

```vue
<template>
  <FloatingConfigurator class="custom-configurator" />
</template>

<style scoped>
.custom-configurator {
  /* 自定义样式 */
  top: 1rem;
  right: 1rem;
}
</style>
```

---

## TableColumnSettings 表格列设置组件

### 组件描述

`TableColumnSettings` 是一个功能丰富的表格列配置组件，支持列的显示/隐藏、排序、冻结、样式设置等功能。

### 基础使用

```vue
<template>
  <TableColumnSettings
    v-model:columns="tableColumns"
    @column-change="handleColumnChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import { TableColumnSettings } from '@/components'

const tableColumns = ref([
  { key: 'name', label: '姓名', visible: true, frozen: false },
  { key: 'age', label: '年龄', visible: true, frozen: false },
  { key: 'email', label: '邮箱', visible: false, frozen: false }
])

const handleColumnChange = (column, type) => {
  console.log('列变化:', column, type)
}
</script>
```

### 高级使用

```vue
<template>
  <TableColumnSettings
    v-model:columns="tableColumns"
    v-model:selectedStyle="tableStyle"
    v-model:tableSettings="settings"
    title="自定义表格设置"
    :show-style-options="true"
    :show-table-settings="true"
    :enable-drag="true"
    :style-options="styleOptions"
    :table-settings-options="settingsOptions"
    @column-change="handleColumnChange"
    @style-change="handleStyleChange"
    @setting-change="handleSettingChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import { TableColumnSettings } from '@/components'

const tableColumns = ref([
  { key: 'id', label: 'ID', visible: true, frozen: true },
  { key: 'name', label: '姓名', visible: true, frozen: false },
  { key: 'department', label: '部门', visible: true, frozen: false },
  { key: 'position', label: '职位', visible: false, frozen: false },
  { key: 'salary', label: '薪资', visible: false, frozen: false }
])

const tableStyle = ref('normal')
const settings = ref({
  showRowDivider: true,
  stripedRows: true,
  showShadow: false,
  showBorder: true
})

const styleOptions = ref([
  {
    name: 'compact',
    label: '紧凑',
    preview: { header: 'width: 70%', row: 'width: 60%' }
  },
  {
    name: 'normal',
    label: '标准',
    preview: { header: 'width: 80%', row: 'width: 75%' }
  },
  {
    name: 'comfortable',
    label: '宽松',
    preview: { header: 'width: 90%', row: 'width: 85%' }
  }
])

const settingsOptions = ref([
  { key: 'stripedRows', label: '斑马纹' },
  { key: 'showBorder', label: '边框' },
  { key: 'showShadow', label: '阴影' }
])

const handleColumnChange = (column, type) => {
  console.log('列配置变化:', { column, type })
}

const handleStyleChange = (styleName) => {
  console.log('样式变化:', styleName)
}

const handleSettingChange = (key, value) => {
  console.log('设置变化:', { key, value })
}
</script>
```

### Attributes (Props)

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| columns | 表格列配置 | TableColumns | — | [] |
| title | 设置面板标题 | string | — | '表格设置' |
| showStyleOptions | 是否显示样式选项 | boolean | — | true |
| showTableSettings | 是否显示表格设置 | boolean | — | true |
| enableDrag | 是否启用拖拽排序 | boolean | — | true |
| selectedStyle | 当前选中的样式 | string | — | 'normal' |
| tableSettings | 表格设置对象 | object | — | {} |
| styleOptions | 样式选项配置 | array | — | [] |
| tableSettingsOptions | 表格设置选项 | array | — | [] |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:columns | 列配置更新时触发 | (columns: TableColumns) |
| column-change | 列属性变化时触发 | (column: any, type: string) |
| style-change | 样式变化时触发 | (styleName: string) |
| setting-change | 设置变化时触发 | (key: string, value: any) |
| update:selectedStyle | 选中样式更新时触发 | (styleName: string) |
| update:tableSettings | 表格设置更新时触发 | (settings: object) |

---

## PageHeader 页面头部组件

### 组件描述

`PageHeader` 是一个标准化的页面头部组件，提供标题、描述、返回按钮、面包屑导航和操作按钮等功能。

### 基础使用

```vue
<template>
  <PageHeader
    title="用户管理"
    description="管理系统用户信息和权限"
    @back="handleBack"
  >
    <template #actions>
      <Button label="新增用户" icon="pi pi-plus" />
    </template>
  </PageHeader>
</template>

<script setup>
import { PageHeader } from '@/components'

const handleBack = () => {
  // 返回上一页逻辑
  router.back()
}
</script>
```

### 高级使用

```vue
<template>
  <PageHeader
    title="用户详情"
    description="查看和编辑用户基本信息"
    :show-back-button="true"
    back-icon="pi pi-arrow-left"
    back-aria-label="返回用户列表"
    title-class="text-2xl font-bold"
    description-class="text-gray-500"
    @back="handleBack"
  >
    <!-- 面包屑导航 -->
    <template #breadcrumb>
      <Breadcrumb :model="breadcrumbItems" />
    </template>

    <!-- 自定义图标 -->
    <template #icon>
      <Avatar icon="pi pi-user" class="mr-2" />
    </template>

    <!-- 状态标签 -->
    <template #status>
      <Tag value="活跃" severity="success" />
    </template>

    <!-- 操作按钮 -->
    <template #actions>
      <Button label="编辑" icon="pi pi-pencil" class="mr-2" />
      <Button label="删除" icon="pi pi-trash" severity="danger" />
    </template>

    <!-- 扩展内容 -->
    <template #default>
      <div class="grid grid-cols-3 gap-4 mt-4">
        <Card>
          <template #title>基本信息</template>
          <template #content>
            <!-- 用户基本信息 -->
          </template>
        </Card>
      </div>
    </template>
  </PageHeader>
</template>

<script setup>
import { ref } from 'vue'
import { PageHeader } from '@/components'
import Breadcrumb from 'primevue/breadcrumb'
import Avatar from 'primevue/avatar'
import Tag from 'primevue/tag'
import Card from 'primevue/card'

const breadcrumbItems = ref([
  { label: '首页', to: '/' },
  { label: '用户管理', to: '/users' },
  { label: '用户详情' }
])

const handleBack = () => {
  router.push('/users')
}
</script>
```

### Attributes (Props)

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| title | 页面标题 | string | — | '' |
| description | 页面描述 | string | — | '' |
| showBackButton | 是否显示返回按钮 | boolean | — | true |
| backIcon | 返回按钮图标 | string | — | 'pi pi-arrow-left' |
| backAriaLabel | 返回按钮无障碍标签 | string | — | '返回' |
| titleClass | 标题自定义样式类 | string | — | '' |
| descriptionClass | 描述自定义样式类 | string | — | '' |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| back | 点击返回按钮时触发 | — |

### Slots

| 插槽名 | 说明 |
|--------|------|
| breadcrumb | 面包屑导航区域 |
| icon | 自定义图标区域 |
| title | 自定义标题内容 |
| status | 状态标签区域 |
| description | 自定义描述内容 |
| actions | 操作按钮区域 |
| default | 扩展内容区域 |

---

## 最佳实践

### 1. 全局搜索使用建议

- **键盘快捷键**: 建议为全局搜索设置快捷键（如 Ctrl+K）
- **搜索结果分类**: 合理配置搜索分类，提升用户体验
- **搜索历史**: 利用搜索历史功能，方便用户快速访问

### 2. 表格列设置优化

- **默认配置**: 为常用表格提供合理的默认列配置
- **用户偏好**: 考虑保存用户的列设置偏好到本地存储
- **响应式设计**: 在移动端适当隐藏非关键列

### 3. 页面头部规范

- **一致性**: 保持页面头部的视觉和交互一致性
- **信息层级**: 合理组织标题、描述和操作按钮的层级关系
- **响应式适配**: 在小屏幕上适当调整布局和内容

### 4. 浮动配置器使用

- **位置固定**: 确保配置器不遮挡重要内容
- **主题一致**: 配置器样式应与当前主题保持一致
- **功能精简**: 只放置最常用的配置选项

### 5. 组件组合使用

```vue
<template>
  <div class="page-layout">
    <!-- 页面头部 -->
    <PageHeader
      :title="pageTitle"
      :description="pageDescription"
      @back="handleBack"
    >
      <template #actions>
        <TableColumnSettings
          v-model:columns="tableColumns"
          @column-change="handleColumnChange"
        />
        <Button label="新增" icon="pi pi-plus" @click="handleAdd" />
      </template>
    </PageHeader>

    <!-- 主要内容 -->
    <div class="page-content">
      <ConfigurableTable
        :columns="tableColumns"
        :data="tableData"
        :loading="loading"
      />
    </div>

    <!-- 全局搜索 -->
    <GlobalSearch
      v-model:visible="searchVisible"
      @select="handleSearchSelect"
    />

    <!-- 浮动配置器 -->
    <FloatingConfigurator />
  </div>
</template>
```

这种组合使用方式可以为用户提供完整、一致的页面体验。