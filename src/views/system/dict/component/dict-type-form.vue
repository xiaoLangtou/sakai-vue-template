<script setup lang="ts">
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
    status: 1,
});

// 字典项数据
const dictItems = ref<IDictData[]>([]);
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
            (val) => ['BUSINESS', 'SYSTEM'].includes(val),
            { message: '字典类型必须是业务字典或系统字典' }
        ),
    dictDesc: z.string().optional(),
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
        dictName: data.dictName || "",
        dictCode: data.dictCode || "",
        dictDesc: data.dictDesc || "",
        systemFlag: data.systemFlag || "",
        status: data.status !== undefined ? data.status : 1
    };

    drawerVisible.value = true;

    // 在下一个tick中重置表单状态，确保表单正确初始化
    await nextTick()
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
        globalToast.error("请检查表单字段", '验证失败');
        return;
    }

    try {
        // 创建字典类型
        console.log(initialDictTypeValue.value)
        const typeResult = await to(initialDictTypeValue.value.id ? dictTypeService.updateDictType({ ...values, id: initialDictTypeValue.value.id }) : dictTypeService.addDictType(values));
        if (!typeResult.ok) {
            globalToast.error(`【${values.dictName}】字典创建失败`, "提交失败");
            return;
        }
        emit("success");
        closeDrawer();
    } catch (error) {
        console.error('表单提交错误:', error);
        globalToast.error('提交过程中发生错误', "提交失败");
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
</script>

<template>
    <CustomDrawer
v-model:visible="drawerVisible" header="新建字典" width-type="extra-large" :show-default-footer="false"
        class="!w-[800px]">
        <Form
ref="formRef" :initial-values="initialDictTypeValue" :resolver="zodResolver(dictTypeSchema)"
            :validate-on-value-update="false" :validate-on-blur="false" :validate-on-mount="false" class="form-grid"
            @keydown.enter.prevent @validate="handleFormValidation" @submit="onFormSubmit">
            <!-- 字典名称字段 -->
            <SmartFormField name="dictName" label="字典名称" required class="mb-4">
                <template #default="{ value, onInput, invalid }">
                    <InputText
id="dictName" :model-value="value" placeholder="请输入字典名称，如：用户状态" autofocus class="w-full"
                        :class="{ 'p-invalid': invalid }"
                        @update:model-value="(val) => onInput({ target: { value: val } })" />
                </template>
            </SmartFormField>
            <!-- 字典编码字段 -->
            <SmartFormField name="dictCode" label="字典编码" required class="mb-4">
                <template #default="{ value, onInput, invalid }">
                    <InputText
id="dictCode" :model-value="value" placeholder="请输入字典编码，如：user_status" class="w-full"
                        :class="{ 'p-invalid': invalid }"
                        @update:model-value="(val) => onInput({ target: { value: val } })" />
                </template>
            </SmartFormField>
            <!-- 字典类型字段 -->
            <SmartFormField name="systemFlag" label="字典类型" required class="mb-4">
                <template #default="{ value, onInput, invalid }">
                    <Select
id="systemFlag" :model-value="value"
                        :options="[{ label: '业务字典', value: 'BUSINESS' }, { label: '系统字典', value: 'SYSTEM' }]"
                        option-label="label" option-value="value" placeholder="选择字典类型" class="w-full"
                        :class="{ 'p-invalid': invalid }"
                        @update:model-value="(val) => onInput({ target: { value: val } })" />
                </template>
            </SmartFormField>

            <!-- 状态字段 -->
            <SmartFormField name="status" label="状态" class="mb-4">
                <template #default="{ value, onInput, invalid }">
                    <Select
id="status" :model-value="value" :options="statusOptions" option-label="label"
                        option-value="value" placeholder="选择状态" class="w-full" :class="{ 'p-invalid': invalid }"
                        @update:model-value="(val) => onInput({ target: { value: val } })" />
                </template>
            </SmartFormField>

            <!-- 描述字段 -->
            <SmartFormField name="dictDesc" label="描述" class="mb-4">
                <template #default="{ value, onInput, invalid }">
                    <Textarea
id="dictDesc" :model-value="value" rows="5" cols="30" :auto-resize="true" class="w-full"
                        :class="{ 'p-invalid': invalid }" placeholder="请输入字典描述"
                        @update:model-value="(val) => onInput({ target: { value: val } })" />
                </template>
            </SmartFormField>

        </Form>
        <!-- 按钮组 -->
        <template #footer>
            <div class="flex justify-between items-center">
                <div class="text-sm text-gray-500">请确保信息填写完整</div>
                <div class="flex gap-3">
                    <Button
type="button" label="重置" icon="pi pi-refresh" severity="secondary" outlined
                        @click="resetForm" />
                    <Button type="button" label="创建" icon="pi pi-check" :disabled="invalid" @click="handleSubmit" />
                </div>
            </div>
        </template>
    </CustomDrawer>
</template>

<style scoped>
.drawer-form {
    max-width: 100%;
}

.form-grid {
    display: flex;
    flex-direction: column;
    padding: 1rem;
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
