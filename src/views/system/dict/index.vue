<script lang="ts" setup>
import { usePrimeConfirm } from '@/composables/usePrimeConfirm';
import type { IDictType } from '@/services/types/dict';
import { watchDebounced } from '@vueuse/core';
import DictItemDialog from './component/dict-item-dialog.vue';
import DictTypeForm from './component/dict-type-form.vue';
import { useDict } from './composables/useDict';
import { useDictItems } from './composables/useDictItems';
import DictItems from '@/views/system/dict/dict-items.vue';


const { tableConfig, handleRefresh, dictTypeForm, loadMore, deleteDictType, handleFilterChange } = useDict();
const { confirmDelete } = usePrimeConfirm();

// 搜索
const searchValue = ref('');
watchDebounced(
    searchValue,
    (val) => {
        handleFilterChange({
            ...tableConfig.value.searchParams,
            keyword: val
        });
    },
    { debounce: 500 }
);

// 选中的字典类型
const selectedDictType = ref<IDictType>();
const selectedDictTypeId = computed(() => selectedDictType.value?.id as string | number | undefined);

// 字典项管理
const {
    handleRefresh: refreshDictItems
} = useDictItems(selectedDictTypeId);

// 字典项对话框
const dictItemDialogVisible = ref(false);
const editingDictItem = ref();

/**
 * 删除字典项
 */
const handleDeleteDictItem = (item: any) => {
    confirmDelete({
        message: `确定要删除字典项 "${ item.dictLabel }" 吗？`,
        header: '确认删除',
        accept: () => deleteDictItem(item)
    });
};

/**
 * 选择字典类型
 */
const selectDictType = (dictType: IDictType) => {
    selectedDictType.value = dictType;
};

/**
 * 打开新增字典类型表单
 */
const openNewDictType = () => {
    dictTypeForm.value?.openDrawer();
};

/**
 * 编辑字典类型
 */
const editDictType = (dictType: IDictType) => {
    dictTypeForm.value?.openDrawer(dictType);
};

/**
 * 删除字典类型
 */
const handleDeleteDictType = (dictType: IDictType) => {
    confirmDelete({
        message: `确定要删除字典类型 "${ dictType.dictName }(${ dictType.dictCode })" 吗？`,
        header: '确认删除',
        accept: () => deleteDictType(dictType)
    });
};

/**
 * 处理滚动加载更多
 */
const handleScroll = (e: Event) => {
    const target = e.target as HTMLElement;
    console.log(target.scrollTop, target.clientHeight, target.scrollHeight);
    // 距离底部 10px 时加载更多
    if ( target.scrollTop + target.clientHeight >= target.scrollHeight - 10 ) {
        console.log('加载更多');
        loadMore();
    }
};

/**
 * 打开字典项编辑对话框
 */
const openDictItemDialog = (item?: any) => {
    editingDictItem.value = item;
    dictItemDialogVisible.value = true;
};

/**
 * 保存字典项
 */
const handleDictItemSave = () => {
    dictItemDialogVisible.value = false;
    refreshDictItems();
};

// 初始化时选择第一个字典类型
watch(
    () => tableConfig.value.data,
    (data) => {
        if ( data && data.length > 0 && !selectedDictType.value ) {
            selectedDictType.value = data[0];
        }
    },
    { immediate: true }
);

</script>

