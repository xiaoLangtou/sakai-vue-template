<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { SmartFormField } from '@/components';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { Form } from '@primevue/forms';
import { z } from 'zod';

// 定义字典项接口
interface DictItem {
    id: number;
    dictTypeId: number;
    label: string;
    value: string;
    sort: number;
    status: boolean;
    isDefault: boolean;
    remark: string;
    createTime: string;
}

// 定义组件属性
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    dictTypeId: {
        type: Number,
        required: true
    },
    editItem: {
        type: Object as () => Partial<DictItem> | null,
        default: null
    },
    existingItems: {
        type: Array as () => DictItem[],
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
    label: props.editItem?.label || '',
    value: props.editItem?.value || '',
    sort: props.editItem?.sort || props.existingItems.length + 1,
    status: props.editItem?.status !== undefined ? props.editItem.status : true,
    isDefault: props.editItem?.isDefault !== undefined ? props.editItem.isDefault : false,
    remark: props.editItem?.remark || ''
});

// 表单验证 - 使用 Zod
const dictItemSchema = z.object({
    label: z.string().min(1, { message: '字典标签不能为空' }),
    value: z.string().min(1, { message: '字典值不能为空' }),
    sort: z.number().min(0).max(999).optional(),
    status: z.boolean(),
    isDefault: z.boolean(),
    remark: z.string().optional()
});

// 表单验证状态
const invalid = ref(false);

// 状态选项
const statusOptions = ref([
    { label: '启用', value: true },
    { label: '停用', value: false }
]);

// Form 组件引用
const formRef = ref<any>(null);

// 监听表单验证状态
const handleFormValidation = (event: any) => {
    invalid.value = !event.valid;
};

// 监听属性变化，更新表单值
watch(
    () => props.editItem,
    (newVal) => {
        if (formRef.value && props.visible) {
            const newValues = {
                id: newVal?.id,
                dictTypeId: newVal?.dictTypeId || props.dictTypeId,
                label: newVal?.label || '',
                value: newVal?.value || '',
                sort: newVal?.sort || props.existingItems.length + 1,
                status: newVal?.status !== undefined ? newVal.status : true,
                isDefault: newVal?.isDefault !== undefined ? newVal.isDefault : false,
                remark: newVal?.remark || ''
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
            const updatedItem: DictItem = {
                id: values.id,
                dictTypeId: values.dictTypeId || props.dictTypeId,
                label: values.label,
                value: values.value,
                sort: values.sort || 0,
                status: values.status,
                isDefault: values.isDefault,
                remark: values.remark || '',
                createTime: props.editItem?.createTime || ''
            };

            emit('save', updatedItem, 'update');
            toast.add({ severity: 'success', summary: '成功', detail: '字典项已更新', life: 3000 });
        } else {
            // 创建新字典项
            const newId = Math.max(0, ...props.existingItems.map((i) => i.id)) + 1;
            const now = new Date().toLocaleString();
            const newItem: DictItem = {
                id: newId,
                dictTypeId: values.dictTypeId || props.dictTypeId,
                label: values.label,
                value: values.value,
                sort: values.sort || 0,
                status: values.status,
                isDefault: values.isDefault,
                remark: values.remark || '',
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

// 重置表单
const resetForm = () => {
    if (formRef.value) {
        formRef.value?.reset?.();
    }
};

// 监听对话框打开，重置表单
watch(() => props.visible, (newVisible) => {
    if (newVisible && formRef.value) {
        // 重新设置表单初始值
        formRef.value?.setValues?.(getInitialValues());
    }
});
</script>

<template>
    <Dialog v-model:visible="dialogVisible" :style="{ width: '500px' }"
        :header="props.editItem?.id ? '编辑字典项' : '新建字典项'"
        :modal="true" class="p-fluid dialog-form">

        <Form ref="formRef"
            :initialValues="getInitialValues()"
            :resolver="zodResolver(dictItemSchema)"
            :validateOnValueUpdate="false"
            :validateOnBlur="true"
            @submit="onFormSubmit"
            @validate="handleFormValidation"
            class="form-grid">

            <!-- 字典标签字段 -->
            <SmartFormField name="label" label="字典标签" required class="mb-4">
                <template #default="{ value, onInput, onBlur, invalid }">
                    <InputText
                        id="label"
                        :modelValue="value"
                        @update:modelValue="(val) => onInput({ target: { value: val } })"
                        @blur="onBlur"
                        placeholder="请输入字典标签"
                        autofocus
                        class="w-full"
                        :class="{ 'p-invalid': invalid }"
                    />
                </template>
            </SmartFormField>

            <!-- 字典值字段 -->
            <SmartFormField name="value" label="字典值" required class="mb-4">
                <template #default="{ value, onInput, onBlur, invalid }">
                    <InputText
                        id="value"
                        :modelValue="value"
                        @update:modelValue="(val) => onInput({ target: { value: val } })"
                        @blur="onBlur"
                        placeholder="请输入字典值"
                        class="w-full"
                        :class="{ 'p-invalid': invalid }"
                    />
                </template>
            </SmartFormField>

            <!-- 排序字段 -->
            <SmartFormField name="sort" label="排序" class="mb-4">
                <template #default="{ value, onInput, invalid }">
                    <InputNumber
                        id="sort"
                        :modelValue="value"
                        @update:modelValue="(val) => onInput({ target: { value: val } })"
                        :min="0"
                        :max="999"
                        class="w-full"
                        placeholder="请输入排序值"
                        :class="{ 'p-invalid': invalid }"
                    />
                </template>
            </SmartFormField>

            <!-- 状态字段 -->
            <SmartFormField name="status" label="状态" class="mb-4">
                <template #default="{ value, onInput, invalid }">
                    <Select
                        id="status"
                        :modelValue="value"
                        :options="statusOptions"
                        optionLabel="label"
                        optionValue="value"
                        @update:modelValue="(val) => onInput({ target: { value: val } })"
                        placeholder="选择状态"
                        class="w-full"
                        :class="{ 'p-invalid': invalid }"
                    />
                </template>
            </SmartFormField>

            <!-- 描述字段 -->
            <SmartFormField name="remark" label="描述" class="mb-4">
                <template #default="{ value, onInput, invalid }">
                    <Textarea
                        id="remark"
                        :modelValue="value"
                        @update:modelValue="(val) => onInput({ target: { value: val } })"
                        rows="3"
                        :autoResize="true"
                        class="w-full"
                        placeholder="请输入字典项描述"
                        :class="{ 'p-invalid': invalid }"
                    />
                </template>
            </SmartFormField>

            <!-- 按钮组 -->
            <div class="flex justify-end gap-2">
                <Button
                    type="button"
                    label="重置"
                    icon="pi pi-refresh"
                    severity="secondary"
                    outlined
                    @click="resetForm"
                />
                <Button
                    type="submit"
                    :label="props.editItem?.id ? '保存' : '创建'"
                    icon="pi pi-check"
                    :disabled="invalid"
                />
            </div>
        </Form>
    </Dialog>
</template>

<style scoped>
.dialog-form {
    max-width: 500px;
    margin: 0 auto;
}

.form-grid {
    display: flex;
    flex-direction: column;
}
</style>
