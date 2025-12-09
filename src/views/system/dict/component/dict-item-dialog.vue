<script setup lang="ts">
import { SmartFormField } from '@/components';
import type { IDictData } from '@/services/types/dict';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from 'primevue/usetoast';
import { computed, ref, watch, type PropType } from 'vue';
import { z } from 'zod';

// 定义组件属性
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    dictTypeId: {
        type: [Number, String] as PropType<number | string | undefined>,
        default: undefined
    },
    editItem: {
        type: Object as () => Partial<IDictData> | null,
        default: null
    },
    existingItems: {
        type: Array as () => IDictData[],
        default: () => []
    }
});

// 定义事件
const emit = defineEmits(['update:visible', 'save']);

// 本地对话框可见状态
const dialogVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
});

// Toast 通知
const toast = useToast();

// 表单初始值
const getInitialValues = () => ({
    id: props.editItem?.id,
    dictTypeId: props.editItem?.dictTypeId || props.dictTypeId,
    dictLabel: props.editItem?.dictLabel || '',
    dictValue: props.editItem?.dictValue || '',
    dictSort: props.editItem?.dictSort || props.existingItems.length + 1,
    status: props.editItem?.status !== undefined ? props.editItem.status : 1,
    isDefault: props.editItem?.isDefault !== undefined ? props.editItem.isDefault : false,
    dictRemark: props.editItem?.dictRemark || ''
});

// 表单验证 - 使用 Zod
const dictItemSchema = z.object({
    dictLabel: z.string().min(1, { message: '字典标签不能为空' }),
    dictValue: z.string().min(1, { message: '字典值不能为空' }),
    dictSort: z.number().min(0).max(999).optional(),
    status: z.number(),
    isDefault: z.boolean(),
    dictRemark: z.string().optional()
});

// 表单验证状态
const formInvalid = ref(false);

// 状态选项
const statusOptions = ref([
    { label: '启用', value: 1 },
    { label: '停用', value: 0 }
]);

// Form 组件引用
const formRef = ref<any>(null);

// 监听表单验证状态
const handleFormValidation = (event: any) => {
    formInvalid.value = !event.valid;
};

// 监听属性变化，更新表单值
watch(
    () => props.editItem,
    (newVal) => {
        if (formRef.value && props.visible) {
            const newValues = {
                id: newVal?.id,
                dictTypeId: newVal?.dictTypeId || props.dictTypeId,
                dictLabel: newVal?.dictLabel || '',
                dictValue: newVal?.dictValue || '',
                dictSort: newVal?.dictSort || props.existingItems.length + 1,
                status: newVal?.status !== undefined ? newVal.status : 1,
                isDefault: newVal?.isDefault !== undefined ? newVal.isDefault : false,
                dictRemark: newVal?.dictRemark || ''
            };
            formRef.value?.setValues?.(newValues);
        }
    },
    { deep: true }
);

// 关闭对话框
const closeDialog = () => {
    emit('update:visible', false);
};

// 表单提交处理
const onFormSubmit = ({ valid, values }: { valid: boolean; values: any }) => {
    if (valid) {
        if (values.id) {
            // 更新现有字典项
            const updatedItem: IDictData = {
                id: values.id,
                dictTypeId: values.dictTypeId || props.dictTypeId,
                dictLabel: values.dictLabel,
                dictValue: values.dictValue,
                dictSort: values.dictSort || 0,
                status: values.status,
                isDefault: values.isDefault,
                dictRemark: values.dictRemark || '',
                createTime: props.editItem?.createTime || ''
            };

            emit('save', updatedItem, 'update');
            toast.add({ severity: 'success', summary: '成功', detail: '字典项已更新', life: 3000 });
        } else {
            // 创建新字典项
            // const newId = Math.max(0, ...props.existingItems.map((i) => Number(i.id) || 0)) + 1;
            const now = new Date().toLocaleString();
            const newItem: IDictData = {
                // id: newId, // 让后端生成 ID
                dictTypeId: values.dictTypeId || props.dictTypeId,
                dictLabel: values.dictLabel,
                dictValue: values.dictValue,
                dictSort: values.dictSort || 0,
                status: values.status,
                isDefault: values.isDefault,
                dictRemark: values.dictRemark || '',
                createTime: now
            };

            emit('save', newItem, 'create');
            toast.add({ severity: 'success', summary: '成功', detail: '字典项已创建', life: 3000 });
        }

        closeDialog();
    } else {
        toast.add({
            severity: 'error',
            summary: '验证失败',
            detail: '请检查表单字段',
            life: 3000
        });
    }
};

