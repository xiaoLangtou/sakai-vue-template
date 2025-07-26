# IconSelector 图标选择器组件

一个功能丰富的图标选择器组件，支持下拉选择和弹窗选择两种模式，具有现代化的设计和优秀的用户体验。

## ✨ 特性

- **多种显示模式**：支持下拉选择框和输入框+按钮两种模式
- **双图标库支持**：内置 PrimeVue 和 Lucide 图标库，支持切换
- **智能搜索**：支持图标名称和标签的实时搜索过滤
- **现代化设计**：采用 PrimeVue 设计系统，支持主题切换
- **响应式布局**：完美适配桌面端和移动端
- **丰富的交互**：悬停效果、选中状态、动画过渡
- **实时预览**：选择图标后即时显示预览效果
- **高度可定制**：支持自定义图标列表、样式和文本
- **无障碍支持**：完整的键盘导航和屏幕阅读器支持

## 🎨 视觉特性

### 现代化弹窗设计
- 大尺寸弹窗（900px 宽，85vh 高）
- 精美的头部设计，包含图标和描述
- 优化的内容布局和间距

### 增强的图标网格
- 8列网格布局，更好的视觉密度
- 圆角卡片设计，悬停和选中状态
- 选中指示器，清晰的视觉反馈
- 平滑的动画过渡效果

### 改进的搜索体验
- 大尺寸搜索框，更好的输入体验
- 搜索结果计数显示
- 一键清除搜索功能
- 优化的空状态提示

### 精美的预览卡片
- 图标预览卡片，显示选中的图标
- 图标名称和类名的完整信息
- 现代化的卡片设计

## 基础用法

### 下拉选择框模式

```vue
<template>
  <IconSelector
    v-model="selectedIcon"
    mode="dropdown"
    placeholder="请选择图标"
    show-preview
  />
</template>

<script setup>
import { ref } from 'vue';
import { IconSelector } from '@/components';

const selectedIcon = ref('');
</script>
```

### 输入框+按钮模式

```vue
<template>
  <IconSelector
    v-model="selectedIcon"
    mode="input"
    placeholder="请输入图标类名"
    show-preview
    preview-text="图标预览"
  />
</template>

<script setup>
import { ref } from 'vue';
import { IconSelector } from '@/components';

const selectedIcon = ref('');
</script>
```

## 📋 属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| modelValue | string | '' | 当前选中的图标 |
| mode | 'dropdown' \| 'input' | 'dropdown' | 显示模式 |
| placeholder | string | '请选择图标' | 占位符文本 |
| filter | boolean | true | 是否启用过滤（下拉模式） |
| filterPlaceholder | string | '搜索图标' | 过滤占位符 |
| showClear | boolean | true | 是否显示清除按钮 |
| showPreview | boolean | true | 是否显示图标预览 |
| previewText | string | '图标预览' | 预览文本 |
| invalid | boolean | false | 是否无效状态 |
| disabled | boolean | false | 是否禁用 |
| drawerTitle | string | '选择图标' | 弹窗标题 |
| drawerDescription | string | '选择一个图标作为菜单图标' | 弹窗描述 |
| enableSearch | boolean | true | 是否启用搜索 |
| customIcons | IconItem[] | [] | 自定义图标列表 |
| defaultLibrary | 'primevue' \| 'lucide' | 'primevue' | 默认图标库 |
| enabledLibraries | IconLibrary[] | ['primevue', 'lucide'] | 启用的图标库 |
| showLibraryTabs | boolean | true | 是否显示图标库切换标签 |

## 🎯 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | (value: string) | 值更新事件 |
| change | (value: string) | 图标改变事件 |

## 🔧 高级用法

### 双图标库支持

```vue
<template>
  <IconSelector
    v-model="selectedIcon"
    :enabled-libraries="['primevue', 'lucide']"
    default-library="lucide"
    show-library-tabs
  />
</template>
```

### 自定义图标列表

