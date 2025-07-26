<script setup lang="ts">
import { SmartFormField } from '@/components';
import CustomDrawer from '@/components/custom-drawer/index.vue';
import OrgSelector from '@/components/org-selector/index.vue';
import { zodResolver } from '@/composables/useForm';
import type { RoleFormData, RoleStatus, RoleType } from '@/types/role';
import { Form } from '@primevue/forms';
import { useToast } from 'primevue/usetoast';
import { computed, ref, watch } from 'vue';
import { z } from 'zod';


// 常量定义
const TYPE_ICONS = {
    system: 'pi pi-cog',
    business: 'pi pi-briefcase',
    custom: 'pi pi-user-edit'
} as const;

const SCOPE_ICONS = {
    all: 'pi pi-globe',
    dept: 'pi pi-building',
    user: 'pi pi-user'
} as const;

// Props
interface Props {
    visible: boolean;
    formData: Partial<RoleFormData>;
    statusOptions: Array<{ label: string; value: RoleStatus }>;
    typeOptions: Array<{ label: string; value: RoleType }>;
    dataScopeOptions: Array<{ label: string; value: string; description: string }>;
}

const props = withDefaults(defineProps<Props>(), {
    visible: false
});

// Emits
interface Emits {
    'update:visible': [value: boolean];
    submit: [formData: Partial<RoleFormData>];
    reset: [];
}

const emit = defineEmits<Emits>();

// 响应式状态
const toast = useToast();
const invalid = ref(false);
const isSubmitting = ref(false);
const formRef = ref<InstanceType<typeof Form> | null>(null);

// 自定义数据权限相关状态
const showCustomDataScope = ref(false);
const selectedDepts = ref<any[]>([]);
const selectedUsers = ref<any[]>([]);
const customDataScopeType = ref<'dept' | 'user'>('dept');
const orgSelectorVisible = ref(false);

// 模拟组织架构数据
const orgData = ref({
  children: [
    {
      id: '1',
      name: '总公司',
      type: 'department' as const,
      isChecked: false,
      level: 0,
      children: [
        {
          id: '1-1',
          name: '技术部',
          type: 'department' as const,
          isChecked: false,
          level: 1,
          parent: '1',
          staffs: [
            {
              idStaff: 'staff-1',
              staffName: '张三',
              position: '前端工程师',
              type: 'staff' as const,
              isChecked: false,
              parent: '1-1'
            },
            {
              idStaff: 'staff-2',
              staffName: '李四',
              position: '后端工程师',
              type: 'staff' as const,
              isChecked: false,
              parent: '1-1'
            }
          ]
        },
        {
          id: '1-2',
          name: '市场部',
          type: 'department' as const,
          isChecked: false,
          level: 1,
          parent: '1',
          staffs: [
            {
              idStaff: 'staff-3',
              staffName: '王五',
              position: '市场专员',
              type: 'staff' as const,
              isChecked: false,
              parent: '1-2'
            }
          ]
        }
      ]
    }
  ]
});







// 计算属性
const drawerVisible = computed({
    get: () => props.visible,
    set: (value: boolean) => emit('update:visible', value)
});

const submitButtonLabel = computed(() => {
    if (isSubmitting.value) {
        return props.formData.id ? '更新中...' : '创建中...';
    }
    return props.formData.id ? '更新' : '创建';
});

// 表单初始值
const getInitialValues = () => {
    const initialValues = {
        id: props.formData.id,
        name: props.formData.name || '',
        code: props.formData.code || '',
        type: props.formData.type || 'business',
        status: props.formData.status !== undefined ? props.formData.status : 1,
        sort: props.formData.sort || 0,
        dataScope: props.formData.dataScope || 'all',
        remark: props.formData.remark || '',
        isDefault: props.formData.isDefault || false,
        customDepts: props.formData.customDepts || [],
        customUsers: props.formData.customUsers || []
    };

    // 初始化自定义数据权限状态
    if (initialValues.dataScope === 'custom') {
        showCustomDataScope.value = true;
        selectedDepts.value = initialValues.customDepts;
        selectedUsers.value = initialValues.customUsers;
        customDataScopeType.value = selectedDepts.value.length > 0 ? 'dept' : 'user';
    } else {
        showCustomDataScope.value = false;
        selectedDepts.value = [];
        selectedUsers.value = [];
        customDataScopeType.value = 'dept';
    }

    return initialValues;
};

