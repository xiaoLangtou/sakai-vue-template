# OrgSelector 组织架构选择器使用文档

## 组件描述

`OrgSelector` 是一个功能强大的组织架构选择器组件，支持部门和人员的层级展示、多选/单选、搜索过滤、面包屑导航等功能。适用于人员选择、部门选择、组织架构浏览等场景。

## 基础使用

### 基本人员选择

```vue
<template>
  <OrgSelector
    :data="orgData"
    :multiple="true"
    :only-select-person="true"
    @change="handleSelectionChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import { OrgSelector } from '@/components'

const orgData = ref({
  children: [
    {
      id: 'dept1',
      name: '技术部',
      level: 0,
      staffs: [
        {
          idStaff: 'staff1',
          staffName: '张三',
          position: '前端工程师'
        },
        {
          idStaff: 'staff2',
          staffName: '李四',
          position: '后端工程师'
        }
      ],
      children: [
        {
          id: 'dept1-1',
          name: '前端组',
          level: 1,
          staffs: [
            {
              idStaff: 'staff3',
              staffName: '王五',
              position: 'Vue开发工程师'
            }
          ]
        }
      ]
    },
    {
      id: 'dept2',
      name: '产品部',
      level: 0,
      staffs: [
        {
          idStaff: 'staff4',
          staffName: '赵六',
          position: '产品经理'
        }
      ]
    }
  ]
})

const handleSelectionChange = (selectedItems) => {
  console.log('选中的人员:', selectedItems)
}
</script>
```

### 弹窗模式使用

```vue
<template>
  <div>
    <Button label="选择人员" @click="showOrgSelector" />
    
    <OrgSelector
      v-model:visible="selectorVisible"
      :data="orgData"
      mode="modal"
      title="选择团队成员"
      :multiple="true"
      :only-select-person="true"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { OrgSelector } from '@/components'

const selectorVisible = ref(false)
const selectedMembers = ref([])

const showOrgSelector = () => {
  selectorVisible.value = true
}

const handleConfirm = (selectedItems) => {
  selectedMembers.value = selectedItems
  console.log('确认选择:', selectedItems)
  selectorVisible.value = false
}

const handleCancel = () => {
  console.log('取消选择')
  selectorVisible.value = false
}
</script>
```

## 高级使用

### 部门和人员混合选择

```vue
<template>
  <OrgSelector
    :data="orgData"
    :multiple="true"
    :only-select-person="false"
    @change="handleMixedSelection"
  >
    <template #header>
      <div class="flex items-center justify-between p-4 border-b">
        <h3 class="text-lg font-semibold">选择部门或人员</h3>
        <div class="text-sm text-gray-500">
          已选择: {{ selectedCount }} 项
        </div>
      </div>
    </template>
  </OrgSelector>
</template>

<script setup>
import { ref, computed } from 'vue'
import { OrgSelector } from '@/components'

const selectedItems = ref([])

const selectedCount = computed(() => selectedItems.value.length)

const handleMixedSelection = (items) => {
  selectedItems.value = items
  console.log('选中的部门和人员:', {
    departments: items.filter(item => item.type === 'department'),
    staff: items.filter(item => item.type === 'staff')
  })
}
</script>
```

### 单选模式

```vue
<template>
  <OrgSelector
    :data="orgData"
    :multiple="false"
    :only-select-person="true"
    @change="handleSingleSelection"
  />
</template>

<script setup>
import { OrgSelector } from '@/components'

const handleSingleSelection = (selectedItems) => {
  const selectedPerson = selectedItems[0]
  if (selectedPerson) {
    console.log('选中的人员:', {
      id: selectedPerson.idStaff,
      name: selectedPerson.staffName,
      position: selectedPerson.position
    })
  }
}
</script>
```

### 自定义搜索和过滤

