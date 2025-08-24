<script setup lang="ts">
import { ConfigurableTable, PageContainer, PageHeader } from '@/components';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BatchAddDialog from './component/batch-add-dialog.vue';
import DictItemDialog from './component/dict-item-dialog.vue';
import { useDictItems } from './composables/useDictItems';
import type { IDictData, IDictType } from '@/services/types/dict';

// 路由实例
const route = useRoute();
const router = useRouter();

// 获取字典类型ID
const dictTypeId = computed(() => Number(route.params.id));
const { tableColumns, filterConfigs, searchParams, tableData,dictDetail, isLoading, handlePageChange, handleColumnsChange, handleFilterChange, handleRefresh } = useDictItems(+dictTypeId.value)

    ;

// 页面标题
const title = ref('字典项管理');

// 服务实例
const confirm = useConfirm();
const toast = useToast();



// 表格数据
const dictType = ref<IDictType | null>(null);
const selectedDictItems = ref<IDictData[]>([]);

// 对话框控制
const dictItemDialog = ref(false);

const batchAddDialog = ref(false);

// 当前编辑的字典项
const currentEditItem = ref<Partial<IDictData> | null>(null);


// 返回字典管理页面
const goBack = () => {
    router.push('/system/dict/index');
};

/**
 * 打开新增字典项对话框
 */
const openNewDictItem = () => {
    currentEditItem.value = null;
    dictItemDialog.value = true;
};

/**
 * 打开编辑字典项对话框
 * @param item - 要编辑的字典项
 */
const editDictItem = (item: IDictData) => {
    currentEditItem.value = { ...item };
    dictItemDialog.value = true;
};

/**
 * 处理字典项保存
 * @param item - 保存的字典项
 * @param action - 操作类型（create 或 update）
 */
const handleDictItemSave = (item: IDictData, action: 'create' | 'update') => {
    if (action === 'update') {
        // 更新现有字典项
        const index = dictItems.value.findIndex((i) => i.id === item.id);
        if (index !== -1) {
            // 如果设置为默认值，需要将同类型的其他项设为非默认
            if (item.isDefault) {
                dictItems.value.forEach((existingItem) => {
                    if (existingItem.dictTypeId === item.dictTypeId && existingItem.id !== item.id) {
                        existingItem.isDefault = false;
                    }
                });
            }
            dictItems.value[index] = item;
        }
    } else {
        // 创建新字典项
        // 如果设置为默认值，需要将同类型的其他项设为非默认
        if (item.isDefault) {
            dictItems.value.forEach((existingItem) => {
                if (existingItem.dictTypeId === item.dictTypeId) {
                    existingItem.isDefault = false;
                }
            });
        }
        dictItems.value.push(item);
    }
};

// 确认删除字典项
const confirmDeleteItem = (item: IDictData) => {
    selectedDictItems.value = [item];
    confirm.require({
        message: `确定要删除字典项 "${item.label}" 吗？`,
        header: '确认删除',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        accept: () => deleteDictItems(),
        reject: () => {
            selectedDictItems.value = [];
        }
    });
};

// 确认批量删除字典项
const confirmDeleteSelectedItems = () => {
    if (!selectedDictItems.value || selectedDictItems.value.length === 0) {
        toast.add({ severity: 'warn', summary: '警告', detail: '请先选择要删除的字典项', life: 3000 });
        return;
    }

    confirm.require({
        message: `确定要删除选中的 ${selectedDictItems.value.length} 个字典项吗？`,
        header: '确认批量删除',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        accept: () => deleteDictItems(),
        reject: () => {
            selectedDictItems.value = [];
        }
    });
};

// 删除字典项
const deleteDictItems = () => {
    if (!selectedDictItems.value || selectedDictItems.value.length === 0) return;

    const deleteCount = selectedDictItems.value.length;

    // 删除选中的字典项
    const itemIds = selectedDictItems.value.map((item) => item.id);
    dictItems.value = dictItems.value.filter((item) => !itemIds.includes(item.id));

    toast.add({ severity: 'success', summary: '成功', detail: `已删除 ${deleteCount} 个字典项`, life: 3000 });
    selectedDictItems.value = [];
};

// 切换字典项状态
const toggleItemStatus = (item: IDictData) => {
    const index = dictItems.value.findIndex((i) => i.id === item.id);
    if (index !== -1) {
        dictItems.value[index].status = !dictItems.value[index].status;
        const status = dictItems.value[index].status ? '启用' : '停用';
        toast.add({ severity: 'success', summary: '成功', detail: `字典项已${status}`, life: 3000 });
    }
};

// 导出字典数据
const exportDict = () => {
    toast.add({ severity: 'info', summary: '提示', detail: '字典数据导出功能已触发', life: 3000 });
};

// 导入字典数据
const importDict = () => {
    toast.add({ severity: 'info', summary: '提示', detail: '字典数据导入功能已触发', life: 3000 });
};

/**
 * 打开批量添加对话框
 */
const openBatchAddDialog = () => {
    batchAddDialog.value = true;
};

/**
 * 处理批量添加保存
 * @param newItems - 新增的字典项
 */