// 增强的表单验证
const roleSchema = z.object({
    name: z
        .string()
        .min(1, { message: '角色名称不能为空' })
        .max(50, { message: '角色名称不能超过50个字符' })
        .refine((val) => !/^\s+$/.test(val), { message: '角色名称不能只包含空格' }),
    code: z
        .string()
        .min(1, { message: '角色编码不能为空' })
        .max(30, { message: '角色编码不能超过30个字符' })
        .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, { message: '角色编码必须以字母开头，只能包含字母、数字和下划线' }),
    type: z.string(),
    status: z.number(),
    sort: z.number().min(0).max(999).optional(),
    dataScope: z.string(),
    remark: z.string().max(500, { message: '备注不能超过500个字符' }).optional(),
    isDefault: z.boolean().optional(),
    customDepts: z.array(z.any()).optional(),
    customUsers: z.array(z.any()).optional()
});

// 工具函数
const getTypeIcon = (type: string) => TYPE_ICONS[type as keyof typeof TYPE_ICONS] || 'pi pi-question';

const getScopeIcon = (scope: string) => SCOPE_ICONS[scope as keyof typeof SCOPE_ICONS] || 'pi pi-circle';

const getDataScopeSeverity = (scope: string) => {
    switch (scope) {
        case 'all': return 'success';
        case 'dept': return 'info';
        case 'user': return 'warning';
        case 'custom': return 'secondary';
        default: return 'secondary';
    }
};



const getStatusSeverity = (status: number) => {
    return status === 1 ? 'success' : 'danger';
};

const generateCode = (name: string, onInput: Function) => {
    if (!name.trim()) return;

    // 简单的拼音转换逻辑（实际项目中可能需要更完善的拼音库）
    const code = name
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')
        .substring(0, 20);

    onInput({ target: { value: code } });
};

const handleCodeInput = (value: string, onInput: Function) => {
    // 自动转换为小写并过滤非法字符
    const cleanValue = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    onInput({ target: { value: cleanValue } });
}

// 自定义数据权限相关处理函数
const handleDataScopeChange = (event: any) => {
    const value = event.value;
    showCustomDataScope.value = value === 'custom';
    if (value !== 'custom') {
        // 清空自定义权限数据
        selectedDepts.value = [];
        selectedUsers.value = [];
        customDataScopeType.value = 'dept';
    }
};

const handleCustomDataScopeTypeChange = (type: 'dept' | 'user') => {
    customDataScopeType.value = type;
    // 清空另一种类型的选择
    if (type === 'dept') {
        selectedUsers.value = [];
    } else {
        selectedDepts.value = [];
    }
};

const handleOrgSelectorChange = (selectedItems: any[]) => {
    if (customDataScopeType.value === 'dept') {
        selectedDepts.value = selectedItems.filter(item => item.type === 'department');
    } else {
        selectedUsers.value = selectedItems.filter(item => item.type === 'staff');
    }
};

const openOrgSelector = () => {
    orgSelectorVisible.value = true;
};

const getOrgItemName = (item: any) => {
    return item.type === 'department' ? item.name : item.staffName;
};

const removeOrgItem = (index: number) => {
    if (customDataScopeType.value === 'dept') {
        selectedDepts.value.splice(index, 1);
    } else {
        selectedUsers.value.splice(index, 1);
    }
};