```vue
<template>
  <IconSelector
    v-model="selectedIcon"
    :custom-icons="customIconList"
    mode="dropdown"
  />
</template>

<script setup>
import { ref } from 'vue';
import { IconSelector } from '@/components';

const selectedIcon = ref('');
const customIconList = [
  { name: 'pi pi-home', label: 'home', library: 'primevue', category: 'general' },
  { name: 'pi pi-user', label: 'user', library: 'primevue', category: 'general' },
  { name: 'Settings', label: 'settings', library: 'lucide', category: 'general' }
];
</script>
```

### 表单集成

```vue
<template>
  <Form @submit="onSubmit">
    <FormField name="icon" label="菜单图标">
      <template #default="{ field }">
        <IconSelector
          v-model="field.value"
          mode="input"
          :invalid="field.invalid"
          show-preview
        />
      </template>
    </FormField>
  </Form>
</template>

<script setup>
import { Form, FormField } from '@primevue/forms';
import { IconSelector } from '@/components';

const onSubmit = (data) => {
  console.log('表单数据:', data);
};
</script>
```

## 🎨 样式定制

组件使用 PrimeVue 设计系统和 CSS 变量，支持主题切换和自定义样式：

### 自定义主题色彩

```scss
// 使用 CSS 变量自定义主色调
:root {
  --p-primary-50: #eff6ff;
  --p-primary-500: #3b82f6;
  --p-primary-600: #2563eb;
}
```

### 自定义图标网格

```scss
.icon-selector {
  // 自定义网格列数
  .grid {
    grid-template-columns: repeat(10, 1fr);
  }
  
  // 自定义选中状态
  .icon-grid-item.selected {
    border-color: #10b981;
    background: #ecfdf5;
  }
}
```

### 自定义弹窗尺寸

```scss
.icon-selector-dialog {
  :deep(.p-dialog) {
    width: 1200px !important;
    height: 90vh !important;
  }
}
```

## 📱 响应式设计

组件针对不同屏幕尺寸进行了优化：

- **桌面端（>1024px）**：8列网格，完整功能
- **平板端（768px-1024px）**：6列网格，适中尺寸
- **手机端（<768px）**：4列网格，紧凑布局
- **小屏手机（<480px）**：3列网格，最小化布局

## 🎭 图标库

### PrimeVue Icons (60+ 图标)
- **通用图标**：home, user, settings, list, table 等
- **图表图标**：chart-bar, chart-line, chart-pie 等
- **操作图标**：search, filter, download, upload 等
- **箭头图标**：arrow-up, arrow-down, chevron-left 等

### Lucide Icons (60+ 图标)
- **现代化设计**：简洁、一致的设计风格
- **高质量矢量**：完美的像素对齐
- **丰富分类**：涵盖各种使用场景

## ⚡ 性能优化

- **按需渲染**：只渲染可见的图标
- **智能缓存**：计算属性缓存搜索结果
- **防抖搜索**：优化搜索性能
- **虚拟滚动**：大量图标时的性能优化

## 🔧 开发注意事项

1. **图标命名**：确保图标名称符合对应库的规范
2. **类型安全**：使用 TypeScript 获得完整的类型支持
3. **主题适配**：组件自动适配 PrimeVue 主题
4. **无障碍性**：内置 ARIA 标签和键盘导航
5. **性能考虑**：大量自定义图标时建议分页加载

## 📦 依赖

- Vue 3.0+
- PrimeVue 4.0+
- Lucide Vue Next 0.525.0+
- Tailwind CSS 3.0+ (可选，用于响应式类名)

## 🚀 更新日志

### v2.0.0 (最新)
- ✨ 全新的现代化设计
- 🎨 优化的弹窗布局和交互
- 📱 改进的响应式设计
- 🔍 增强的搜索体验
- 🎯 新增图标库切换功能
- 💫 丰富的动画效果

### v1.0.0
- 🎉 初始版本发布
- 📋 基础的图标选择功能
- 🔧 支持自定义图标列表