```vue
<template>
  <OrgSelector
    :data="filteredOrgData"
    :multiple="true"
    @change="handleSelectionChange"
  >
    <template #search>
      <div class="p-4 border-b">
        <div class="flex gap-2 mb-2">
          <InputText
            v-model="searchKeyword"
            placeholder="搜索人员或部门..."
            class="flex-1"
          />
          <Dropdown
            v-model="filterDepartment"
            :options="departmentOptions"
            option-label="name"
            option-value="id"
            placeholder="筛选部门"
            class="w-48"
          />
        </div>
        <div class="flex gap-2">
          <Tag
            v-for="tag in activeTags"
            :key="tag.id"
            :value="tag.label"
            removable
            @remove="removeTag(tag)"
          />
        </div>
      </div>
    </template>
  </OrgSelector>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { OrgSelector } from '@/components'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Tag from 'primevue/tag'

const searchKeyword = ref('')
const filterDepartment = ref(null)
const activeTags = ref([])

const departmentOptions = ref([
  { id: 'dept1', name: '技术部' },
  { id: 'dept2', name: '产品部' },
  { id: 'dept3', name: '设计部' }
])

const filteredOrgData = computed(() => {
  // 根据搜索关键词和部门筛选组织数据
  let filtered = { ...orgData.value }
  
  if (searchKeyword.value) {
    // 实现搜索逻辑
    filtered = filterByKeyword(filtered, searchKeyword.value)
  }
  
  if (filterDepartment.value) {
    // 实现部门筛选逻辑
    filtered = filterByDepartment(filtered, filterDepartment.value)
  }
  
  return filtered
})

const removeTag = (tag) => {
  activeTags.value = activeTags.value.filter(t => t.id !== tag.id)
}

const handleSelectionChange = (selectedItems) => {
  console.log('筛选后的选择:', selectedItems)
}
</script>
```

## Attributes (Props)

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| data | 组织架构数据 | OrgData | — | { children: [] } |
| multiple | 是否支持多选 | boolean | — | true |
| onlySelectPerson | 是否只能选择人员 | boolean | — | false |
| mode | 显示模式 | string | panel / modal | panel |
| visible | 弹窗是否可见（modal模式） | boolean | — | false |
| title | 弹窗标题（modal模式） | string | — | '选择人员' |

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| change | 选择项变化时触发 | (selectedItems: (Staff \| Department)[]) |
| update:visible | 弹窗显示状态变化时触发 | (visible: boolean) |
| confirm | 确认选择时触发（modal模式） | (selectedItems: (Staff \| Department)[]) |
| cancel | 取消选择时触发（modal模式） | — |

## Slots

| 插槽名 | 说明 |
|--------|------|
| header | 自定义头部内容 |
| search | 自定义搜索区域 |
| empty | 自定义空状态内容 |
| loading | 自定义加载状态 |

## Types

### Staff 人员接口

```typescript
interface Staff {
  idStaff: string          // 人员ID
  staffName: string        // 人员姓名
  position?: string        // 职位
  isChecked: boolean       // 是否选中
  type: 'staff'           // 类型标识
  parent?: string         // 父级部门ID
}
```

### Department 部门接口

```typescript
interface Department {
  id: string              // 部门ID
  name: string            // 部门名称
  children?: Department[] // 子部门
  staffs?: Staff[]        // 部门人员
  isChecked: boolean      // 是否选中
  type: 'department'      // 类型标识
  parent?: string         // 父级部门ID
  level: number           // 层级深度
}
```

### OrgData 组织数据接口

```typescript
interface OrgData {
  children: Department[]  // 顶级部门列表
  staffs?: Staff[]       // 顶级人员列表（可选）
}
```

## 方法

### 组件实例方法

| 方法名 | 说明 | 参数 | 返回值 |
|--------|------|------|--------|
| getSelectedItems | 获取当前选中项 | — | (Staff \| Department)[] |
| clearSelection | 清空选择 | — | void |
| selectAll | 全选当前层级 | — | void |
| expandAll | 展开所有部门 | — | void |
| collapseAll | 收起所有部门 | — | void |

