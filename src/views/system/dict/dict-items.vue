<script setup lang="ts">
import { CustomTable } from '@/components';
import type { IDictData, IDictType } from '@/services/types/dict';
import { useDictItems } from './composables/useDictItems';
import DictItemDialog from './component/dict-item-dialog.vue';
import { computed, ref } from 'vue';

// 定义 props
const props = defineProps<{
    selectedDictType?: IDictType;
}>();

// 定义事件
const emit = defineEmits<{
    deleteItem: [item: IDictData];
    editItem: [item?: IDictData];
}>();

// 获取字典类型ID
const selectedDictTypeId = computed(() => props.selectedDictType?.id as string | number | undefined);

const {
    tableColumns: itemTableColumns,
    searchParams: itemSearchParams,
    tableData: dictItems,
    isLoading: itemsLoading,
    handlePageChange: handleItemPageChange,
    handleColumnsChange: handleItemColumnsChange,
    handleFilterChange: handleItemFilterChange,
    handleRefresh: refreshDictItems
} = useDictItems(selectedDictTypeId);

/**
 * 打开字典项编辑对话框
 */
const openDictItemDialog = (item?: IDictData) => {
    emit('editItem', item);
};

/**
 * 处理删除字典项
 */
const handleDeleteDictItem = (item: IDictData) => {
    emit('deleteItem', item);
};

/**
 * 格式化字典类型
 */
const formatterDictType = (value: string) => {
    return {
        SYSTEM: '系统字典',
        BUSINESS: '业务字典'
    }[value];
};
</script>

<template>
    <div class="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <!-- 头部 -->
        <div class="px-6 py-4 relative z-10 bg-white dark:bg-gray-800 rounded-t-xl"
            style="box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.1);">
            <div v-if="selectedDictType">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-3">
                        <div
                            class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                            <i class="pi pi-database text-primary-600 dark:text-primary-400"></i>
                        </div>
                        <h3 class="text-lg font-bold text-gray-800 dark:text-white m-0">{{ selectedDictType.dictName }}</h3>
                    </div>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <Tag :value="formatterDictType(selectedDictType.systemFlag)"
                            :severity="selectedDictType.systemFlag === 'SYSTEM' ? 'danger' : 'info'"
                            class="!text-xs" />
                        <span class="text-xs text-gray-500 dark:text-gray-400">{{ selectedDictType.dictCode }}</span>
                    </div>
                    <Button icon="pi pi-plus" label="新增字典项" size="small" @click="openDictItemDialog()" />
                </div>
            </div>
            <div v-else class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <i class="pi pi-info-circle"></i>
                <span>请选择字典类型</span>
            </div>
        </div>
        <div class="flex-1 overflow-y-auto px-6 py-4">
            <div v-if="!selectedDictType" class="flex flex-col items-center justify-center h-full">
                <div
                    class="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center mb-4">
                    <i class="pi pi-arrow-left text-4xl text-gray-400"></i>
                </div>
                <p class="text-gray-500 dark:text-gray-400 text-base font-medium">请从左侧选择一个字典类型</p>
                <p class="text-gray-400 dark:text-gray-500 text-sm mt-1">选择后即可查看和管理字典项</p>
            </div>
            <div v-else>
                <!-- 字典项表格 -->
                <CustomTable :value="dictItems" :columns="itemTableColumns" data-key="id" :loading="itemsLoading"
                    :search-params="itemSearchParams"
                    @update:columns="handleItemColumnsChange" @page="handleItemPageChange"
                    @filter-change="handleItemFilterChange" @refresh="refreshDictItems">
                    <!-- 字典标签列 -->
                    <template #column-dictLabel="slotProps">
                        <div class="flex items-center gap-2">
                            <span class="font-medium">{{ slotProps.data.dictLabel }}</span>
                            <i v-if="slotProps.data.isDefault == 1" v-tooltip.top="'默认值'"
                                class="pi pi-star-fill text-yellow-500 text-xs"></i>
                        </div>
                    </template>
                    <!-- 字典值列 -->
                    <template #column-dictValue="slotProps">
                        <Tag severity="secondary" :value="slotProps.data.dictValue" class="font-mono"></Tag>
                    </template>
                    <!-- 排序列 -->
                    <template #column-dictSort="slotProps">
                        <span class="text-center">{{ slotProps.data.dictSort }}</span>
                    </template>
                    <!-- 状态列 -->
                    <template #column-status="slotProps">
                        <Tag :value="slotProps.data.status == 1 ? '启用' : '停用'"
                            :severity="slotProps.data.status == 1 ? 'success' : 'danger'" rounded
                            class="!text-xs !px-2"></Tag>
                    </template>
                    <!-- 操作列 -->
                    <template #column-actions="slotProps">
                        <div class="flex items-center justify-center gap-1">
                            <Button v-tooltip.bottom="'编辑'" icon="pi pi-pencil" text size="small"
                                @click="openDictItemDialog(slotProps.data)" />
                            <Button v-tooltip.bottom="'删除'" icon="pi pi-trash" text size="small" severity="danger"
                                @click="handleDeleteDictItem(slotProps.data)" />
                        </div>
                    </template>
                </CustomTable>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
// 自定义滚动条样式
:deep(.overflow-y-auto),
.overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.3) transparent;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background-color: rgba(156, 163, 175, 0.3);
        border-radius: 6px;

        &:hover {
            background-color: rgba(156, 163, 175, 0.5);
        }
    }
}
</style>
