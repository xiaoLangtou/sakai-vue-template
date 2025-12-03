# 操作列 Render 函数使用示例

## 概述

操作列现在支持两种渲染方式：

1. **插槽方式**（原有方式）
2. **Render 函数方式**（新增功能）

优先级：Render 函数 > 插槽

## 使用方式

### 1. 插槽方式（原有方式）

```vue
<template>
    <ConfigurableTable
        :data="tableData"
        :columns="columns"
        :actions="{
            field: 'actions',
            header: '操作',
            slotName: 'actions'
        }"
    >
        <template #actions="{ data, index }">
            <Button label="编辑" @click="handleEdit(data)" />
            <Button label="删除" @click="handleDelete(data)" severity="danger" />
        </template>
    </ConfigurableTable>
</template>
```

### 2. Render 函数方式（新增）

```vue
<script setup>
import { h } from 'vue';
import Button from 'primevue/button';

const actions = {
    field: 'actions',
    header: '操作',
    render: (rowData, index) => {
        return h('div', { class: 'flex gap-2' }, [
            h(Button, {
                label: '编辑',
                size: 'small',
                onClick: () => handleEdit(rowData)
            }),
            h(Button, {
                label: '删除',
                size: 'small',
                severity: 'danger',
                onClick: () => handleDelete(rowData)
            })
        ]);
    }
};

const handleEdit = (data) => {
    console.log('编辑:', data);
};

const handleDelete = (data) => {
    console.log('删除:', data);
};
</script>

<template>
    <ConfigurableTable :data="tableData" :columns="columns" :actions="actions" />
</template>
```

### 3. 条件渲染示例

```javascript
const actions = {
    field: 'actions',
    header: '操作',
    render: (rowData, index) => {
        const buttons = [];

        // 根据数据状态显示不同按钮
        if (rowData.status === 'active') {
            buttons.push(
                h(Button, {
                    label: '禁用',
                    size: 'small',
                    severity: 'warning',
                    onClick: () => handleDisable(rowData)
                })
            );
        } else {
            buttons.push(
                h(Button, {
                    label: '启用',
                    size: 'small',
                    severity: 'success',
                    onClick: () => handleEnable(rowData)
                })
            );
        }

        // 权限控制
        if (hasPermission('edit')) {
            buttons.push(
                h(Button, {
                    label: '编辑',
                    size: 'small',
                    onClick: () => handleEdit(rowData)
                })
            );
        }

        if (hasPermission('delete')) {
            buttons.push(
                h(Button, {
                    label: '删除',
                    size: 'small',
                    severity: 'danger',
                    onClick: () => handleDelete(rowData)
                })
            );
        }

        return h('div', { class: 'flex gap-2' }, buttons);
    }
};
```

### 4. 复杂组件渲染

```javascript
import Dropdown from 'primevue/dropdown';
import ConfirmPopup from 'primevue/confirmpopup';

const actions = {
    field: 'actions',
    header: '操作',
    render: (rowData, index) => {
        const menuItems = [{ label: '查看详情', command: () => handleView(rowData) }, { label: '编辑', command: () => handleEdit(rowData) }, { separator: true }, { label: '删除', command: () => handleDelete(rowData), class: 'text-red-500' }];

        return h('div', { class: 'flex items-center gap-2' }, [
            h(Button, {
                icon: 'pi pi-eye',
                size: 'small',
                text: true,
                onClick: () => handleView(rowData)
            }),
            h(SplitButton, {
                label: '操作',
                size: 'small',
                model: menuItems,
                onClick: () => handleEdit(rowData)
            })
        ]);
    }
};
```

## 优势对比

| 特性     | 插槽方式      | Render 函数方式    |
| -------- | ------------- | ------------------ |
| 模板语法 | ✅ 支持       | ❌ 不支持          |
| 条件渲染 | ⚠️ 需要 v-if  | ✅ 原生 JS 逻辑    |
| 动态组件 | ⚠️ 复杂       | ✅ 简单            |
| 类型提示 | ⚠️ 有限       | ✅ 完整            |
| 性能     | ✅ 良好       | ✅ 良好            |
| 可读性   | ✅ 直观       | ⚠️ 需要熟悉 h 函数 |
| 复用性   | ❌ 局限于模板 | ✅ 可提取为函数    |

## 最佳实践

1. **简单操作**：使用插槽方式，模板更直观
2. **复杂逻辑**：使用 render 函数，逻辑更清晰
3. **动态按钮**：使用 render 函数，条件判断更灵活
4. **可复用操作**：将 render 函数提取为独立的工具函数

```javascript
// 可复用的操作渲染函数
export const createActionButtons = (permissions = []) => {
    return (rowData, index) => {
        const buttons = [];

        if (permissions.includes('view')) {
            buttons.push(createViewButton(rowData));
        }

        if (permissions.includes('edit')) {
            buttons.push(createEditButton(rowData));
        }

        if (permissions.includes('delete')) {
            buttons.push(createDeleteButton(rowData));
        }

        return h('div', { class: 'flex gap-2' }, buttons);
    };
};

// 使用
const actions = {
    field: 'actions',
    header: '操作',
    render: createActionButtons(['view', 'edit', 'delete'])
};
```