// 监听对话框打开，重置表单
watch(
    () => props.visible,
    (newVisible) => {
        if (newVisible && formRef.value) {
            // 重新设置表单初始值
            formRef.value?.setValues?.(getInitialValues());
        }
    }
);
</script>

<template>
    <Dialog v-model:visible="dialogVisible" :style="{ width: '500px' }" :header="props.editItem?.id ? '编辑字典项' : '新建字典项'"
        :modal="true" class="p-fluid">
        <Form ref="formRef" :initial-values="getInitialValues()" :resolver="zodResolver(dictItemSchema)"
            :validate-on-value-update="false" :validate-on-blur="true" class="flex flex-col gap-4 mt-2"
            @submit="onFormSubmit" @validate="handleFormValidation">
            <!-- 字典标签字段 -->
            <SmartFormField name="dictLabel" label="字典标签" required>
                <template #default="{ value, onInput, onBlur, invalid }">
                    <InputText id="dictLabel" :model-value="value" placeholder="请输入字典标签" autofocus class="w-full"
                        :class="{ 'p-invalid': invalid }"
                        @update:model-value="(val) => onInput({ target: { value: val } })" @blur="onBlur" />
                </template>
            </SmartFormField>

            <!-- 字典值字段 -->
            <SmartFormField name="dictValue" label="字典值" required>
                <template #default="{ value, onInput, onBlur, invalid }">
                    <InputText id="dictValue" :model-value="value" placeholder="请输入字典值" class="w-full"
                        :class="{ 'p-invalid': invalid }"
                        @update:model-value="(val) => onInput({ target: { value: val } })" @blur="onBlur" />
                </template>
            </SmartFormField>

            <!-- 排序字段 -->
            <SmartFormField name="dictSort" label="排序">
                <template #default="{ value, onInput, invalid }">
                    <InputNumber id="dictSort" :model-value="value" :min="0" :max="999" class="w-full"
                        placeholder="请输入排序值" :class="{ 'p-invalid': invalid }"
                        @update:model-value="(val) => onInput({ target: { value: val } })" />
                </template>
            </SmartFormField>

            <!-- 状态字段 -->
            <SmartFormField name="status" label="状态">
                <template #default="{ value, onInput, invalid }">
                    <Select id="status" :model-value="value" :options="statusOptions" option-label="label"
                        option-value="value" placeholder="选择状态" class="w-full" :class="{ 'p-invalid': invalid }"
                        @update:model-value="(val) => onInput({ target: { value: val } })" />
                </template>
            </SmartFormField>

            <!-- 描述字段 -->
            <SmartFormField name="dictRemark" label="描述">
                <template #default="{ value, onInput, invalid }">
                    <Textarea id="dictRemark" :model-value="value" rows="3" :auto-resize="true" class="w-full"
                        placeholder="请输入字典项描述" :class="{ 'p-invalid': invalid }"
                        @update:model-value="(val) => onInput({ target: { value: val } })" />
                </template>
            </SmartFormField>

            <!-- 按钮组 -->
            <div class="flex justify-end gap-3 mt-4">
                <Button type="button" label="取消" severity="secondary" outlined @click="closeDialog" />
                <Button type="submit" :label="props.editItem?.id ? '保存' : '创建'" :disabled="formInvalid" />
            </div>
        </Form>
    </Dialog>
</template>
