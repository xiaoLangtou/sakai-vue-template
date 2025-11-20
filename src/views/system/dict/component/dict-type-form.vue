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
const emit = defineEmits([ 'success' ]);

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
    systemFlag: z.string()
        .min(1, { message: '请选择字典类型' })
        .refine(
            (val) => [ 'BUSINESS', 'SYSTEM' ].includes(val),
            { message: '字典类型必须是业务字典或系统字典' }
        ),
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
    if ( formRef.value ) {
        // 使用PrimeVue Forms的setValues方法设置初始值
        ( formRef.value as FormPassThroughAttributes ).setValues(initialDictTypeValue.value);
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
    if ( formRef.value ) {
        ( formRef.value as any ).reset();
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

    if ( !valid ) {
        globalToast.error('请检查表单字段', '验证失败');
        return;
    }

    try {
        // 创建字典类型
        const dictDataList:IDictData[]=  dictItems.value.map((item:IDictData)=>{
            return {
                dictLabel:item.dictLabel,
                dictValue:item.dictValue,
                dictSort:item.dictSort,
                dictDesc:item.dictRemark,
                dictTypeId:undefined
            }
        })
        const typeResult = await to(initialDictTypeValue.value.id ? dictTypeService.updateDictType({
            ...values,
            dictDataList,
            id: initialDictTypeValue.value.id
        }) : dictTypeService.addDictType({ ...values,dictDataList }));
        if ( !typeResult.ok ) {
            globalToast.error(`【${ values.dictName }】字典创建失败`, '提交失败');
            return;
        }
        globalToast.success(`【${ values.dictName }】字典创建成功`, '提交成功');
        emit('success');
        closeDrawer();
    } catch ( error ) {
        console.error('表单提交错误:', error);
        globalToast.error('提交过程中发生错误', '提交失败');
    }
};

/**
 * 手动触发表单提交
 */
const handleSubmit = () => {
    if ( formRef.value ) {
        ( formRef.value as FormPassThroughAttributes ).submit();
    }
};
// 重置表单
const resetForm = () => {
    if ( formRef.value ) {
        ( formRef.value as FormPassThroughAttributes ).reset();
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
        dictItemsEditRows.value = [ ...dictItemsEditRows.value, originalData ];
    };

    const { newData, index, data } = event;

    const originalData = dictItems.value[index];
    // 1、保存的时候先判断字典名称和字典值是否已经填写
    if ( !newData.dictLabel || !newData.dictValue ) {
        globalToast.error('请填写字典名称和字典值', '保存失败');
        restoreTheOriginalData(index, originalData);
        return;
    }
    // 2、判断字典名称和字典值是否已经存在，提示语为：第几行和几行的字典值或字典名称重复，请检查
    const existingItem = dictItems.value.find(item => item.id !== newData.id && ( item.dictLabel === newData.dictLabel || item.dictValue === newData.dictValue ));
    if ( existingItem ) {
        globalToast.error(`第${ index + 1 }行和第${ dictItems.value.indexOf(existingItem) + 1 }行的字典值或字典名称重复，请检查`, '保存失败');
        restoreTheOriginalData(index, originalData);
        return;
    }
    // 验证通过，执行保存
    // 如果是新增数据，保存成功后清除 isNew 标识
    if ( newData.isNew ) {
        delete newData.isNew;
        globalToast.success('字典项新增成功');
    } else {
        globalToast.success('字典项保存成功');
    }

    dictItems.value[index] = newData;
};

const onRowEditCancel = (event: any) => {
    const { index, data } = event;
    if ( data.isNew ) {
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
    dictItemsEditRows.value = [ ...dictItemsEditRows.value, _editItem ];
};
</script>

<template>
    <CustomDrawer v-model:visible="drawerVisible" :show-default-footer="true" class="!w-[800px]" header="新建字典"
                  width-type="extra-large">
        <!--子标题-->
        <div class="section-title">
            <LibraryIcon :size="16" />
            <span class="section-title-text">基本信息</span>
            <div class="section-title-line"></div>
        </div>
        <Form ref="formRef" :initial-values="initialDictTypeValue" :resolver="zodResolver(dictTypeSchema)"
              :validate-on-blur="false" :validate-on-mount="false" :validate-on-value-update="false" class="form-grid"
              @submit="onFormSubmit" @validate="handleFormValidation" @keydown.enter.prevent>


            <SmartFormField class="mb-4" label="字典名称" name="dictName" required>
                <template #default="{ value, onInput, invalid }">
                    <InputText id="dictName" :class="{ 'p-invalid': invalid }" :model-value="value" autofocus
                               class="w-full" placeholder="请输入字典名称，如：用户状态"
                               @update:model-value="(val) => onInput({ target: { value: val } })" />
                </template>
            </SmartFormField>
            <!-- 字典编码字段 -->
            <SmartFormField class="mb-4" label="字典编码" name="dictCode" required>
                <template #default="{ value, onInput, invalid }">
                    <InputText id="dictCode" :class="{ 'p-invalid': invalid }" :model-value="value" class="w-full"
                               placeholder="请输入字典编码，如：user_status"
                               @update:model-value="(val) => onInput({ target: { value: val } })" />
                </template>
            </SmartFormField>
            <!-- 字典类型字段 -->
            <SmartFormField class="mb-4" label="字典类型" name="systemFlag" required>
                <template #default="{ value, onInput, invalid }">
                    <Select id="systemFlag" :class="{ 'p-invalid': invalid }" :model-value="value"
                            :options="[{ label: '业务字典', value: 'BUSINESS' }, { label: '系统字典', value: 'SYSTEM' }]"
                            class="w-full" option-label="label" option-value="value" placeholder="选择字典类型"
                            @update:model-value="(val) => onInput({ target: { value: val } })" />
                </template>
            </SmartFormField>

            <!-- 状态字段 -->
            <SmartFormField class="mb-4" label="状态" name="status">
                <template #default="{ value, onInput, invalid }">
                    <Select id="status" :class="{ 'p-invalid': invalid }" :model-value="value" :options="statusOptions"
                            class="w-full" option-label="label" option-value="value" placeholder="选择状态"
                            @update:model-value="(val) => onInput({ target: { value: val } })" />
                </template>
            </SmartFormField>

            <!-- 描述字段 -->
            <SmartFormField class="mb-4" label="描述" name="dictDesc">
                <template #default="{ value, onInput, invalid }">
                    <Textarea id="dictDesc" :auto-resize="true" :class="{ 'p-invalid': invalid }" :model-value="value"
                              class="w-full" cols="30" placeholder="请输入字典描述" rows="5"
                              @update:model-value="(val) => onInput({ target: { value: val } })" />
                </template>
            </SmartFormField>

        </Form>

        <!--子标题-->
        <div class="section-title">
            <List :size="16" />
            <span class="section-title-text">字典项管理</span>
            <div class="section-title-line"></div>
        </div>

        <!-- 字典项管理区域 -->
        <DataTable v-model:editingRows="dictItemsEditRows" :value="dictItems" class="custom-table__border"
                   data-key="id"
                   edit-mode="row"
                   style="--p-datatable-footer-border-width: 0"
                   @row-edit-save="onRowEditSave"
                   @row-edit-cancel="onRowEditCancel">
            <Column field="dictLabel" header="字典名称" style="width: 25%;min-width: 25%;max-width: 25%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid placeholder="请输入字典名称" />
                </template>
            </Column>
            <Column field="dictValue" header="字典值" style="width: 25%;min-width: 25%;max-width: 25%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid placeholder="请输入字典值" />
                </template>
            </Column>
            <Column field="dictRemark" header="字典描述" style="width: 25%;min-width: 25%;max-width: 25%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid placeholder="请输入描述" />
                </template>
            </Column>
            <Column :rowEditor="true" bodyStyle="text-align:center" style="width: 15%; min-width: 8rem;max-width: 15%">
                <template #editor="{ data, field,editorSaveCallback,editorCancelCallback}">
                    <div class="flex items-center justify-center gap-2">
                        <Button v-tooltip.bottom="'保存'" icon="pi pi-check" severity="primary"
                                variant="text"
                                @click="editorSaveCallback(data)" />
                        <Button v-tooltip.bottom="'取消'" icon="pi pi-times" severity="primary"
                                variant="text"
                                @click="editorCancelCallback" />
                    </div>
                </template>
                <template #body="{data,field,editorInitCallback}">
                    <div class="flex items-center justify-center gap-2">
                        <Button v-tooltip.bottom="'编辑'" icon="pi pi-pencil" severity="primary" variant="text"
                                @click="editorInitCallback" />
                        <Button v-tooltip.bottom="'删除'" icon="pi pi-trash" severity="danger" variant="text"
                                @click="editorInitCallback" />
                    </div>
                </template>
            </Column>
            <template #empty>
                <div class="empty-state">
                    <div class="empty-content">
                        <div class="empty-title flex items-center justify-center gap-2">
                            <InboxIcon :size="16" />
                            暂无字典项
                        </div>
                        <div class="empty-description">点击添加按钮创建新的字典项</div>
                    </div>
                </div>
            </template>
            <template #footer>
                <Button icon="pi pi-plus" label="添加字典项" outlined
                        style="width: 100%"
                        @click="openNewDictItem" />
            </template>
        </DataTable>
        <!-- 按钮组 -->
        <template #footer>
            <div class="flex justify-between items-center">
                <div class="text-sm text-gray-500">请确保信息填写完整</div>
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


.form-grid {
    display: flex;
    flex-direction: column;
    padding: 1rem;
}



/* 子标题样式 */
.section-title {
    display: flex;
    align-items: center;
    margin: 1.5rem 0 1rem 0;
    position: relative;
}

.section-title-icon {
    color: var(--p-primary-color);
    font-size: 1.1rem;
    margin-right: 0.75rem;
    flex-shrink: 0;
}

.section-title-text {
    font-size: 1rem;
    font-weight: 600;
    color: var(--p-text-color);
    white-space: nowrap;
    margin-right: 1rem;
    letter-spacing: 0.025em;
}

.section-title-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, var(--p-surface-300), transparent);
    opacity: 0.6;
}

/* 暗色主题适配 */
:root.dark .section-title-line {
    background: linear-gradient(to right, var(--p-surface-600), transparent);
}


/* 字典项管理区域样式 */

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
