<script setup lang="ts">
import { ListSearch, PageContainer } from '@/components';
import type { FilterConfig, SearchParams } from '@/types/search';

import { computed, onMounted, ref } from 'vue';
import MenuForm from './components/menu-form.vue';
import { useMenuManagement } from './composables/use-menu-management';
import { menuApi } from '@/services/modules/menu';

// 使用菜单管理组合函数
const {
    loading,
    menuList,
    selectedMenus,
    expandedKeys,
    dialogVisible,
    dialogTitle,
    formData,
    queryParams,
    fetchMenuList,
    searchMenus,
    openCreateDialog,
    openEditDialog,
    saveMenu,
    deleteMenu,
    batchDeleteMenus,
    exportMenus,
    refreshMenus,
    getMenuTreeOptions,
    resetForm,
    toast
} = useMenuManagement();

// 搜索参数
const searchParams = ref<SearchParams>({
    keyword: '',
    filters: {}
});

// 搜索配置
const filterConfigs: FilterConfig[] = [
    {
        key: 'name',
        label: '菜单名称',
        type: 'input',
        placeholder: '请输入菜单名称'
    },
    {
        key: 'type',
        label: '菜单类型',
        type: 'select',
        options: [
            { label: '全部', value: '' },
            { label: '目录', value: 'directory' },
            { label: '菜单', value: 'menu' },
            { label: '按钮', value: 'button' }
        ]
    },
    {
        key: 'status',
        label: '状态',
        type: 'select',
        options: [
            { label: '全部', value: '' },
            { label: '启用', value: 1 },
            { label: '禁用', value: 0 }
        ]
    },
    {
        key: 'visible',
        label: '是否显示',
        type: 'select',
        options: [
            { label: '全部', value: '' },
            { label: '显示', value: true },
            { label: '隐藏', value: false }
        ]
    }
];

// TreeTable 需要将数据转换为树形结构
const treeData = computed(() => {
    const convertToTreeNodes = (items: any[]): any[] => {
        return items.map((item) => ({
            key: item.id,
            data: item,
            children: item.children ? convertToTreeNodes(item.children) : undefined
        }));
    };
    return convertToTreeNodes(menuList.value);
});

// 获取菜单类型标签配置
const getTypeConfig = (type: string) => {
    const typeMap = {
        directory: { label: '目录', severity: 'info' },
        menu: { label: '菜单', severity: 'success' },
        button: { label: '按钮', severity: 'warning' }
    };
    return typeMap[type] || { label: type, severity: 'secondary' };
};

// 父级菜单选项
const parentMenuOptions = computed(() => {
    return getMenuTreeOptions(formData.id);
});

/**
 * 处理搜索
 */
const handleSearch = (params: SearchParams) => {
    searchParams.value = params;
    Object.assign(queryParams, {
        ...queryParams,
        ...params.filters
    });
    fetchMenuList();
};

/**
 * 处理新增菜单
 */
const handleCreate = () => {
    openCreateDialog();
};

/**
 * 处理添加子菜单
 */
const handleAddChild = (parentId: string) => {
    openCreateDialog(parentId);
};

/**
 * 处理编辑菜单
 */
