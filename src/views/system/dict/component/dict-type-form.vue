<script lang="ts" setup>
import { SmartFormField } from '@/components';
import CustomDrawer from '@/components/custom-drawer';
import globalToast from '@/services/core/toast';
import { dictTypeService } from '@/services/modules/dict-type';
import type { IDictData, IDictType } from '@/services/types/dict';
import { to } from '@/utils/result-handler';
import { Form, type FormPassThroughAttributes } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { nextTick, ref } from 'vue';
import { z } from 'zod';

import { InboxIcon, LibraryIcon, List } from 'lucide-vue-next';

// 定义事件
const emit = defineEmits(['success']);

const statusOptions = ref<{ label: string; value: number }[]>([
    { label: '启用', value: 1 },
    { label: '停用', value: 0 }
]);

const initialDictTypeValue = ref<IDictType>({
    id: undefined,
    dictName: '',
    dictCode: '',
    dictDesc: '',
    systemFlag: '',
    status: 1
});

// 字典项数据
const dictItems = ref<IDictData[]>([]);
const dictItemsEditRows = ref<IDictData[]>([]);
const newDictItem = ref({
    dictValue: '',
    dictLabel: '',
    dictRemark: '',
    dictSort: 1,
    status: 1
});

// 表单验证 - 使用 Zod
const dictTypeSchema = z.object({
    dictCode: z.string().min(1, { message: '字典编码不能为空' }),
    dictName: z.string().min(1, { message: '字典名称不能为空' }),
    systemFlag: z
        .string()
        .min(1, { message: '请选择字典类型' })
        .refine((val) => ['BUSINESS', 'SYSTEM'].includes(val), { message: '字典类型必须是业务字典或系统字典' }),
    dictDesc: z.string().optional()
});

const drawerVisible = ref(false);
// Form 组件引用
const formRef = ref<InstanceType<typeof Form> | null>(null);

// 表单验证状态
const invalid = ref(false);

const openDrawer = async (data: IDictType | Record<string, any> = {}) => {
    // 重置表单验证状态
    invalid.value = false;

    // 正确设置初始值，确保编辑模式下有完整的数据
    initialDictTypeValue.value = {
        id: data.id || undefined,
        dictName: data.dictName || '',
        dictCode: data.dictCode || '',
        dictDesc: data.dictDesc || '',
        systemFlag: data.systemFlag || '',
        status: data.status !== undefined ? data.status : 1
    };

    drawerVisible.value = true;

    // 在下一个tick中重置表单状态，确保表单正确初始化
    await nextTick();
    if (formRef.value) {
        // 使用PrimeVue Forms的setValues方法设置初始值
        (formRef.value as FormPassThroughAttributes).setValues(initialDictTypeValue.value);
    }
};

// 暴露方法供父组件调用
defineExpose({
    openDrawer
});

// 监听表单验证状态
const handleFormValidation = (event: any) => {
    invalid.value = !event.valid;
};

// 关闭抽屉
const closeDrawer = () => {
    if (formRef.value) {
        (formRef.value as any).reset();
    }
    // 重置验证状态
    invalid.value = false;
    drawerVisible.value = false;
};

/**
 * 表单提交处理函数
 * @param event - PrimeVue Form 提交事件，包含 valid 状态和 values 数据
 */
const onFormSubmit = async (event: { valid: boolean; values: any; errors: any }) => {
    const { valid, values } = event;

    if (!valid) {
        globalToast.error('请检查表单字段', '验证失败');
        return;
    }

    try {
        // 创建字典类型
        const dictDataList: IDictData[] = dictItems.value.map((item: IDictData) => {
            return {
                dictLabel: item.dictLabel,
                dictValue: item.dictValue,
                dictSort: item.dictSort,
                dictDesc: item.dictRemark,
                dictTypeId: undefined
            };
        });
        const typeResult = await to(
            initialDictTypeValue.value.id
                ? dictTypeService.updateDictType({
                    ...values,
                    dictDataList,
                    id: initialDictTypeValue.value.id
                })
                : dictTypeService.addDictType({ ...values, dictDataList })
        );
        if (!typeResult.ok) {
            globalToast.error(`【${values.dictName}】字典创建失败`, '提交失败');
            return;
        }
        globalToast.success(`【${values.dictName}】字典创建成功`, '提交成功');
        emit('success');
        closeDrawer();
    } catch (error) {
        console.error('表单提交错误:', error);
        globalToast.error('提交过程中发生错误', '提交失败');
    }
};

/**
 * 手动触发表单提交
 */