### 使用组件方法

```vue
<template>
  <div>
    <div class="mb-4 space-x-2">
      <Button label="获取选中项" @click="getSelected" />
      <Button label="清空选择" @click="clearAll" />
      <Button label="全选" @click="selectAll" />
    </div>
    
    <OrgSelector
      ref="orgSelectorRef"
      :data="orgData"
      @change="handleChange"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { OrgSelector } from '@/components'

const orgSelectorRef = ref()

const getSelected = () => {
  const selected = orgSelectorRef.value?.getSelectedItems()
  console.log('当前选中:', selected)
}

const clearAll = () => {
  orgSelectorRef.value?.clearSelection()
}

const selectAll = () => {
  orgSelectorRef.value?.selectAll()
}
</script>
```

## 最佳实践

### 1. 数据结构设计

```typescript
// 推荐的数据结构
const orgData = {
  children: [
    {
      id: 'dept-001',
      name: '技术中心',
      level: 0,
      staffs: [
        {
          idStaff: 'staff-001',
          staffName: '张三',
          position: '技术总监',
          avatar: '/avatars/zhangsan.jpg',
          email: 'zhangsan@company.com'
        }
      ],
      children: [
        {
          id: 'dept-001-001',
          name: '前端开发组',
          level: 1,
          parent: 'dept-001',
          staffs: [
            // 前端开发人员
          ]
        }
      ]
    }
  ]
}
```

### 2. 性能优化

```vue
<script setup>
// 使用 computed 缓存处理后的数据
const processedOrgData = computed(() => {
  return processOrgData(props.data)
})

// 使用 shallowRef 优化大数据渲染
const selectedItems = shallowRef([])

// 虚拟滚动处理大量数据
const virtualScrollOptions = {
  itemSize: 40,
  buffer: 10
}
</script>
```

### 3. 搜索优化

```typescript
// 使用防抖优化搜索性能
import { useDebounce } from '@/composables/useDebounce'

const { debounce } = useDebounce(300)

const handleSearch = debounce((keyword: string) => {
  // 执行搜索逻辑
  performSearch(keyword)
})
```

### 4. 状态管理

```typescript
// 使用 Pinia 管理组织架构状态
import { defineStore } from 'pinia'

export const useOrgStore = defineStore('org', () => {
  const orgData = ref(null)
  const selectedMembers = ref([])
  
  const loadOrgData = async () => {
    // 加载组织架构数据
  }
  
  const updateSelection = (items) => {
    selectedMembers.value = items
  }
  
  return {
    orgData,
    selectedMembers,
    loadOrgData,
    updateSelection
  }
})
```

### 5. 响应式设计

```vue
<template>
  <OrgSelector
    :data="orgData"
    :class="{
      'mobile-layout': isMobile,
      'desktop-layout': !isMobile
    }"
  />
</template>

<script setup>
import { useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints({
  mobile: 768,
  desktop: 1024
})

const isMobile = breakpoints.smaller('mobile')
</script>

<style scoped>
.mobile-layout {
  /* 移动端样式 */
  .org-item {
    padding: 12px;
    font-size: 14px;
  }
}

.desktop-layout {
  /* 桌面端样式 */
  .org-item {
    padding: 8px 12px;
    font-size: 13px;
  }
}
</style>
```

### 6. 错误处理

```vue
<script setup>
const error = ref(null)
const loading = ref(false)

const loadOrgData = async () => {
  try {
    loading.value = true
    error.value = null
    
    const data = await fetchOrgData()
    orgData.value = data
  } catch (err) {
    error.value = err.message
    console.error('加载组织架构数据失败:', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div v-if="error" class="error-message">
      {{ error }}
      <Button label="重试" @click="loadOrgData" />
    </div>
    
    <OrgSelector
      v-else
      :data="orgData"
      :loading="loading"
    />
  </div>
</template>
```

这些最佳实践可以帮助你更好地使用 OrgSelector 组件，提供良好的用户体验和性能表现。