<template>
    <div class="h-full flex overflow-hidden  rounded-md gap-3">
        <!-- 左侧分栏 -->
        <div class="w-80 flex-shrink-0 bg-white dark:bg-gray-800 flex flex-col rounded-xl shadow-sm">
            <div class="px-6 py-4 relative z-10 bg-white dark:bg-gray-800 rounded-t-xl"
                 style="box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.1);">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-3">
                        <div
                            class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                            <i class="pi pi-list text-primary-600 dark:text-primary-400"></i>
                        </div>
                        <h3 class="text-lg font-bold text-gray-800 dark:text-white m-0">字典类型</h3>
                    </div>
                    <Badge :value="tableConfig.totalRecords || 0" severity="primary" />
                </div>
                <div class="flex gap-2">
                    <IconField class="w-full">
                        <InputIcon class="pi pi-search" />
                        <InputText v-model="searchValue"  class="w-full" placeholder="搜索字典名称/编码"
                                   size="small" />
                    </IconField>
                    <Button v-tooltip="'新增字典'" icon="pi pi-plus" severity="primary" size="small"
                            @click="openNewDictType" />
                </div>
            </div>
            <div class="flex-1 overflow-y-auto px-3 py-3" @scroll="handleScroll">
                <div v-if="tableConfig.loading && (!tableConfig.data || tableConfig.data.length === 0)"
                     class="flex justify-center items-center py-12">
                    <ProgressSpinner stroke-width="4" style="width: 30px; height: 30px" />
                </div>
                <div v-else-if="!tableConfig.data || tableConfig.data.length === 0"
                     class="flex flex-col items-center justify-center py-12 text-gray-400">
                    <i class="pi pi-inbox text-2xl mb-2"></i>
                    <p class="text-xs">暂无数据</p>
                </div>
                <div v-else class="space-y-1.5">
                    <div v-for="dict in tableConfig.data" :key="dict.id" :class="[
                        'group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200',
                        selectedDictType?.id === dict.id
                            ? 'bg-gradient-to-r from-primary-50 to-primary-50/50 dark:from-primary-900/30 dark:to-primary-900/10 text-primary-700 dark:text-primary-400 shadow-md'
                            : 'bg-gray-50/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm'
                    ]" @click="selectDictType(dict)">

                        <!-- 图标容器 -->
                        <div :class="[
                            'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-base transition-all duration-200',
                            selectedDictType?.id === dict.id
                                ? dict.systemFlag === 'SYSTEM'
                                    ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 shadow-sm'
                                    : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm'
                                : dict.systemFlag === 'SYSTEM'
                                    ? 'bg-orange-50 text-orange-500 dark:bg-orange-900/20 dark:text-orange-400'
                                    : 'bg-blue-50 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400'
                        ]">
                            <i :class="dict.systemFlag === 'SYSTEM' ? 'pi pi-shield' : 'pi pi-bookmark'"></i>
                        </div>

                        <!-- 内容区域 -->
                        <div class="flex-1 min-w-0 flex flex-col gap-1.5">
                            <div class="flex items-center justify-between gap-2">
                                <span class="text-sm font-semibold truncate">{{ dict.dictName }}</span>
                                <!-- 悬停操作区 -->
                                <div
                                    class="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-0.5">
                                    <Button v-tooltip.top="'编辑'" class="!w-7 !h-7 !p-0 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20" icon="pi pi-pen-to-square" rounded
                                            text
                                            @click.stop="editDictType(dict)" />
                                    <Button v-if="dict.systemFlag !== 'SYSTEM'" v-tooltip.top="'删除'"
                                            class="!w-7 !h-7 !p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            icon="pi pi-trash" rounded
                                            text
                                            @click.stop="handleDeleteDictType(dict)" />
                                </div>
                            </div>

                            <div class="flex items-center justify-between gap-2">
                                <code :class="[
                                    'text-xs font-mono truncate transition-colors',
                                    selectedDictType?.id === dict.id ? 'text-primary-600/80 dark:text-primary-400/80' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                                ]">
                                    {{ dict.dictCode }}
                                </code>
                                <span :class="[
                                    'text-xs px-2 py-0.5 rounded-full transition-all duration-200 font-medium min-w-[24px] text-center',
                                    selectedDictType?.id === dict.id
                                        ? 'bg-primary-200 dark:bg-primary-800 text-primary-700 dark:text-primary-300'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                                ]">
                                    {{ dict.dataCount || 0 }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <!-- 加载更多指示器 -->
                    <div v-if="tableConfig.loading" class="flex justify-center py-2">
                        <ProgressSpinner stroke-width="4" style="width: 20px; height: 20px" />
                    </div>
                </div>
            </div>
        </div>

        <!-- 右侧分栏 -->
        <dict-items
            :selected-dict-type="selectedDictType"
            @delete-item="handleDeleteDictItem"
            @edit-item="openDictItemDialog"
        />
    </div>

    <!-- 字典类型表单 -->
    <DictTypeForm ref="dictTypeForm" @success="handleRefresh" />

    <!-- 字典项编辑对话框 -->
    <DictItemDialog v-model:visible="dictItemDialogVisible" :dict-type-id="selectedDictTypeId"
                    :edit-item="editingDictItem" :existing-items="[]" @save="handleDictItemSave" />
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

// 平滑过渡动画
.group {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
