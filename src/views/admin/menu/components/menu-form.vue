<script setup lang="ts">
import { CustomDrawer, IconSelector, SmartFormField } from '@/components';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import type { MenuFormData, MenuTreeNode } from '@/types/menu';
import { Form } from '@primevue/forms';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Fieldset from 'primevue/fieldset';
import InputNumber from 'primevue/inputnumber';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import TreeSelect from 'primevue/treeselect';
import { useToast } from 'primevue/usetoast';
import { computed, ref, watch } from 'vue';
import { z } from 'zod';
import ButtonSelector from './ButtonSelector.vue';

interface Props {
    /** 弹窗显示状态 */
    visible: boolean;
    /** 弹窗标题 */
    title: string;
    /** 表单数据 */
    formData: MenuFormData;
    /** 父级菜单选项 */
    parentMenuOptions: MenuTreeNode[];
    /** 加载状态 */
    loading?: boolean;
}

interface Emits {
    (e: 'update:visible', value: boolean): void;
    (e: 'update:formData', data: MenuFormData): void;
    (e: 'submit', data: MenuFormData): void;
    (e: 'close'): void;
    (e: 'reset'): void;
    (e: 'batchAddButtons', buttons: any[]): void;
}

const props = withDefaults(defineProps<Props>(), {
    loading: false
});

const emit = defineEmits<Emits>();
const toast = useToast();

// Zod 验证模式
const menuFormSchema = z
    .object({
        name: z.string().min(1, '请输入菜单名称'),
        type: z.enum(['directory', 'menu', 'button'], {
            message: '请选择菜单类型'
        }),
        icon: z.string().optional(),
        parentId: z.number().optional(),
        path: z.string().optional(),
        component: z.string().optional(),
        permission: z.string().optional(),
        isExternal: z.boolean().default(false),
        externalUrl: z.string().optional(),
        sort: z.number().min(0).max(9999).default(0),
        status: z.number().default(1),
        visible: z.boolean().default(true),
        remark: z.string().optional(),
        buttons: z
            .array(
                z.object({
                    id: z.union([z.string(), z.number()]),
                    name: z.string(),
                    permission: z.string(),
                    icon: z.string(),
                    sort: z.number()
                })
            )
            .optional()
            .default([])
    })
    .refine(
        (data) => {
            // 菜单类型为menu且非外链时，路由路径必填
            if (data.type === 'menu' && !data.isExternal && !data.path?.trim()) {
                return false;
            }
            return true;
        },
        {
            message: '请输入路由路径',
            path: ['path']
        }
    )
    .refine(
        (data) => {
            // 外链时，外链地址必填且格式正确
            if (data.isExternal) {
                if (!data.externalUrl?.trim()) {
                    return false;
                }
                const urlPattern = /^https?:\/\/.+/;
                if (!urlPattern.test(data.externalUrl.trim())) {
                    return false;
                }
            }
            return true;
        },
        {
            message: '请输入有效的外链地址',
            path: ['externalUrl']
        }
    );

// 计算属性
const dialogVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
});

// 计算属性 - 显示路由字段
const showRouteFields = computed(() => {
    return props.formData && props.formData.type === 'menu';
});

// 计算属性 - 显示批量添加按钮功能
const showBatchButtonFeature = computed(() => {
    return props.formData && props.formData.type === 'menu' && !props.formData.id;
});

// 转换菜单数据为 TreeSelect 期望的格式
const convertMenuToTreeSelectFormat = (menus: MenuTreeNode[]): any[] => {
    return menus.map((menu) => ({
        key: menu.id?.toString() || menu.name, // 使用菜单ID作为key，如果没有ID则使用name
        label: menu.name,
        icon: menu.icon,
        data: menu,
        children: menu.children ? convertMenuToTreeSelectFormat(menu.children) : undefined
    }));
};

// 计算属性 - 父级菜单选项
const computedParentMenuOptions = computed(() => {
    return convertMenuToTreeSelectFormat(props.parentMenuOptions || []);
});

