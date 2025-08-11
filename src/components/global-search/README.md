# GlobalSearch 全局搜索组件

## 📝 描述

全局搜索弹窗组件，提供快速搜索页面、菜单、用户等功能，支持搜索历史记录和热门搜索建议。

## ✨ 特性

- 🔍 **智能搜索**：支持标题、描述、分类的模糊搜索
- 📱 **响应式设计**：适配不同屏幕尺寸
- ⌨️ **键盘导航**：支持方向键选择、回车确认、ESC关闭
- 📚 **搜索历史**：自动保存搜索记录，支持快速重复搜索
- 🔥 **热门搜索**：预设热门搜索词，提升用户体验
- 🎨 **分类标识**：不同类型结果使用不同图标和颜色区分
- ⚡ **防抖搜索**：避免频繁请求，提升性能
- 🌙 **深色模式**：自动适配系统主题

## 🚀 使用方式

### 基础用法

```vue
<template>
  <div>
    <!-- 触发按钮 -->
    <Button 
      icon="pi pi-search" 
      label="搜索" 
      @click="showSearch = true" 
    />
    
    <!-- 全局搜索弹窗 -->
    <GlobalSearch 
      v-model:visible="showSearch"
      @search="handleSearch"
      @select="handleSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import GlobalSearch from '@/components/global-search/index.vue';

const showSearch = ref(false);

const handleSearch = (query: string) => {
  console.log('搜索:', query);
};

const handleSelect = (result: any) => {
  console.log('选择结果:', result);
};
</script>
```

### 快捷键触发

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

const showSearch = ref(false);

// 监听 Ctrl+K 或 Cmd+K 快捷键
const handleKeydown = (event: KeyboardEvent) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault();
    showSearch.value = true;
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>
```

## 📋 Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `visible` | `boolean` | `false` | 是否显示弹窗 |
| `placeholder` | `string` | `'搜索页面、菜单、用户...'` | 搜索框占位符 |
| `maxHistory` | `number` | `10` | 最大搜索历史数量 |

## 📤 Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `update:visible` | `(value: boolean)` | 更新显示状态 |
| `search` | `(query: string)` | 搜索事件 |
| `select` | `(result: SearchResult)` | 选择结果事件 |

## 🔧 SearchResult 类型

```typescript
interface SearchResult {
  id: string;              // 唯一标识
  title: string;           // 标题
  description?: string;    // 描述
  type: 'page' | 'menu' | 'user' | 'document' | 'setting'; // 类型
  path?: string;           // 路由路径
  icon?: string;           // 图标
  category?: string;       // 分类
}
```

## 🎨 样式定制

组件使用 PrimeVue 主题系统，支持通过 CSS 变量自定义样式：

```scss
.global-search-dialog {
  // 自定义弹窗样式
  :deep(.p-dialog) {
    border-radius: 16px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
  }
  
  // 自定义搜索框样式
  .search-input {
    border-radius: 12px;
    font-size: 18px;
  }
  
  // 自定义结果项样式
  .result-item {
    border-radius: 12px;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }
}
```

## 🔌 集成搜索API

```vue
<script setup lang="ts">
import { searchService } from '@/services/modules/search';

// 自定义搜索逻辑
const performSearch = async (query: string) => {
  if (!query.trim()) {
    searchResults.value = [];
    return;
  }

  loading.value = true;
  
  try {
    // 调用实际搜索API
    const response = await searchService.globalSearch({
      keyword: query,
      types: ['page', 'menu', 'user'],
      limit: 20
    });
    
    searchResults.value = response.data;
  } catch (error) {
    console.error('搜索失败:', error);
    searchResults.value = [];
  } finally {
    loading.value = false;
  }
};
</script>
```

## 🎯 最佳实践

### 1. 搜索结果优化

- 按相关性排序搜索结果
- 高亮匹配的关键词
- 提供搜索建议和自动完成

### 2. 性能优化

- 使用防抖避免频繁请求
- 缓存搜索结果
- 虚拟滚动处理大量结果

### 3. 用户体验

- 提供快捷键支持
- 保存搜索历史
- 智能搜索建议

## 🔍 搜索分类配置

```typescript
const searchCategories = [
  { 
    key: 'page', 
    label: '页面', 
    icon: FileText, 
    color: 'info' 
  },
  { 
    key: 'menu', 
    label: '菜单', 
    icon: Hash, 
    color: 'success' 
  },
  { 
    key: 'user', 
    label: '用户', 
    icon: Users, 
    color: 'warning' 
  },
  { 
    key: 'setting', 
    label: '设置', 
    icon: Settings, 
    color: 'danger' 
  }
];
```

## 📱 响应式支持

组件自动适配不同屏幕尺寸：

- **桌面端**：600px 宽度，居中显示
- **平板端**：90vw 宽度，适配屏幕
- **移动端**：全屏显示，优化触摸操作

## 🌐 国际化支持

```vue
<GlobalSearch 
  :placeholder="$t('search.placeholder')"
  v-model:visible="showSearch"
/>
```

## 🔧 故障排除

### 搜索无结果

1. 检查搜索API是否正常
2. 确认搜索数据格式正确
3. 验证搜索权限配置

### 键盘导航异常

1. 确保弹窗获得焦点
2. 检查键盘事件监听
3. 验证结果列表渲染

### 样式显示问题

1. 确认PrimeVue主题加载
2. 检查CSS变量定义
3. 验证深色模式适配