// 监听属性变化
watch(
    () => props.formData,
    (newVal) => {
        if (formRef.value) {
            const newValues = {
                id: newVal.id,
                name: newVal.name || '',
                code: newVal.code || '',
                type: newVal.type || 'business',
                status: newVal.status !== undefined ? newVal.status : 1,
                sort: newVal.sort || 0,
                dataScope: newVal.dataScope || 'all',
                remark: newVal.remark || '',
                isDefault: newVal.isDefault || false,
                customDepts: newVal.customDepts || [],
                customUsers: newVal.customUsers || []
            };

            // 更新自定义数据权限状态
            if (newValues.dataScope === 'custom') {
                showCustomDataScope.value = true;
                selectedDepts.value = newValues.customDepts;
                selectedUsers.value = newValues.customUsers;
                customDataScopeType.value = selectedDepts.value.length > 0 ? 'dept' : 'user';
            } else {
                showCustomDataScope.value = false;
                selectedDepts.value = [];
                selectedUsers.value = [];
                customDataScopeType.value = 'dept';
            }

            const form = formRef.value as any;
            if (form.setValues) {
                form.setValues(newValues);
            }
        }
    },
    { deep: true }
);

// 事件处理函数
const closeDrawer = () => {
    if (!isSubmitting.value) {
        emit('update:visible', false);
    }
};

const resetForm = () => {
    if (formRef.value && !isSubmitting.value) {
        const form = formRef.value as any;
        if (form.reset) {
            form.reset();
        }
        emit('reset');
        toast.add({
            severity: 'info',
            summary: '提示',
            detail: '表单已重置',
            life: 2000
        });
    }
};

const onFormSubmit = async ({ valid, values }: { valid: boolean; values: any }) => {
    if (!valid || isSubmitting.value) return;

    try {
        isSubmitting.value = true;

        // 处理自定义数据权限
        if (values.dataScope === 'custom') {
            if (customDataScopeType.value === 'dept') {
                values.customDepts = selectedDepts.value;
                values.customUsers = [];
            } else {
                values.customDepts = [];
                values.customUsers = selectedUsers.value;
            }
        } else {
            values.customDepts = [];
            values.customUsers = [];
        }

        // 模拟提交延迟
        await new Promise((resolve) => setTimeout(resolve, 1000));

        emit('submit', values);

        toast.add({
            severity: 'success',
            summary: '成功',
            detail: props.formData.id ? '角色信息已更新' : '角色已创建',
            life: 3000
        });

        closeDrawer();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: '操作失败',
            detail: error instanceof Error ? error.message : '操作失败，请稍后重试',
            life: 5000
        });
    } finally {
        isSubmitting.value = false;
    }
};

/*
 * 手动触发表单提交
 */
const handleFormSubmit = () => {
    if (formRef.value) {
        const form = formRef.value as any;
        if (form.$el && typeof form.$el.requestSubmit === 'function') {
            form.$el.requestSubmit();
        } else {
            // 触发表单的submit事件
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            form.$el?.dispatchEvent(submitEvent);
        }
    }
};
</script>