// 获取初始值函数
const getInitialValues = () => ({
    id: props.formData?.id || 0,
    name: props.formData?.name || '',
    type: props.formData?.type || 'menu',
    icon: props.formData?.icon || '',
    parentId: props.formData?.parentId || 0,
    path: props.formData?.path || '',
    component: props.formData?.component || '',
    permission: props.formData?.permission || '',
    isExternal: props.formData?.isExternal || false,
    externalUrl: props.formData?.externalUrl || '',
    sort: props.formData?.sort || 0,
    status: props.formData?.status || 1,
    visible: props.formData?.visible !== undefined ? props.formData.visible : true,
    remark: props.formData?.remark || '',
    buttons: props.formData?.buttons || []
});

// 表单验证处理
const handleFormValidation = zodResolver(menuFormSchema);

// 表单引用
const formRef = ref();

// 监听 formData 变化，更新表单值
watch(
    () => props.formData,
    () => {
        if (formRef.value && props.visible) {
            formRef.value.reset();
        }
    },
    { deep: true }
);

// 关闭对话框
const closeDialog = () => {
    dialogVisible.value = false;
};

// 表单提交处理
const onFormSubmit = (event: any) => {
    if (event.valid) {
        emit('submit', event.values as MenuFormData);
    }
};

// 重置表单
const resetForm = () => {
    formRef.value?.reset();
    emit('reset');
};

// 菜单类型选项
const menuTypeOptions = [
    { label: '目录', value: 'directory' },
    { label: '菜单', value: 'menu' },
    { label: '按钮', value: 'button' }
];

// 状态选项
const statusOptions = [
    { label: '启用', value: 1 },
    { label: '禁用', value: 0 }
];

// 批量添加按钮相关状态
const batchButtonVisible = ref(false);

// 生成唯一ID的工具函数
const generateId = () => {
    return Date.now() + Math.random();
};

// 响应式表单数据
const formData = computed({
    get: () => props.formData,
    set: (value) => emit('update:formData', value)
});

// 按钮数量计算属性
const buttonsCount = computed(() => {
    return formData.value?.buttons?.length || 0;
});

// 打开批量添加按钮对话框
const openBatchButtonDialog = () => {
    batchButtonVisible.value = true;
};

// 确认批量添加按钮
const confirmBatchAddButtons = (buttonsToAdd: any[]) => {
    const updatedFormData = { ...formData.value };
    if (!updatedFormData.buttons) {
        updatedFormData.buttons = [];
    }

    buttonsToAdd.forEach((button) => {
        const newButton = {
            id: generateId(),
            name: button.name,
            permission: button.permission,
            icon: button.icon,
            sort: button.sort
        };
        updatedFormData.buttons!.push(newButton);
    });

    emit('update:formData', updatedFormData);
    batchButtonVisible.value = false;

    toast.add({
        severity: 'success',
        summary: '成功',
        detail: `已添加 ${buttonsToAdd.length} 个按钮`,
        life: 3000
    });
};

// 发送批量添加按钮事件
const handleBatchAddButtons = (buttonsToAdd: any[]) => {
    emit('batchAddButtons', buttonsToAdd);
};

// 自定义按钮对话框状态
const customButtonVisible = ref(false);
const editingButtonIndex = ref(-1);
const customButtonForm = ref({
    name: '',
    permission: '',
    icon: 'pi pi-circle',
    sort: 0
});

// 打开自定义按钮对话框
const openCustomButtonDialog = () => {
    editingButtonIndex.value = -1;
    customButtonForm.value = {
        name: '',
        permission: '',
        icon: 'pi pi-circle',
        sort: 0
    };
    customButtonVisible.value = true;
};

// 编辑按钮
const editButton = (index: number) => {
    const button = formData.value.buttons?.[index];
    if (button) {
        editingButtonIndex.value = index;
        customButtonForm.value = {
            name: button.name,
            permission: button.permission,
            icon: button.icon,
            sort: button.sort
        };
        customButtonVisible.value = true;
    }
};

// 删除按钮
const removeButton = (index: number) => {
    const updatedFormData = { ...formData.value };
    if (updatedFormData.buttons) {
        updatedFormData.buttons.splice(index, 1);
        emit('update:formData', updatedFormData);
    }
};

