<script lang="ts" setup>
import { CustomTable, PageContainer } from '@/components';
import type { IDictType } from '@/services/types/dict';
import { useToast } from 'primevue/usetoast';
import DictTypeForm from './component/dict-type-form.vue';
import DictItemsDrawer from './component/dict-items-drawer.vue';
import { useDict } from './composables/useDict';
import type { TableColumns } from '@/composables';
import { CircleCheck, CircleX } from 'lucide-vue-next';
import { h } from 'vue';

// 页面标题
const title = ref('字典管理');
const toast = useToast();
const { copy, isSupported } = useClipboard();
const { tableConfig, handlePageChange, handleFilterChange, handleRefresh, dictTypeForm, getMoreActions } = useDict();

// 字典项抽屉状态管理
const dictItemsDrawerVisible = ref(false);
const selectedDictType = ref<IDictType>();

/**
 * 打开字典项抽屉
 * @param dictType - 字典类型数据
 */
const openDictItemsDrawer = (dictType: IDictType) => {
    selectedDictType.value = dictType;
    dictItemsDrawerVisible.value = true;
};
// 导入字典数据
const importDict = () => {
    toast.add({ severity: 'info', summary: '提示', detail: '字典数据导入功能已触发', life: 3000 });
};

/**
 * 处理列配置变化
 */
function handleColumnsChange(columns: TableColumns<IDictType>): void {
    tableConfig.value.columns = columns;
}

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
    console.log(dictTypeForm.value);
    dictTypeForm.value?.openDrawer();
};

const formatterDictType = (value: string) => {
    return {
        SYSTEM: '系统字典',
        BUSINESS: '业务字典'
    }[value];
};

const handleCloseDictItem = () => {
    dictItemsDrawerVisible.value = false;
    selectedDictType.value = undefined;
};
</script>

<template>
    <PageContainer>
        <template #header>
            <div class="flex justify-between items-center">
                <h5 class="m-0">{{ title }}</h5>
                <div>
                    <Button class="mr-2" icon="pi pi-plus" label="新增" @click="openNewDictType" />
                    <Button icon="pi pi-upload" label="导入" @click="importDict" />
                </div>
            </div>
        </template>
        <CustomTable v-bind="tableConfig" @page="handlePageChange" @refresh="handleRefresh" @update:columns="handleColumnsChange" @filter-change="handleFilterChange">
            <!-- 字典名称列 -->
            <template #column-dictName="{ data }">
                <Button :label="data.dictName" variant="link" @click="openDictItemsDrawer(data)" />
            </template>
            <!-- 字典编码 -->
            <template #column-dictCode="{ data }">
                <div class="flex items-center gap-1">
                    <Tag :value="data.dictCode" severity="secondary"></Tag>
                    <i class="pi pi-clone cursor-pointer text-gray-500 hover:text-blue-500 transition-colors" title="复制字典类型" @click="copyDictType(data.dictCode)"></i>
                </div>
            </template>
            <!-- 字典类型 -->
            <template #column-systemFlag="{ data }">
                <Tag severity="secondary">{{ formatterDictType(data.systemFlag) }}</Tag>
            </template>
            <!-- 状态列 -->
            <template #column-status="{ data }">
                <div class="flex items-center gap-1">
                    <component :is="h(data.status == 1 ? CircleCheck : CircleX, { size: 14, color: data.status == 1 ? 'var(--primary-color)' : 'red' })"> </component>
                    <span>{{ data.status == 1 ? '启用' : '停用' }}</span>
                </div>
            </template>
        </CustomTable>
        <DictTypeForm ref="dictTypeForm" @success="handleRefresh" />
        <Menu ref="menu" :model="getMoreActions()" popup></Menu>
        <DictItemsDrawer v-model:visible="dictItemsDrawerVisible" :dict-type="selectedDictType" @close="handleCloseDictItem" />
    </PageContainer>
</template>

<style lang="scss" scoped>
.status-indicator {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}

.status-active {
    .status-dot {
        background-color: var(--primary-color);
    }

    .status-text {
        color: var(--primary-color);
    }
}

.status-inactive {
    .status-dot {
        background-color: var(--danger-color);
    }

    .status-text {
        color: var(--danger-color);
    }
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
