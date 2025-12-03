<script setup lang="ts">
import type { ButtonConfig } from '@/types/menu';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { computed, ref, watch } from 'vue';

interface Props {
    /** 弹窗显示状态 */
    visible: boolean;
    /** 可选按钮 */
    buttons?: ButtonConfig[];
    /** 弹窗标题 */
    title: string;
    /** 描述文本 */
    description?: string;
    /** 抽屉宽度 */
    width?: string;
}

interface Emits {
    (e: 'update:visible', value: boolean): void;
    (e: 'confirm', buttons: ButtonConfig[]): void;
    (e: 'cancel'): void;
}

const props = withDefaults(defineProps<Props>(), {
    buttons: () => [
        { id: '1', name: '查看', permission: 'view', icon: 'pi pi-eye', sort: 1 },
        { id: '2', name: '新增', permission: 'add', icon: 'pi pi-plus', sort: 2 },
        { id: '3', name: '编辑', permission: 'edit', icon: 'pi pi-pencil', sort: 3 },
        { id: '4', name: '删除', permission: 'delete', icon: 'pi pi-trash', sort: 4 },
        { id: '5', name: '导出', permission: 'export', icon: 'pi pi-download', sort: 5 },
        { id: '6', name: '导入', permission: 'import', icon: 'pi pi-upload', sort: 6 },
        { id: '7', name: '重置密码', permission: 'resetPassword', icon: 'pi pi-key', sort: 7 },
        { id: '8', name: '分配角色', permission: 'assignRole', icon: 'pi pi-users', sort: 8 },
        { id: '9', name: '启用', permission: 'enable', icon: 'pi pi-check', sort: 9 },
        { id: '10', name: '禁用', permission: 'disable', icon: 'pi pi-times', sort: 10 }
    ],
    title: '批量添加按钮',
    description: '选择的按钮将自动生成对应的权限标识和配置',
    width: '650px'
});

const emit = defineEmits<Emits>();

// 响应式状态
const selectedButtons = ref<string[]>([]);

// 计算属性
const dialogVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
});

const isAllSelected = computed(() => {
    return selectedButtons.value.length === props.buttons.length;
});

const toggleAllLabel = computed(() => {
    return isAllSelected.value ? '取消全选' : '全选';
});

const selectedButtonsCount = computed(() => {
    return selectedButtons.value.length;
});

// 方法
/**
 * 切换按钮选择状态
 * @param permission - 权限标识
 */
const toggleButtonSelection = (permission: string) => {
    const index = selectedButtons.value.indexOf(permission);
    if (index > -1) {
        selectedButtons.value.splice(index, 1);
    } else {
        selectedButtons.value.push(permission);
    }
};

/**
 * 切换全选状态
 */
const toggleAllButtons = () => {
    if (isAllSelected.value) {
        selectedButtons.value = [];
    } else {
        selectedButtons.value = props.buttons.map((btn) => btn.permission);
    }
};

/**
 * 确认添加按钮
 */
const confirmAddButtons = () => {
    const buttonsToAdd = props.buttons.filter((btn) => selectedButtons.value.includes(btn.permission));
    emit('confirm', buttonsToAdd);
    resetSelection();
};

/**
 * 取消操作
 */
const cancelOperation = () => {
    emit('cancel');
    resetSelection();
};

/**
 * 重置选择状态
 */
const resetSelection = () => {
    selectedButtons.value = [];
};

/**
 * 获取按钮配置
 * @param permission - 权限标识
 * @returns 按钮配置对象
 */
const getButtonConfig = (permission: string) => {
    return props.buttons.find((btn) => btn.permission === permission);
};

/**
 * 检查按钮是否被选中
 * @param permission - 权限标识
 * @returns 是否选中
 */
const isButtonSelected = (permission: string) => {
    return selectedButtons.value.includes(permission);
};

// 监听弹窗显示状态，重置选择
watch(
    () => props.visible,
    (newVisible) => {
        if (newVisible) {
            resetSelection();
        }
    }
);
</script>

<template>
    <Dialog v-model:visible="dialogVisible" :header="title" :modal="true" :dismissable-mask="true" :closable="true" :style="{ width: width }" class="button-selector-dialog">
        <div class="p-6">
            <div class="mb-6">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h5 class="font-semibold text-gray-800 mb-1">选择要添加的按钮</h5>
                        <p class="text-sm text-gray-600">{{ description }}</p>
                    </div>
                    <Button :label="toggleAllLabel" size="small" severity="secondary" outlined @click="toggleAllButtons" />
                </div>
            </div>

            <div class="space-y-3">
                <div
                    v-for="button in buttons"
                    :key="button.permission"
                    class="button-selector-item flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-colors"
                    :class="{ 'border-blue-500 bg-blue-50 shadow-sm selected': isButtonSelected(button.permission) }"
                    @click="toggleButtonSelection(button.permission)"
                >
                    <div class="flex items-center flex-1">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center mr-2" :class="isButtonSelected(button.permission) ? 'bg-blue-100' : 'bg-gray-100'">
                            <i :class="[button.icon, isButtonSelected(button.permission) ? 'text-blue-600' : 'text-gray-600']"></i>
                        </div>
                        <div>
                            <div class="font-medium text-gray-800">{{ button.name }}</div>
                            <div class="text-sm text-gray-500">权限：{{ button.permission }}</div>
                        </div>
                    </div>
                    <div class="ml-2">
                        <i class="pi transition-colors" :class="isButtonSelected(button.permission) ? 'pi-check-circle text-blue-500' : 'pi-circle text-gray-300'"></i>
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-between items-center">
                <div class="text-sm text-gray-500">
                    <span v-if="selectedButtonsCount > 0"> 已选择 {{ selectedButtonsCount }} 个按钮 </span>
                    <span v-else>请选择要添加的按钮</span>
                </div>
                <div class="flex gap-3">
                    <Button label="取消" severity="secondary" outlined @click="cancelOperation" />
                    <Button label="确定添加" :disabled="selectedButtonsCount === 0" @click="confirmAddButtons" />
                </div>
            </div>
        </template>
    </Dialog>
</template>

<style lang="scss" scoped>
// 按钮选择器优化
.button-selector-item {
    &.selected {
        @apply border-blue-500 bg-blue-50;
    }
}

// Dialog 内容区域样式优化
:deep(.button-selector-dialog .p-dialog-content) {
    max-height: 70vh;
    overflow-y: auto;
}

// 响应式优化
@media (max-width: 768px) {
    :deep(.p-drawer) {
        width: 100% !important;
    }

    .grid {
        grid-template-columns: 1fr;
    }
}
</style>