// 确认添加/编辑自定义按钮
const confirmCustomButton = () => {
    if (!customButtonForm.value.name.trim() || !customButtonForm.value.permission.trim()) {
        toast.add({
            severity: 'warn',
            summary: '提示',
            detail: '请填写按钮名称和权限标识',
            life: 3000
        });
        return;
    }

    const updatedFormData = { ...formData.value };
    if (!updatedFormData.buttons) {
        updatedFormData.buttons = [];
    }

    const buttonData = {
        id: editingButtonIndex.value >= 0 ? updatedFormData.buttons[editingButtonIndex.value].id : generateId(),
        name: customButtonForm.value.name.trim(),
        permission: customButtonForm.value.permission.trim(),
        icon: customButtonForm.value.icon,
        sort: customButtonForm.value.sort
    };

    if (editingButtonIndex.value >= 0) {
        // 编辑模式
        updatedFormData.buttons[editingButtonIndex.value] = buttonData;
    } else {
        // 新增模式
        updatedFormData.buttons.push(buttonData);
    }

    emit('update:formData', updatedFormData);
    customButtonVisible.value = false;

    toast.add({
        severity: 'success',
        summary: '成功',
        detail: editingButtonIndex.value >= 0 ? '按钮编辑成功' : '按钮添加成功',
        life: 3000
    });
};

// 取消自定义按钮操作
const cancelCustomButton = () => {
    customButtonVisible.value = false;
};
</script>

<template>
    <CustomDrawer
v-model:visible="dialogVisible" :header="title" :modal="true" :dismissable="true" position="right"
        class="!w-[800px]" @hide="closeDialog">
        <div class="flex-1 overflow-y-auto">
            <Form
ref="formRef" :resolver="handleFormValidation" :default-values="getInitialValues()"
                class="space-y-6" @submit="onFormSubmit">
                <!-- 基础信息 -->
                <Fieldset legend="基础信息" :toggleable="true" class="mb-4">
                    <template #legend="{ toggleCallback }">
                        <div class="flex items-center gap-2 cursor-pointer" @click="toggleCallback">
                            <i class="pi pi-info-circle text-blue-500"></i>
                            <span class="text-base font-medium text-gray-800">基础信息</span>
                        </div>
                    </template>

                    <div class="space-y-2 pt-4 pb-4">
                        <!-- 菜单名称 -->
                        <SmartFormField name="name" label="菜单名称" required>
                            <template #default="{ field }">
                                <InputText
v-model="field.value" placeholder="请输入菜单名称" class="w-full"
                                    :invalid="field.invalid" />
                            </template>
                        </SmartFormField>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <!-- 菜单类型 -->
                            <SmartFormField name="type" label="菜单类型" required>
                                <template #default="{ field }">
                                    <Select
v-model="field.value" :options="menuTypeOptions" option-label="label"
                                        option-value="value" placeholder="请选择菜单类型" class="w-full"
                                        :invalid="field.invalid" />
                                </template>
                            </SmartFormField>

                            <!-- 菜单图标 -->
                            <SmartFormField name="icon" label="菜单图标">
                                <template #default="{ field }">
                                    <IconSelector
v-model="field.value" mode="input" placeholder="请输入图标类名"
                                        :invalid="field.invalid" show-preview preview-text="图标预览" />
                                </template>
                            </SmartFormField>
                        </div>

                        <!-- 父级菜单 -->
                        <SmartFormField name="parentId" label="父级菜单">
                            <template #default="{ field }">
                                <TreeSelect
v-model="field.value" :options="computedParentMenuOptions" show-clear
                                    placeholder="请选择父级菜单（不选择则为顶级菜单）" class="w-full" filter
                                     filter-mode="lenient"
                                    filter-placeholder="搜索菜单"  />
                            </template>
                        </SmartFormField>
                    </div>
                </Fieldset>

                <!-- 路由信息 -->
                <Fieldset v-if="showRouteFields" legend="路由信息" :toggleable="true" class="mb-4">
                    <template #legend="{ toggleCallback }">
                        <div class="flex items-center gap-2 cursor-pointer" @click="toggleCallback">
                            <i class="pi pi-sitemap text-green-500"></i>
                            <span class="text-base font-medium text-gray-800">路由信息</span>
                        </div>
                    </template>

                    <div class="space-y-3 pt-4 pb-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <!-- 路由路径 -->
                            <SmartFormField name="path" label="路由路径">
                                <template #default="{ field }">
                                    <InputText
v-model="field.value" placeholder="如：/system/user" class="w-full"
                                        :invalid="field.invalid" />
                                </template>
                            </SmartFormField>

                            <!-- 组件路径 -->
                            <SmartFormField name="component" label="组件路径">
                                <template #default="{ field }">
                                    <InputText