<template>
    <CustomDrawer v-model:visible="drawerVisible" :header="formData.id ? '编辑角色' : '新增角色'" :modal="true" :dismissable="!isSubmitting"
        position="right" class="!w-[800px]" @hide="closeDrawer">
        <div class="flex-1 overflow-y-auto">
            <Form ref="formRef" :resolver="zodResolver(roleSchema)" :default-values="getInitialValues()"
                @submit="onFormSubmit" class="space-y-6">
                <!-- 基本信息 -->
                <Fieldset legend="基本信息" :toggleable="true" class="mb-4">
                    <template #legend="{ toggleCallback }">
                        <div class="flex items-center gap-2 cursor-pointer" @click="toggleCallback">
                            <i class="pi pi-user text-blue-500"></i>
                            <span class="text-base font-medium text-gray-800">基本信息</span>
                        </div>
                    </template>

                    <div class="space-y-3 pt-4 pb-4">
                         <!-- 角色名称 -->
                         <SmartFormField name="name" label="角色名称" required>
                             <template #default="{ field }">
                                 <InputText v-model="field.value" placeholder="请输入角色名称，如：系统管理员"
                                     class="w-full" :invalid="field.invalid" />
                             </template>
                         </SmartFormField>

                         <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                             <!-- 角色编码 -->
                             <SmartFormField name="code" label="角色编码" required
                                 description="编码将用于系统内部标识，建议使用英文字母">
                                 <template #default="{ field }">
                                     <div class="p-inputgroup">
                                         <InputText v-model="field.value" placeholder="请输入角色编码，如：admin"
                                             class="w-full" :invalid="field.invalid"
                                             @input="(e) => handleCodeInput((e.target as HTMLInputElement)?.value || '', (val) => field.value = val.target.value)" />
                                         <Button type="button" icon="pi pi-refresh" severity="secondary" outlined
                                             @click="generateCode(field.value ?? '', (val) => field.value = val.target.value)"
                                             :disabled="!field.value" v-tooltip.top="'根据角色名称生成编码'" />
                                     </div>
                                 </template>
                             </SmartFormField>

                             <!-- 角色类型 -->
                             <SmartFormField name="type" label="角色类型">
                                 <template #default="{ field }">
                                     <Select v-model="field.value" :options="typeOptions" optionLabel="label"
                                         optionValue="value" placeholder="请选择角色类型" class="w-full"
                                         :invalid="field.invalid">
                                         <template #option="slotProps">
                                             <div class="flex items-center gap-2">
                                                 <i :class="getTypeIcon(slotProps.option.value)" class="text-sm"></i>
                                                 <span>{{ slotProps.option.label }}</span>
                                             </div>
                                         </template>
                                     </Select>
                                 </template>
                             </SmartFormField>
                         </div>
                     </div>
                 </Fieldset>

                <!-- 权限配置 -->
                <Fieldset legend="权限配置" :toggleable="true" class="mb-4">
                    <template #legend="{ toggleCallback }">
                        <div class="flex items-center gap-2 cursor-pointer" @click="toggleCallback">
                            <i class="pi pi-lock text-green-500"></i>
                            <span class="text-base font-medium text-gray-800">权限配置</span>
                        </div>
                    </template>

                    <div class="space-y-3 pt-4 pb-4">
                         <!-- 数据权限 -->
                         <SmartFormField name="dataScope" label="数据权限" description="选择角色可访问的数据范围">
                             <template #default="{ field }">
                                 <div class="space-y-4">
                                     <!-- 数据权限选择器 -->
                                     <Select v-model="field.value" :options="dataScopeOptions" optionLabel="label"
                                         optionValue="value" placeholder="请选择数据权限范围" class="w-full"
                                         :invalid="field.invalid" @change="handleDataScopeChange">
                                         <template #value="slotProps">
                                             <div v-if="slotProps.value" class="flex items-center gap-2">
                                                 <i :class="getScopeIcon(slotProps.value)" class="text-sm"></i>
                                                 <span>{{ dataScopeOptions.find(opt => opt.value === slotProps.value)?.label }}</span>
                                                 <Tag :value="slotProps.value" :severity="getDataScopeSeverity(slotProps.value)" class="ml-auto" />
                                             </div>
                                         </template>
                                         <template #option="slotProps">
                                             <div class="flex flex-col gap-1 py-2">
                                                 <div class="flex items-center justify-between">
                                                     <div class="flex items-center gap-2">
                                                         <i :class="getScopeIcon(slotProps.option.value)" class="text-sm"></i>
                                                         <span class="font-medium">{{ slotProps.option.label }}</span>
                                                     </div>
                                                     <Tag :value="slotProps.option.value" :severity="getDataScopeSeverity(slotProps.option.value)" />
                                                 </div>
                                                 <small class="text-gray-500 ml-5">{{ slotProps.option.description }}</small>
                                             </div>
                                         </template>
                                     </Select>

                                     <!-- 自定义数据权限配置 -->
                                     <div v-if="showCustomDataScope" class="custom-data-scope-config">
                                         <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                             <div class="mb-4">
                                                 <h4 class="text-sm font-medium text-gray-700 mb-3">自定义数据权限配置</h4>

                                                 <!-- 权限类型选择 -->
                                                 <div class="flex gap-4 mb-4">
                                                     <div class="flex items-center">
                                                         <RadioButton
                                                             v-model="customDataScopeType"
                                                             inputId="dept-permission"
                                                             value="dept"
                                                             @change="() => handleCustomDataScopeTypeChange('dept')"
                                                         />
                                                         <label for="dept-permission" class="ml-2 text-sm text-gray-700">部门权限</label>
                                                     </div>
                                                     <div class="flex items-center">
                                                         <RadioButton
                                                             v-model="customDataScopeType"
                                                             inputId="user-permission"
                                                             value="user"
                                                             @change="() => handleCustomDataScopeTypeChange('user')"
                                                         />
                                                         <label for="user-permission" class="ml-2 text-sm text-gray-700">用户权限</label>
                                                     </div>
                                                 </div>

                                                 <!-- 组织架构选择器 -->
                                                 <div class="mb-4">
                                                     <div class="flex items-center justify-between mb-2">
                                                         <label class="text-sm font-medium text-gray-700">
                                                             {{ customDataScopeType === 'dept' ? '选择部门' : '选择用户' }}
                                                         </label>
                                                         <Button
                                                             type="button"
                                                             icon="pi pi-plus"
                                                             label="选择"
                                                             size="small"
                                                             outlined
                                                             @click="openOrgSelector"
                                                         />
                                                     </div>

                                                     <!-- 已选择的项目预览 -->
                                                     <div class="min-h-[60px] border border-gray-200 rounded p-3 bg-white">
                                                         <div v-if="(customDataScopeType === 'dept' ? selectedDepts : selectedUsers).length === 0"
                                                              class="text-gray-400 text-sm text-center py-2">
                                                             暂未选择任何{{ customDataScopeType === 'dept' ? '部门' : '用户' }}
                                                         </div>
                                                         <div v-else class="flex flex-wrap gap-2">
                                                             <Chip
                                                                 v-for="(item, index) in (customDataScopeType === 'dept' ? selectedDepts : selectedUsers)"
                                                                 :key="index"
                                                                 :label="getOrgItemName(item)"
                                                                 removable
                                                                 @remove="removeOrgItem(index)"
                                                             />
                                                         </div>
                                                     </div>
                                                 </div>

                                                 <!-- 权限预览 -->
                                                 <div class="bg-blue-50 p-3 rounded border border-blue-200">
                                                     <div class="flex items-start gap-2">
                                                         <i class="pi pi-info-circle text-blue-600 mt-0.5"></i>
                                                         <div>
                                                             <div class="text-sm font-medium text-blue-700 mb-1">权限预览</div>
                                                             <div class="text-xs text-blue-600">
                                                                 <span v-if="customDataScopeType === 'dept' && selectedDepts.length > 0">
                                                                     该角色可以访问 {{ selectedDepts.length }} 个部门的数据
                                                                 </span>
                                                                 <span v-else-if="customDataScopeType === 'user' && selectedUsers.length > 0">
                                                                     该角色可以访问 {{ selectedUsers.length }} 个用户的数据
                                                                 </span>
                                                                 <span v-else>
                                                                     请选择具体的{{ customDataScopeType === 'dept' ? '部门' : '用户' }}权限
                                                                 </span>
                                                             </div>
                                                         </div>
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                     </div>

                                 </div>
                             </template>
                         </SmartFormField>

                         <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                             <!-- 状态 -->
                             <SmartFormField name="status" label="状态">
                                 <template #default="{ field }">
                                     <Select v-model="field.value" :options="statusOptions" optionLabel="label"
                                          optionValue="value" placeholder="请选择状态" class="w-full"
                                          :invalid="field.invalid">
                                          <template #option="slotProps">
                                              <div class="flex items-center gap-2">
                                                  <Tag :value="slotProps.option.label"
                                                      :severity="getStatusSeverity(slotProps.option.value)" />
                                              </div>
                                          </template>
                                      </Select>
                                  </template>
                              </SmartFormField>

                              <!-- 排序 -->
                              <SmartFormField name="sort" label="排序" description="数值越小排序越靠前">
                                  <template #default="{ field }">
                                      <InputNumber v-model="field.value" :min="0" :max="999"
                                          placeholder="排序值" class="w-full" :invalid="field.invalid"
                                          showButtons :step="1" />
                                  </template>
                              </SmartFormField>
                          </div>

                          <!-- 设为默认角色 -->
                          <div class="flex items-center gap-3">
                              <SmartFormField name="isDefault" label="设为默认角色"
                                  description="新用户注册时自动分配此角色">
                                  <template #default="{ field }">
                                      <InputSwitch v-model="field.value" />
                                  </template>
                              </SmartFormField>
                          </div>
                      </div>
                  </Fieldset>

                <!-- 备注信息 -->
                <Fieldset legend="备注信息" :toggleable="true" class="mb-4">
                    <template #legend="{ toggleCallback }">
                        <div class="flex items-center gap-2 cursor-pointer" @click="toggleCallback">
                            <i class="pi pi-comment text-purple-500"></i>
                            <span class="text-base font-medium text-gray-800">备注信息</span>
                        </div>
                    </template>

                    <div class="space-y-3 pt-4 pb-4">
                        <!-- 备注 -->
                        <SmartFormField name="remark" label="备注">
                            <template #default="{ field }">
                                <Textarea v-model="field.value" rows="4" :autoResize="true"
                                    placeholder="请输入角色备注信息..." :maxlength="500"
                                    class="w-full" :invalid="field.invalid" />
                                <div class="text-right mt-1">
                                    <small class="text-gray-500">{{ (field.value || '').length }}/500</small>
                                </div>
                            </template>
                        </SmartFormField>
                    </div>
                </Fieldset>
            </Form>
        </div>

        <!-- 底部操作按钮 -->
        <template #footer>
           <Button type="button" label="取消" icon="pi pi-times" severity="secondary" outlined
                        :disabled="isSubmitting" @click="closeDrawer" class="action-button" />
                    <Button type="button" label="重置" icon="pi pi-refresh" severity="secondary" outlined
                        :disabled="isSubmitting" @click="resetForm" class="action-button" />
                    <Button type="button" :label="submitButtonLabel"
                        :icon="isSubmitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
                        :disabled="invalid || isSubmitting" :loading="isSubmitting" @click="handleFormSubmit"
                        class="action-button primary-button" />
        </template>
    </CustomDrawer>

    <!-- 组织架构选择器弹窗 -->
    <OrgSelector
        v-model:visible="orgSelectorVisible"
        :data="orgData"
        :mode="'modal'"
        :multiple="true"
        :only-select-person="customDataScopeType === 'user'"
        @change="handleOrgSelectorChange"
    />
</template>

<style lang="scss" scoped>
.form-container {
    padding: 1rem;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 1rem;
    border-top: 1px solid var(--surface-border);
    background: var(--surface-ground);
}

.form-actions .p-button {
    min-width: 80px;
}

.status-badge {
    font-weight: 600;
}

.data-scope-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 6px;
    transition: all 0.2s;
}

.data-scope-option:hover {
    background: var(--surface-hover);
}

.data-scope-option .p-tag {
    font-size: 0.75rem;
}

.data-scope-option .description {
    color: var(--text-color-secondary);
    font-size: 0.875rem;
    margin-top: 0.25rem;
}



/* 抽屉底部样式 */
.drawer-footer {
    padding: 1rem;
    border-top: 1px solid var(--surface-border);
    background: var(--surface-ground);
}
</style>