const handleEdit = (menuId: string) => {
    const findMenu = (menus: any[], id: string): any => {
        for (const menu of menus) {
            if (menu.id === id) return menu;
            if (menu.children) {
                const found = findMenu(menu.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const menu = findMenu(menuList.value, menuId);
    if (menu) {
        openEditDialog(menu);
    }
};

/**
 * 处理删除菜单
 */
const handleDelete = (menuId: string) => {
    const findMenu = (menus: any[], id: string): any => {
        for (const menu of menus) {
            if (menu.id === id) return menu;
            if (menu.children) {
                const found = findMenu(menu.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const menu = findMenu(menuList.value, menuId);
    if (menu) {
        deleteMenu(menu);
    }
};

/**
 * 处理表单提交
 */
const handleFormSubmit = (data: any) => {
    Object.assign(formData, data);
    saveMenu();
};

/**
 * 处理表单关闭
 */
const handleFormClose = () => {
    resetForm();
};

/**
 * 处理批量添加按钮
 */
const handleBatchAddButtons = async (buttons: any[]) => {
    try {
        loading.value = true;

        // 确保有选中的菜单或当前编辑的菜单
        const menuId = formData.id || formData.parentId;
        if (!menuId) {
            toast.add({
                severity: 'warn',
                summary: '警告',
                detail: '请先选择要添加按钮的菜单',
                life: 3000
            });
            return;
        }

        // 调用批量创建按钮API
        await menuApi.batchCreateButtons(menuId, buttons);

        // 刷新菜单列表
        await fetchMenuList();

        // 显示成功消息
        toast.add({
            severity: 'success',
            summary: '成功',
            detail: `成功添加 ${buttons.length} 个按钮`,
            life: 3000
        });
    } catch (error) {
        console.error('批量添加按钮失败:', error);
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: '批量添加按钮失败，请检查网络连接或稍后重试',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

// 组件挂载时获取数据
onMounted(() => {
    fetchMenuList();
});
</script>

<template>
    <PageContainer>
        <template #header>
            <div class="flex justify-between items-center">
                <h5 class="m-0">菜单管理</h5>
                <div>
                    <Button label="新增" icon="pi pi-plus" class="mr-2" @click="handleCreate" />
                    <Button label="批量删除" icon="pi pi-trash" severity="danger" :disabled="selectedMenus.length === 0" @click="batchDeleteMenus" />
                </div>
            </div>
        </template>

        <!-- 搜索区域 -->
        <ListSearch v-model="searchParams" :filter-configs="filterConfigs" placeholder="请输入搜索内容" :loading="loading" @search="handleSearch">
            <template #actions>
                <Button icon="pi pi-refresh" class="mr-2" severity="secondary" outlined :disabled="loading" @click="refreshMenus" />
            </template>
        </ListSearch>

        <!-- 分割线 -->
        <Divider type="dashed" />
        <!-- TreeTable -->
        <TreeTable v-model:selection="selectedMenus" :value="treeData" size="normal" :resizable-columns="true" show-gridlines :loading="loading" data-key="key" :scrollable="true" scroll-height="600px">
            <!-- 菜单名称列 -->
            <Column field="name" header="菜单名称" :expander="true" style="width: 250px">
                <template #body="{ node }">
                    <div class="flex items-center">
                        <i v-if="node.data.icon" :class="`${node.data.icon} mr-2`"></i>
                        <span>{{ node.data.name }}</span>
                    </div>
                </template>
            </Column>

            <!-- 类型列 -->
            <Column field="type" header="类型" style="width: 120px">
                <template #body="{ node }">
                    <Tag :value="getTypeConfig(node.data.type).label" :severity="getTypeConfig(node.data.type).severity" />
                </template>
            </Column>

            <!-- 路由路径列 -->
            <Column field="path" header="路由路径" style="width: 200px">
                <template #body="{ node }">
                    <a v-if="node.data.isExternal && node.data.externalUrl" :href="node.data.externalUrl" target="_blank" class="text-blue-500 hover:underline">
                        {{ node.data.externalUrl }}
                    </a>
                    <span v-else>{{ node.data.path || '-' }}</span>
                </template>
            </Column>

            <!-- 权限标识列 -->
            <Column field="permission" header="权限标识" style="width: 180px">
                <template #body="{ node }">
                    <span>{{ node.data.permission || '-' }}</span>
                </template>
            </Column>

            <!-- 排序列 -->
            <Column field="sort" header="排序" style="width: 80px; text-align: center">
                <template #body="{ node }">
                    <span>{{ node.data.sort }}</span>
                </template>
            </Column>

            <!-- 状态列 -->
            <Column field="status" header="状态" style="width: 100px; text-align: center">
                <template #body="{ node }">
                    <Tag :value="node.data.status === 1 ? '启用' : '禁用'" :severity="node.data.status === 1 ? 'success' : 'danger'" />
                </template>
            </Column>

            <!-- 显示列 -->
            <Column field="visible" header="显示" style="width: 80px; text-align: center">
                <template #body="{ node }">
                    <Tag :value="node.data.visible ? '是' : '否'" :severity="node.data.visible ? 'success' : 'secondary'" />
                </template>
            </Column>

            <!-- 创建时间列 -->
            <Column field="createTime" header="创建时间" style="width: 160px">
                <template #body="{ node }">
                    <span>{{ node.data.createTime }}</span>
                </template>
            </Column>

            <!-- 操作列 -->
            <Column header="操作" style="width: 200px">
                <template #body="{ node }">
                    <div class="flex gap-2">
                        <Button v-tooltip="'添加子菜单'" icon="pi pi-plus" size="small" class="p-button-text p-button-success" @click="handleAddChild(node.data.id)" />
                        <Button v-tooltip="'编辑'" icon="pi pi-pencil" size="small" class="p-button-text" @click="handleEdit(node.data.id)" />
                        <Button v-tooltip="'删除'" icon="pi pi-trash" size="small" class="p-button-text p-button-danger" @click="handleDelete(node.data.id)" />
                    </div>
                </template>
            </Column>

            <!-- 空状态 -->
            <template #empty>
                <div class="text-center py-12">
                    <i class="pi pi-list text-4xl text-gray-400 mb-4"></i>
                    <p class="text-gray-500 text-lg mb-2">暂无菜单数据</p>
                    <p class="text-gray-400 text-sm">点击"新增菜单"按钮创建第一个菜单</p>
                </div>
            </template>
        </TreeTable>

        <!-- 菜单表单弹窗 -->
        <MenuForm
            v-model:visible="dialogVisible"
            v-model:form-data="formData"
            :title="dialogTitle"
            :parent-menu-options="parentMenuOptions"
            :loading="loading"
            @submit="handleFormSubmit"
            @close="handleFormClose"
            @batch-add-buttons="handleBatchAddButtons"
        />

        <!-- 确认对话框 -->
        <ConfirmDialog />

        <!-- 消息提示 -->
        <Toast />
    </PageContainer>
</template>