v-model="field.value" placeholder="如：views/system/user/index.vue"
                                        class="w-full" :invalid="field.invalid" />
                                </template>
                            </SmartFormField>
                        </div>

                        <!-- 权限标识 -->
                        <SmartFormField name="permission" label="权限标识">
                            <template #default="{ field }">
                                <InputText
v-model="field.value" placeholder="如：system:user:list" class="w-full"
                                    :invalid="field.invalid" />
                            </template>
                        </SmartFormField>
                        <div class="text-sm text-gray-500 mt-1 flex items-center gap-2">
                            <i class="pi pi-info-circle"></i>
                            <span>用于权限控制，格式：模块:功能:操作</span>
                        </div>
                    </div>
                </Fieldset>

                <!-- 按钮管理区域 -->
                <Fieldset legend="按钮管理" :toggleable="true" class="mb-4">
                    <template #legend="{ toggleCallback }">
                        <div class="flex items-center gap-2 cursor-pointer" @click="toggleCallback">
                            <i class="pi pi-th-large text-indigo-500"></i>
                            <span class="text-base font-medium text-gray-800">按钮管理</span>
                        </div>
                    </template>

                    <div class="space-y-3 pt-4 pb-4">
                        <!-- 添加按钮操作区 -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <!-- 快速添加按钮 -->
                            <div
                                class="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200">
                                <div class="flex items-center gap-2">
                                    <i class="pi pi-bolt text-blue-600"></i>
                                    <div>
                                        <div class="text-sm font-medium text-blue-900">快速添加</div>
                                        <div class="text-xs text-blue-700">批量添加常用按钮</div>
                                    </div>
                                </div>
                                <Button label="快速添加" icon="pi pi-plus" size="small" @click="openBatchButtonDialog" />
                            </div>

                            <!-- 自定义添加按钮 -->
                            <div
                                class="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-300">
                                <div class="flex items-center gap-2">
                                    <i class="pi pi-plus-circle text-gray-600"></i>
                                    <div>
                                        <div class="text-sm font-medium text-gray-700">自定义添加</div>
                                        <div class="text-xs text-gray-500">添加自定义按钮</div>
                                    </div>
                                </div>
                                <Button
label="自定义按钮" icon="pi pi-plus" size="small" severity="secondary" outlined
                                    @click="openCustomButtonDialog" />
                            </div>
                        </div>

                        <!-- 已添加的按钮列表 -->
                        <div v-if="formData.buttons && formData.buttons.length > 0" class="space-y-2">
                            <div class="text-sm font-medium text-gray-700 mb-2">已添加的按钮 ({{ buttonsCount }}个)</div>

                            <div class="grid grid-cols-1 gap-2">
                                <div
v-for="(button, index) in formData.buttons" :key="button.id || index"
                                    class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded hover:border-blue-300 transition-colors">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <i :class="[button.icon, 'text-blue-600 text-sm']"></i>
                                        </div>
                                        <div>
                                            <div class="font-medium text-gray-800">{{ button.name }}</div>
                                            <div class="text-xs text-gray-500">权限：{{ button.permission }}</div>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <Button
v-tooltip.top="'编辑按钮'" icon="pi pi-pencil" size="small" severity="secondary"
                                            text @click="editButton(index)" />
                                        <Button
v-tooltip.top="'删除按钮'" icon="pi pi-trash" size="small" severity="danger"
                                            text @click="removeButton(index)" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 空状态 -->
                        <div v-else class="text-center py-6 text-gray-500">
                            <i class="pi pi-inbox text-2xl mb-2 block"></i>
                            <p class="text-sm">暂无按钮，点击上方按钮添加</p>
                        </div>
                    </div>
                </Fieldset>

                <!-- 外链配置 -->
                <Fieldset v-if="showRouteFields && formData.isExternal" legend="外链配置" :toggleable="true" class="mb-4">
                    <template #legend="{ toggleCallback }">
                        <div class="flex items-center gap-2 cursor-pointer" @click="toggleCallback">
                            <i class="pi pi-external-link text-orange-500"></i>
                            <span class="text-base font-medium text-gray-800">外链配置</span>
                        </div>
                    </template>

                    <div class="space-y-3 pt-4 pb-4">
                        <div class="flex items-center gap-3">
                            <SmartFormField name="isExternal" label="是否外链">
                                <template #default="{ field }">
                                    <InputSwitch v-model="field.value" />
                                </template>
                            </SmartFormField>
                        </div>

                        <SmartFormField name="externalUrl" label="外链地址">
                            <template #default="{ field }">
                                <InputText
