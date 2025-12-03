<script lang="ts" setup>
import { CustomTable, CustomDrawer, PageHeader } from '@/components';
import type { IDictData, IDictType } from '@/services/types/dict';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';
import { useDictItems } from '../composables/useDictItems';
import BatchAddDialog from './batch-add-dialog.vue';
import DictItemDialog from './dict-item-dialog.vue';

const props = defineProps({
    dictType: {
        type: Object as () => IDictType,
        default: () => ({})
    }
});

const drawerVisible = defineModel('drawerVisible', { type: Boolean, default: false });
const dictTypeId = computed(() => props?.dictType?.id);
console.log(dictTypeId);
const emit = defineEmits(['close']);

const { tableConfig, handlePageChange, handleFilterChange, handleRefresh } = useDictItems(dictTypeId);
// 服务实例
const confirm = useConfirm();
const toast = useToast();
const selectedDictItems = ref<IDictData[]>([]);

// 对话框控制
const dictItemDialog = ref(false);

const batchAddDialog = ref(false);

// 当前编辑的字典项
const currentEditItem = ref<Partial<IDictData> | null>(null);

const goBack = () => {
    emit('close', false);
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

// 页面标题
const drawerTitle = computed(() => {
    return props.dictType ? `${props.dictType.dictName} - 字典项管理` : '字典项管理';
});
</script>

<template>
    <CustomDrawer v-model:visible="drawerVisible" :dismissable="true" :header="drawerTitle" :show-default-footer="false" :showCloseIcon="false" custom-width="85%" position="right" width-type="extra-large">
        <template #header>
            <PageHeader :description="dictDetail?.dictDesc" :title="drawerTitle" @back="goBack">
                <!-- 操作按钮 -->
                <template #actions>
                    <Button class="mr-2" icon="pi pi-plus" label="新增" @click="openNewDictItem" />
                    <Button class="mr-2" icon="pi pi-plus-circle" label="批量添加" @click="openBatchAddDialog" />
                    <Button :disabled="!selectedDictItems || selectedDictItems.length === 0" class="mr-2" icon="pi pi-trash" label="批量删除" severity="danger" @click="confirmDeleteSelectedItems" />
                    <Button class="mr-2" icon="pi pi-download" label="导出" @click="exportDict" />
                    <Button class="mr-2" icon="pi pi-upload" label="导入" @click="importDict" />
                </template>
            </PageHeader>
        </template>

        <div class="h-full flex flex-col gap-4 pt-3">
            <CustomTable v-model:selection="selectedDictItems" v-bind="{ ...tableConfig }" selection-mode="multiple" @page="handlePageChange" @refresh="handleRefresh" @update:columns="handleColumnsChange" @filter-change="handleFilterChange">
            </CustomTable>
            <!-- 字典项对话框 -->
            <DictItemDialog v-model:visible="dictItemDialog" :dict-type-id="dictTypeId" :edit-item="currentEditItem" :existing-items="dictItems" @save="handleDictItemSave" />

            <!-- 批量添加字典项对话框 -->
            <BatchAddDialog v-model:visible="batchAddDialog" :dict-type-id="dictTypeId" :existing-items="dictItems" @save="handleBatchSave" />
        </div>
    </CustomDrawer>
</template>

<style scoped>
.dict-items-drawer {
    height: 100%;
    display: flex;
    flex-direction: column;
}
</style>