const handleSubmit = () => {
    if (formRef.value) {
        (formRef.value as FormPassThroughAttributes).submit();
    }
};
// 重置表单
const resetForm = () => {
    if (formRef.value) {
        (formRef.value as FormPassThroughAttributes).reset();
    }
    // 重置验证状态
    invalid.value = false;
    dictItems.value = [];
    newDictItem.value = {
        dictValue: '',
        dictLabel: '',
        dictRemark: '',
        dictSort: 1,
        status: 1
    };
    closeDrawer();
};

const onRowEditSave = (event: any) => {
    const restoreTheOriginalData = (index: number, originalData: IDictData) => {
        dictItems.value[index] = originalData;
        dictItemsEditRows.value = [...dictItemsEditRows.value, originalData];
    };

    const { newData, index, data } = event;

    const originalData = dictItems.value[index];
    // 1、保存的时候先判断字典名称和字典值是否已经填写
    if (!newData.dictLabel || !newData.dictValue) {
        globalToast.error('请填写字典名称和字典值', '保存失败');
        restoreTheOriginalData(index, originalData);
        return;
    }
    // 2、判断字典名称和字典值是否已经存在，提示语为：第几行和几行的字典值或字典名称重复，请检查
    const existingItem = dictItems.value.find((item) => item.id !== newData.id && (item.dictLabel === newData.dictLabel || item.dictValue === newData.dictValue));
    if (existingItem) {
        globalToast.error(`第${index + 1}行和第${dictItems.value.indexOf(existingItem) + 1}行的字典值或字典名称重复，请检查`, '保存失败');
        restoreTheOriginalData(index, originalData);
        return;
    }
    // 验证通过，执行保存
    // 如果是新增数据，保存成功后清除 isNew 标识
    if (newData.isNew) {
        delete newData.isNew;
        globalToast.success('字典项新增成功');
    } else {
        globalToast.success('字典项保存成功');
    }

    dictItems.value[index] = newData;
};

const onRowEditCancel = (event: any) => {
    const { index, data } = event;
    if (data.isNew) {
        // 1、如果是新增的数据，并且在编辑状态下取消，需要从数组中移除
        dictItems.value.splice(index, 1);
    }
};

const openNewDictItem = () => {
    const id = Date.now(); // 使用时间戳作为唯一ID，避免重复
    const _editItem = {
        ...newDictItem.value,
        id: id,
        dictSort: dictItems.value.length + 1,
        dictTypeId: undefined,
        isNew: true // 标识这是新增的数据
    };
    dictItems.value.push(_editItem);
    dictItemsEditRows.value = [...dictItemsEditRows.value, _editItem];
};
</script>