v-model="field.value" placeholder="请输入外链地址（如：https://www.example.com）"
                                    class="w-full" :invalid="field.invalid" />
                            </template>
                        </SmartFormField>
                    </div>
                </Fieldset>

                <!-- 其他配置 -->
                <Fieldset legend="其他配置" :toggleable="true" class="mb-4">
                    <template #legend="{ toggleCallback }">
                        <div class="flex items-center gap-2 cursor-pointer" @click="toggleCallback">
                            <i class="pi pi-cog text-purple-500"></i>
                            <span class="text-base font-medium text-gray-800">其他配置</span>
                        </div>
                    </template>

                    <div class="space-y-3 pt-4 pb-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <!-- 显示排序 -->
                            <SmartFormField name="sort" label="显示排序">
                                <template #default="{ field }">
                                    <InputNumber
v-model="field.value" :min="0" :max="9999" placeholder="请输入排序值"
                                        class="w-full" :invalid="field.invalid" />
                                </template>
                            </SmartFormField>

                            <!-- 菜单状态 -->
                            <SmartFormField name="status" label="菜单状态">
                                <template #default="{ field }">
                                    <Select
v-model="field.value" :options="statusOptions" option-label="label"
                                        option-value="value" placeholder="请选择状态" class="w-full"
                                        :invalid="field.invalid" />
                                </template>
                            </SmartFormField>
                        </div>

                        <!-- 是否显示 -->
                        <div class="flex items-center gap-4">
                            <SmartFormField name="visible" label="是否显示">
                                <template #default="{ field }">
                                    <InputSwitch v-model="field.value" />
                                </template>
                            </SmartFormField>
                        </div>

                        <!-- 备注 -->
                        <SmartFormField name="remark" label="备注">
                            <template #default="{ field }">
                                <Textarea
v-model="field.value" placeholder="请输入备注信息" rows="3" class="w-full"
                                    :invalid="field.invalid" />
                            </template>
                        </SmartFormField>
                    </div>
                </Fieldset>
            </Form>
        </div>

        <template #footer>
            <div class="flex justify-between items-center">
                <div class="text-sm text-gray-500">请确保信息填写完整</div>
                <div class="flex gap-3">
                    <Button label="取消" severity="secondary" outlined @click="closeDialog" />
                    <Button label="重置" severity="secondary" outlined @click="resetForm" />
                    <Button label="确定" :loading="loading" type="submit" />
                </div>
            </div>
        </template>
    </CustomDrawer>

    <!-- 批量添加按钮弹窗 -->
    <ButtonSelector v-model:visible="batchButtonVisible" title="批量添加按钮" @confirm="confirmBatchAddButtons" />

    <!-- 自定义按钮对话框 -->
    <Dialog
v-model:visible="customButtonVisible" :header="editingButtonIndex >= 0 ? '编辑按钮' : '添加自定义按钮'" modal
        :style="{ width: '500px' }" :closable="true" :dismissable-mask="true">
        <div class="space-y-4">
            <!-- 按钮名称 -->
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">按钮名称 <span class="text-red-500">*</span></label>
                <InputText v-model="customButtonForm.name" placeholder="请输入按钮名称" class="w-full" />
            </div>

            <!-- 权限标识 -->
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">权限标识 <span class="text-red-500">*</span></label>
                <InputText v-model="customButtonForm.permission" placeholder="如：system:user:add" class="w-full" />
                <div class="text-xs text-gray-500">格式：模块:功能:操作</div>
            </div>



            <!-- 排序值 -->
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">排序值</label>
                <InputNumber v-model="customButtonForm.sort" :min="0" :max="9999" placeholder="请输入排序值" class="w-full" />
            </div>
        </div>

        <template #footer>
            <div class="flex justify-end gap-3">
                <Button label="取消" severity="secondary" outlined @click="cancelCustomButton" />
                <Button :label="editingButtonIndex >= 0 ? '保存' : '添加'" @click="confirmCustomButton" />
            </div>
        </template>
    </Dialog>
</template>

<style lang="scss" scoped>

</style>