const handleBatchSave = (newItems: IDictData[]) => {
    // 添加到现有数据中
    // dictItems.value.push(...newItems);
};
/**
 * 获取字典项更多操作菜单项
 * @param data - 字典项数据
 */
const getItemMoreActions = (data: IDictData) => {
    return [
        {
            label: data.status ? '停用' : '启用',
            icon: data.status ? 'pi pi-times' : 'pi pi-check',
            command: () => toggleItemStatus(data)
        },
        {
            label: '删除',
            icon: 'pi pi-trash',
            command: () => confirmDeleteItem(data)
        }
    ];
};

// 每行菜单的 ref 对象
const menuRefs = ref<Record<number, any>>({});

/**
 * 设置 Menu ref 实例
 */
const setMenuRef = (el: any, id: number) => {
    if (el) {
        menuRefs.value[id] = el;
    }
};

/**
 * 打开对应行的菜单
 */
const openRowMenu = (event: Event, id: number) => {
    menuRefs.value[id]?.toggle(event);
};


</script>

<template>
    <PageContainer>
        <template #header>
            <PageHeader :title="`${dictDetail?.dictName} - ${title}`" :description="dictDetail?.dictDesc" @back="goBack">
                <!-- 操作按钮 -->
                <template #actions>
                    <Button label="新增" icon="pi pi-plus" class="mr-2" @click="openNewDictItem" />
                    <Button label="批量添加" icon="pi pi-plus-circle" class="mr-2" @click="openBatchAddDialog" />
                    <Button
label="批量删除" icon="pi pi-trash" severity="danger" class="mr-2"
                        :disabled="!selectedDictItems || selectedDictItems.length === 0"
                        @click="confirmDeleteSelectedItems" />
                    <Button label="导出" icon="pi pi-download" class="mr-2" @click="exportDict" />
                    <Button label="导入" icon="pi pi-upload" class="mr-2" @click="importDict" />
                </template>
            </PageHeader>
        </template>
        <ConfigurableTable
v-model:selection="selectedDictItems" :value="tableData" :columns="tableColumns" data-key="id"
            :loading="isLoading" :search-params="searchParams" :filter-configs="filterConfigs"
            selection-mode="multiple" @update:columns="handleColumnsChange" @page="handlePageChange"
            @filter-change="handleFilterChange" @refresh="handleRefresh">
            <!-- 字典标签列 -->
            <template #column-label="slotProps">
                <span class="font-medium">{{ slotProps.data.label }}</span>
            </template>
            <!-- 字典值列 -->
            <template #column-value="slotProps">
                <Tag severity="secondary" :value="slotProps.data.value"></Tag>
            </template>
            <!-- 排序列 -->
            <template #column-sort="slotProps">
                <span class="text-center">{{ slotProps.data.sort }}</span>
            </template>
            <!-- 状态列 -->
            <template #column-status="slotProps">
                <span :class="['status-badge', slotProps.data.status ? 'status-active' : 'status-inactive']">
                    {{ slotProps.data.status ? '启用' : '停用' }}
                </span>
            </template>
            <!-- 默认值列 -->
            <template #column-isDefault="slotProps">
                <span :class="['default-badge', slotProps.data.isDefault ? 'default-yes' : 'default-no']">
                    {{ slotProps.data.isDefault ? '是' : '否' }}
                </span>
            </template>
            <!-- 操作列 -->
            <template #column-actions="slotProps">
                <div class="flex items-center justify-center gap-1">
                    <Button
icon="pi pi-pen-to-square" label="编辑" variant="text" size="small"
                        @click="editDictItem(slotProps.data)" />
                    <Button
icon="pi pi-ellipsis-v" label="更多" variant="text" size="small"
                        @click="(event) => openRowMenu(event, slotProps.data.id)" />
                    <!-- 每行一个 Menu -->
                    <Menu
:ref="(el) => setMenuRef(el, slotProps.data.id)" :model="getItemMoreActions(slotProps.data)"
                        popup />
                </div>
            </template>
        </ConfigurableTable>
        <!-- 字典项对话框 -->
        <DictItemDialog
v-model:visible="dictItemDialog" :dict-type-id="dictTypeId" :edit-item="currentEditItem"
            :existing-items="dictItems" @save="handleDictItemSave" />

        <!-- 批量添加字典项对话框 -->
        <BatchAddDialog
v-model:visible="batchAddDialog" :dict-type-id="dictTypeId" :existing-items="dictItems"
            @save="handleBatchSave" />
    </PageContainer>
</template>

<style lang="scss" scoped>
/* 表头样式 */
:deep(.p-datatable-header-cell) {
    --p-datatable-header-cell-padding: 1rem;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
    background-color: #f8fafc;
    color: #374151;
    font-weight: 600;
}

:deep(.p-datatable .p-datatable-thead > tr > th:hover) {
    background-color: #f1f5f9;
}

.status-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
}

.status-active {
    background-color: #e3f8e5;
    color: #22c55e;
}

.status-inactive {
    background-color: #fee4e2;
    color: #ef4444;
}

.default-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
}

.default-yes {
    background-color: #eff6ff;
    color: #3b82f6;
}

.default-no {
    background-color: #f3f4f6;
    color: #6b7280;
}
</style>