<template>
    <CustomDrawer v-model:visible="drawerVisible" :show-default-footer="true" class="!w-[800px]" header="新建字典"
        width-type="extra-large">
        <!--子标题-->
        <div class="flex items-center mb-4 mt-2">
            <div class="bg-primary/10 p-1.5 rounded-md mr-3 text-primary flex items-center justify-center">
                <LibraryIcon :size="18" />
            </div>
            <span class="font-bold text-lg text-gray-800 dark:text-gray-100">基本信息</span>
            <div class="h-px flex-1 bg-gray-200 dark:bg-gray-700 ml-4"></div>
        </div>

        <Form ref="formRef" :initial-values="initialDictTypeValue" :resolver="zodResolver(dictTypeSchema)"
            :validate-on-blur="false" :validate-on-mount="false" :validate-on-value-update="false"
            class="form-grid px-1" @submit="onFormSubmit" @validate="handleFormValidation" @keydown.enter.prevent>
            <div class="grid grid-cols-2 gap-x-6 gap-y-4">
                <SmartFormField label="字典名称" name="dictName" required>
                    <template #default="{ value, onInput, invalid }">
                        <InputText id="dictName" :class="{ 'p-invalid': invalid }" :model-value="value" autofocus
                            class="w-full" placeholder="请输入字典名称"
                            @update:model-value="(val) => onInput({ target: { value: val } })" />
                    </template>
                </SmartFormField>
                <!-- 字典编码字段 -->
                <SmartFormField label="字典编码" name="dictCode" required>
                    <template #default="{ value, onInput, invalid }">
                        <InputText id="dictCode" :class="{ 'p-invalid': invalid }" :model-value="value" class="w-full"
                            placeholder="请输入字典编码" @update:model-value="(val) => onInput({ target: { value: val } })" />
                    </template>
                </SmartFormField>
                <!-- 字典类型字段 -->
                <SmartFormField label="字典类型" name="systemFlag" required>
                    <template #default="{ value, onInput, invalid }">
                        <Select id="systemFlag" :class="{ 'p-invalid': invalid }" :model-value="value" :options="[
                            { label: '业务字典', value: 'BUSINESS' },
                            { label: '系统字典', value: 'SYSTEM' }
                        ]" class="w-full" option-label="label" option-value="value" placeholder="选择字典类型"
                            @update:model-value="(val) => onInput({ target: { value: val } })" />
                    </template>
                </SmartFormField>

                <!-- 状态字段 -->
                <SmartFormField label="状态" name="status">
                    <template #default="{ value, onInput, invalid }">
                        <Select id="status" :class="{ 'p-invalid': invalid }" :model-value="value"
                            :options="statusOptions" class="w-full" option-label="label" option-value="value"
                            placeholder="选择状态" @update:model-value="(val) => onInput({ target: { value: val } })" />
                    </template>
                </SmartFormField>
            </div>

            <!-- 描述字段 -->
            <SmartFormField class="mt-4" label="描述" name="dictDesc">
                <template #default="{ value, onInput, invalid }">
                    <Textarea id="dictDesc" :auto-resize="true" :class="{ 'p-invalid': invalid }" :model-value="value"
                        class="w-full" cols="30" placeholder="请输入字典描述" rows="3"
                        @update:model-value="(val) => onInput({ target: { value: val } })" />
                </template>
            </SmartFormField>
        </Form>

        <!--子标题-->
        <div class="flex items-center mb-4 mt-8">
            <div class="bg-primary/10 p-1.5 rounded-md mr-3 text-primary flex items-center justify-center">
                <List :size="18" />
            </div>
            <span class="font-bold text-lg text-gray-800 dark:text-gray-100">字典项配置</span>
            <div class="h-px flex-1 bg-gray-200 dark:bg-gray-700 ml-4"></div>
        </div>

        <!-- 字典项管理区域 -->
        <DataTable v-model:editing-rows="dictItemsEditRows" :value="dictItems"
            class="custom-table__border rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
            data-key="id" edit-mode="row" style="--p-datatable-footer-border-width: 0" @row-edit-save="onRowEditSave"
            @row-edit-cancel="onRowEditCancel">
            <Column field="dictLabel" header="字典名称" style="width: 25%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid placeholder="输入名称" />
                </template>
            </Column>
            <Column field="dictValue" header="字典值" style="width: 25%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid placeholder="输入值" />
                </template>
            </Column>
            <Column field="dictRemark" header="字典描述" style="width: 30%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid placeholder="输入描述" />
                </template>
            </Column>
            <Column :row-editor="true" body-style="text-align:center" header="操作" style="width: 20%">
                <template #editor="{ data, field, editorSaveCallback, editorCancelCallback }">
                    <div class="flex items-center justify-center gap-1">
                        <Button v-tooltip.bottom="'保存'" icon="pi pi-check" severity="success" text rounded size="small"
                            @click="editorSaveCallback(data)" />
                        <Button v-tooltip.bottom="'取消'" icon="pi pi-times" severity="secondary" text rounded
                            size="small" @click="editorCancelCallback" />
                    </div>
                </template>
                <template #body="{ data, field, editorInitCallback }">
                    <div class="flex items-center justify-center gap-1">
                        <Button v-tooltip.bottom="'编辑'" icon="pi pi-pencil" text rounded severity="primary" size="small"
                            @click="editorInitCallback" />
                        <Button v-tooltip.bottom="'删除'" icon="pi pi-trash" text rounded severity="danger" size="small"
                            @click="editorInitCallback" />
                    </div>
                </template>
            </Column>
            <template #empty>
                <div
                    class="flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
                    <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-3">
                        <InboxIcon class="text-gray-400 dark:text-gray-500" :size="32" />
                    </div>
                    <h3 class="text-gray-600 dark:text-gray-300 font-medium mb-1">暂无字典项</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">点击下方按钮添加新的字典项</p>
                </div>
            </template>
            <template #footer>
                <Button icon="pi pi-plus" label="添加字典项" text
                    class="w-full border-dashed border-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40 py-3"
                    @click="openNewDictItem" />
            </template>
        </DataTable>
        <!-- 按钮组 -->
        <template #footer>
            <div class="flex justify-between items-center w-full">
                <div class="text-sm text-gray-500 flex items-center gap-2">
                    <i class="pi pi-info-circle text-blue-500"></i>
                    <span>请确保所有必填项已填写完整</span>
                </div>
                <div class="flex gap-3">
                    <Button icon="pi pi-refresh" label="重置" outlined severity="secondary" type="button"
                        @click="resetForm" />
                    <Button :disabled="invalid" icon="pi pi-check" label="创建" type="button" @click="handleSubmit" />
                </div>
            </div>
        </template>
    </CustomDrawer>
</template>

<style scoped>
/* 空状态样式 */
.empty-state {
    @apply flex flex-col items-center justify-center p-4 text-center;
}

.empty-content {
    @apply flex flex-col gap-2;
}

.empty-description {
    @apply text-sm text-muted-color;
}
</style>
