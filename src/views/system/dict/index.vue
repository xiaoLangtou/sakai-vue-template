<script setup lang="ts">
import { ConfigurableTable, PageContainer } from '@/components';
import type { TableColumns } from '@/composables/useColumns';
import type { IDictType } from '@/services/types/dict';
import { useClipboard } from '@vueuse/core';
import TieredMenu from 'primevue/tieredmenu';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import DictTypeForm from './component/dict-type-form.vue';
import { useDict } from './composables/useDict';


// 页面标题
const title = ref('字典管理');

// 服务实例
const router = useRouter();
const toast = useToast();
const confirm = useConfirm();
const { copy, isSupported } = useClipboard();
const { tableColumns, filterConfigs, pageInfo, searchParams, tableData, isLoading, handlePageChange, handleFilterChange, handleRefresh } = useDict();
// 对话框控制
const dictTypeDialog = ref(false);
const dictTypeForm = useTemplateRef("dictTypeForm")

// TieredMenu 相关
const moreMenu = ref();
const moreMenuItems = ref<any[]>([])




// 确认删除字典类型
const confirmDeleteType = (type: IDictType) => {
    confirm.require({
        message: `确定要删除字典类型 "${type.name}" 吗？`,
        header: '确认删除',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        accept: () => deleteDictType(type),
        reject: () => { }
    });
};

// 删除字典类型
const deleteDictType = (type: IDictType) => {
    // 模拟删除字典类型
    dictTypes.value = dictTypes.value.filter((t) => t.id !== type.id);
    toast.add({ severity: 'success', summary: '成功', detail: '字典类型已删除', life: 3000 });
};


// 查看字典项
const viewDictItems = (type: IDictType) => {
    router.push(`/system/dict-items/${type.id}`);
};





// 导入字典数据
const importDict = () => {
    toast.add({ severity: 'info', summary: '提示', detail: '字典数据导入功能已触发', life: 3000 });
};

// 表格列配置


/**
 * 处理列配置变化
 */
function handleColumnsChange(columns: TableColumns<IDictType>): void {
    tableColumns.value = columns;
}

/**
 * 处理列变化事件
 */
function handleColumnChange(column: any, type: 'visibility' | 'frozen' | 'order'): void {
    console.log('Column changed:', column, type);
}



/**
 * 获取更多操作菜单项
 * @param data - 字典类型数据
 */
const getMoreActions = (data: IDictType) => {
    return [
        {
            label: data.status ? '停用' : '启用',
            icon: data.status ? 'pi pi-times' : 'pi pi-check',
            // command: () => toggleTypeStatus(data)
        },
        {
            label: '删除',
            icon: 'pi pi-trash',
            command: () => confirmDeleteType(data)
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

/**
 * 复制字典类型
 * @param type - 字典类型值
 */
const copyDictType = async (type: string) => {
    if (!isSupported) {
        toast.add({
            severity: 'warn',
            summary: '提示',
            detail: '当前浏览器不支持复制功能',
            life: 3000
        });
        return;
    }

    try {
        await copy(type);
        toast.add({
            severity: 'success',
            summary: '成功',
            detail: `已复制字典类型: ${type}`,
            life: 3000
        });
    } catch (err) {
        console.error('复制失败:', err);
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: '复制失败，请重试',
            life: 3000
        });
    }
};



const openNewDictType = () => {
    dictTypeForm.value?.openDrawer()
}


const formatterDictType = (value: string) => {
    return {
        "SYSTEM": "系统字典",
        "BUSINESS": "业务字典"
    }[value]
}
</script>

<template>
    <PageContainer>
        <template #header>
            <div class="flex justify-between items-center">
                <h5 class="m-0">{{ title }}</h5>
                <div>
                    <Button label="新增" icon="pi pi-plus" class="mr-2" @click="openNewDictType" />
                    <Button label="导入" icon="pi pi-upload" @click="importDict" />
                </div>
            </div>
        </template>
        <ConfigurableTable :value="tableData" :rows="pageInfo.size" :total-records="pageInfo.total"
            :columns="tableColumns" data-key="id" :loading="isLoading" :current="pageInfo.current"
            :search-params="searchParams" :filter-configs="filterConfigs" @update:columns="handleColumnsChange"
            @column-change="handleColumnChange" @filter-change="handleFilterChange" @refresh="handleRefresh"
            @page="handlePageChange">
            <!-- 字典名称列 -->
            <template #column-dictName="{ data }">
                <Button :label="data.dictName" variant="link" @click="viewDictItems(data)" />
            </template>
            <!-- 字典编码 -->
            <template #column-dictCode="{ data }">
                <div class="flex items-center gap-1">
                    <Tag severity="secondary" :value="data.dictCode"></Tag>
                    <i class="pi pi-clone cursor-pointer text-gray-500 hover:text-blue-500 transition-colors"
                        title="复制字典类型" @click="copyDictType(data.dictCode)"></i>
                </div>
            </template>
            <!-- 字典类型 -->
            <template #column-systemFlag="{ data }">
                <Tag severity="secondary">{{ formatterDictType(data.systemFlag) }}</Tag>
            </template>
            <!-- 状态列 -->
            <template #column-status="{ data }">
                <span :class="['status-badge', data.status ? 'status-active' : 'status-inactive']">
                    {{ data.status ? '启用' : '停用' }}
                </span>
            </template>

            <!-- 操作列 -->
            <template #column-actions="{ data }">
                <div class="flex items-center justify-center">
                    <Button icon="pi pi-pen-to-square" label="编辑" variant="text" @click="() => { }" />
                    <Button icon="pi pi-list" label="字典项" variant="text" @click="viewDictItems(data)" />
                    <Button icon="pi pi-ellipsis-v" label="更多" variant="text" size="small"
                        @click="(event) => openRowMenu(event, data.id)" />
                    <!-- 每行一个 Menu -->
                    <Menu :ref="(el) => setMenuRef(el, data.id)" :model="getMoreActions(data)" popup />
                </div>
            </template>
        </ConfigurableTable>
        <!-- 更多操作菜单 -->
        <TieredMenu ref="moreMenu" :model="moreMenuItems" popup />

        <!-- 字典类型对话框 -->
        <DictTypeForm ref="dictTypeForm" @success="handleRefresh" />
    </PageContainer>
</template>

<style lang="scss" scoped>
/* 表头样式 */
:deep(.p-datatable-header-cell) {
    --p-datatable-header-cell-padding: 1rem;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
    @apply bg-surface-100 dark:bg-surface-900 text-surface-700 dark:text-surface-300;
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
