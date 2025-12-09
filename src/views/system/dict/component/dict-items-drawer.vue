<script lang="ts" setup>
import { CustomDrawer, CustomTable, PageHeader } from '@/components';
import type { IDictData, IDictType } from '@/services/types/dict';
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

const { tableConfig, tableData, handlePageChange, handleFilterChange, handleRefresh } = useDictItems(dictTypeId);
// 服务实例
const toast = useToast();
const selectedDictItems = ref<IDictData[]>([]);
// 现有字典项（用于查重）
const dictItems = computed(() => tableData.value || []);

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

/**
 * 处理字典项保存
 */
const handleDictItemSave = () => {
    handleRefresh();
};

// 确认批量删除字典项
const confirmDeleteSelectedItems = () => {
    // TODO: 实现批量删除逻辑，这需要后端接口支持
    toast.add({ severity: 'info', summary: '提示', detail: '批量删除功能待实现', life: 3000 });
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
 */
const handleBatchSave = () => {
    handleRefresh();
};

// 页面标题
const drawerTitle = computed(() => {
    return props.dictType ? `${props.dictType.dictName} - 字典项管理` : '字典项管理';
});
</script>

<template>
    <CustomDrawer v-model:visible="drawerVisible" :dismissable="true" :header="drawerTitle" :show-default-footer="false"
        :show-close-icon="false" custom-width="85%" position="right" width-type="extra-large">
        <template #header>
            <PageHeader :description="dictDetail?.dictDesc" :title="drawerTitle" @back="goBack">
                <!-- 操作按钮 -->
                <template #actions>
                    <div class="flex gap-2">
                        <Button icon="pi pi-plus" label="新增" raised @click="openNewDictItem" />
                        <Button icon="pi pi-plus-circle" label="批量添加" severity="secondary" outlined
                            @click="openBatchAddDialog" />
                        <span class="w-px bg-gray-300 dark:bg-gray-600 mx-1 h-8 self-center"></span>
                        <Button v-tooltip.bottom="'批量删除'"
                            :disabled="!selectedDictItems || selectedDictItems.length === 0" icon="pi pi-trash"
                            severity="danger" outlined @click="confirmDeleteSelectedItems" />
                        <Button v-tooltip.bottom="'导出'" icon="pi pi-download" severity="secondary" text
                            @click="exportDict" />
                        <Button v-tooltip.bottom="'导入'" icon="pi pi-upload" severity="secondary" text
                            @click="importDict" />
                    </div>
                </template>
            </PageHeader>
        </template>

        <div class="h-full flex flex-col gap-4 pt-3">
            <CustomTable v-model:selection="selectedDictItems" v-bind="{ ...tableConfig }" selection-mode="multiple"
                @page="handlePageChange" @refresh="handleRefresh" @update:columns="handleColumnsChange"
                @filter-change="handleFilterChange">
                <!-- 字典标签列 -->
                <template #column-dictLabel="slotProps">
                    <span class="font-medium">{{ slotProps.data.dictLabel }}</span>
                </template>
                <!-- 字典值列 -->
                <template #column-dictValue="slotProps">
                    <Tag severity="secondary" :value="slotProps.data.dictValue" class="font-mono"></Tag>
                </template>
                <!-- 状态列 -->
                <template #column-status="slotProps">
                    <Tag :value="slotProps.data.status ? '启用' : '停用'"
                        :severity="slotProps.data.status ? 'success' : 'danger'" rounded class="!text-xs !px-2"></Tag>
                </template>
                <!-- 默认值列 -->
                <template #column-isDefault="slotProps">
                    <Tag v-if="slotProps.data.isDefault" value="默认" severity="info" rounded class="!text-xs"></Tag>
                    <span v-else class="text-gray-400 text-xs">-</span>
                </template>
                <!-- 操作列 -->
                <template #column-actions="slotProps">
                    <div class="flex items-center justify-center gap-1">
                        <Button v-tooltip.bottom="'编辑'" icon="pi pi-pencil" severity="primary" text rounded size="small"
                            @click="editDictItem(slotProps.data)" />
                        <Button v-tooltip.bottom="'更多'" icon="pi pi-ellipsis-v" severity="secondary" text rounded
                            size="small" @click="(event) => openRowMenu(event, slotProps.data.id)" />
                        <Menu :ref="(el) => setMenuRef(el, slotProps.data.id)"
                            :model="getItemMoreActions(slotProps.data)" popup />
                    </div>
                </template>
            </CustomTable>
            <!-- 字典项对话框 -->
            <DictItemDialog v-model:visible="dictItemDialog" :dict-type-id="dictTypeId" :edit-item="currentEditItem"
                :existing-items="dictItems" @save="handleDictItemSave" />

            <!-- 批量添加字典项对话框 -->
            <BatchAddDialog v-model:visible="batchAddDialog" :dict-type-id="dictTypeId" :existing-items="dictItems"
                @save="handleBatchSave" />
        </div>
    </CustomDrawer>
</template>

<style scoped></style>
