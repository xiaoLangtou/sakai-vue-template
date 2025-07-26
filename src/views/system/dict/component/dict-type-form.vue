<script setup lang="ts">
import { SmartFormField } from '@/components';
import { zodResolver } from '@/composables/useForm';
import { Form } from '@primevue/forms';
import { useToast } from 'primevue/usetoast';
import { computed, ref, watch } from 'vue';
import { z } from 'zod';

// 定义组件属性
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    dictTypeData: {
        type: Object,
        default: () => ({
            id: undefined,
            name: '',
            type: '',
            dictType: 'business',
            status: true,
            remark: ''
        })
    },
    statusOptions: {
        type: Array,
        default: () => [
            { label: '启用', value: true },
            { label: '停用', value: false }
        ]
    }
});

// 定义事件
const emit = defineEmits(['update:visible', 'save', 'reset']);

// 本地对话框可见状态
const dialogVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
});

// Toast 通知
const toast = useToast();

// 表单初始值
const getInitialValues = () => ({
    id: props.dictTypeData.id,
    name: props.dictTypeData.name || '',
    type: props.dictTypeData.type || '',
    dictType: props.dictTypeData.dictType || 'business',
    status: props.dictTypeData.status !== undefined ? props.dictTypeData.status : true,
    remark: props.dictTypeData.remark || ''
});

console.log(getInitialValues());

// 表单验证 - 使用 Zod
const dictTypeSchema = z.object({
    type: z.string().min(1, { message: '字典编码不能为空' }),
    name: z.string().min(1, { message: '字典名称不能为空' }),
    dictType: z.string(),
    remark: z.string().optional()
});

// 表单验证状态
const invalid = ref(false);

// 监听表单验证状态
const handleFormValidation = (event) => {
    invalid.value = !event.valid;
};

// 监听属性变化，更新表单值
watch(
    () => props.dictTypeData,
    (newVal) => {
        if (formRef.value) {

            const newValues = {
                id: newVal.id,
                name: newVal.name || '',
                type: newVal.type || '',
                dictType: newVal.dictType || 'business',
                status: newVal.status !== undefined ? newVal.status : true,
                remark: newVal.remark || ''
            };
            formRef.value.setValues(newValues);
        }
    },
    { deep: true }
);

// 关闭对话框
const closeDialog = () => {
    emit('update:visible', false);
};

// 表单提交处理
const onFormSubmit = ({ valid, values }) => {
    if (valid) {
        emit('save', { ...values });
        toast.add({
            severity: 'success',
            summary: '成功',
            detail: '字典信息已保存',
            life: 3000
        });
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

// Form 组件引用
const formRef = ref<InstanceType<typeof Form> | null>(null);

// 重置表单
const resetForm = () => {
    if (formRef.value) {
        formRef.value.reset();
    }
    emit('reset');
};
</script>

<template>
    <Dialog v-model:visible="dialogVisible" :style="{ width: '500px' }" header="新建字典" :modal="true"
        class="p-fluid dialog-form">
        <Form ref="formRef" :initialValues="getInitialValues()" :resolver="zodResolver(dictTypeSchema)"
            :validateOnValueUpdate="false" :validateOnBlur="true" @submit="onFormSubmit"
            @validate="handleFormValidation" class="form-grid">
            <!-- 字典编码字段 -->
            <SmartFormField name="type" label="字典编码" required class="mb-4">
                <template #default="{ value, onInput, onBlur, invalid }">
                    <InputText id="type" :modelValue="value"
                        @update:modelValue="(val) => onInput({ target: { value: val } })"
                        placeholder="请输入字典编码，如：user_status" class="w-full" :class="{ 'p-invalid': invalid }" />
                </template>
            </SmartFormField>

            <!-- 字典名称字段 -->
            <SmartFormField name="name" label="字典名称" required class="mb-4">
                <template #default="{ value, onInput, onBlur, invalid }">
                    <InputText id="name" :modelValue="value"
                        @update:modelValue="(val) => onInput({ target: { value: val } })" placeholder="请输入字典名称，如：用户状态"
                        autofocus class="w-full" :class="{ 'p-invalid': invalid }" />
                </template>
            </SmartFormField>

            <!-- 字典类型字段 -->
            <SmartFormField name="dictType" label="字典类型" class="mb-4">
                <template #default="{ value, onInput, invalid }">
                    <Select id="dictType" :modelValue="value" :options="[{ label: '业务字典', value: 'business' }]"
                        optionLabel="label" optionValue="value" placeholder="选择字典类型" class="w-full"
                        :class="{ 'p-invalid': invalid }" />
                </template>
            </SmartFormField>

            <!-- 状态字段 -->
            <SmartFormField name="status" label="状态" class="mb-4">
                <template #default="{ value, onInput, invalid }">
                    <Select id="status" :modelValue="value" :options="statusOptions" optionLabel="label"
                        @update:modelValue="(val) => onInput({ target: { value: val } })" optionValue="value"
                        placeholder="选择状态" class="w-full" :class="{ 'p-invalid': invalid }" />
                </template>
            </SmartFormField>

            <!-- 描述字段 -->
            <SmartFormField name="remark" label="描述" class="mb-4">
                <template #default="{ value, onInput, invalid }">
                    <Textarea id="remark" :modelValue="value"
                        @update:modelValue="(val) => onInput({ target: { value: val } })" rows="5" cols="30"
                        :autoResize="true" class="w-full" :class="{ 'p-invalid': invalid }" placeholder="请输入字典描述" />
                </template>
            </SmartFormField>

            <!-- 按钮组 -->
            <div class="flex justify-end gap-2">
                <Button type="button" label="重置" icon="pi pi-refresh" severity="secondary" outlined
                    @click="resetForm" />
                <Button type="submit" label="创建" icon="pi pi-check" :disabled="invalid" />
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

.field {
    margin-bottom: 1rem;
}

.form-label {
    font-weight: 500;
    margin-bottom: 0.5rem;
    display: block;
}
</style>
