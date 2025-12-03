<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useToast } from 'primevue/usetoast';

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

// 定义批量添加项接口
interface BatchDictItem extends Partial<DictItem> {
    tempId?: string;
    isEditing?: boolean;
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

// 批量添加相关
const batchItems = ref<BatchDictItem[]>([]);
const batchSubmitting = ref(false);
const pasteArea = ref<HTMLTextAreaElement>();

// 记录已交互过的字段
const touchedFields = ref<Map<string, Set<string>>>(new Map());

// 生成临时ID
const generateTempId = () => {
    return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 初始化批量数据
 */
const initBatchItems = () => {
    const initialItem: BatchDictItem = {
        tempId: generateTempId(),
        label: '',
        value: '',
        sort: props.existingItems.length + 1,
        remark: '',
        status: true,
        isDefault: false,
        isEditing: true
    };
    batchItems.value = [initialItem];
    // 清理已交互字段状态
    touchedFields.value.clear();
};

/**
 * 添加一行批量数据
 */
const addBatchRow = () => {
    const newItem: BatchDictItem = {
        tempId: generateTempId(),
        label: '',
        value: '',
        sort: props.existingItems.length + batchItems.value.length + 1,
        remark: '',
        status: true,
        isDefault: false,
        isEditing: true
    };
    batchItems.value.push(newItem);
};

/**
 * 删除批量数据行
 * @param index - 行索引
 */
const removeBatchRow = (index: number) => {
    if (batchItems.value.length > 1) {
        const removedItem = batchItems.value[index];
        // 清理被删除行的交互状态
        if (removedItem.tempId) {
            touchedFields.value.delete(removedItem.tempId);
        }
        batchItems.value.splice(index, 1);
        // 重新计算排序
        batchItems.value.forEach((item, idx) => {
            item.sort = props.existingItems.length + idx + 1;
        });
    }
};

/**
 * 更新字段值
 * @param index - 行索引
 * @param field - 字段名
 * @param value - 新值
 */
const updateField = (index: number, field: keyof BatchDictItem, value: any) => {
    if (batchItems.value[index]) {
        batchItems.value[index][field] = value;
    }
};

/**
 * 校验批量数据
 * @returns 是否校验通过
 */
const validateBatchItems = (): boolean => {
    return batchItems.value.every((item) => item.label && item.label.trim() && item.value && item.value.trim());
};

/**
 * 检查是否有重复的值
 * @returns 重复的值数组
 */
const checkDuplicateValues = (): string[] => {
    const values = batchItems.value.map((item) => item.value?.trim()).filter(Boolean);
    const existingValues = props.existingItems.map((item) => item.value);
    const duplicates: string[] = [];

    // 检查与现有数据的重复
    values.forEach((value) => {
        if (existingValues.includes(value as string)) {
            duplicates.push(value as string);
        }
    });

    // 检查批量数据内部重复
    const valueCount = new Map<string, number>();
    values.forEach((value) => {
        const count = valueCount.get(value as string) || 0;
        valueCount.set(value as string, count + 1);
        if (count > 0) {
            duplicates.push(value as string);
        }
    });

    return [...new Set(duplicates)];
};

/**
 * 提交批量添加
 */
const submitBatchAdd = async () => {
    if (!validateBatchItems()) {
        toast.add({
            severity: 'warn',
            summary: '校验失败',
            detail: '请填写所有必填字段（字典标签和字典值）',
            life: 3000
        });
        return;
    }

    const duplicates = checkDuplicateValues();
    if (duplicates.length > 0) {
        toast.add({
            severity: 'warn',
            summary: '数据重复',
            detail: `字典值重复：${duplicates.join(', ')}`,
            life: 3000
        });
        return;
    }

    batchSubmitting.value = true;

    try {
        // 构建新增数据
        const newItems: DictItem[] = batchItems.value.map((item, index) => {
            const newId = Math.max(0, ...props.existingItems.map((i) => i.id)) + index + 1;
            const now = new Date().toLocaleString();

            return {
                id: newId,
                dictTypeId: props.dictTypeId,
                label: item.label || '',
                value: item.value || '',
                sort: item.sort || 0,
                status: item.status !== undefined ? item.status : true,
                isDefault: item.isDefault !== undefined ? item.isDefault : false,
                remark: item.remark || '',
                createTime: now
            };
        });

        // 触发保存事件
        emit('save', newItems);

        toast.add({
            severity: 'success',
            summary: '成功',
            detail: `已成功添加 ${newItems.length} 个字典项`,
            life: 3000
        });

        dialogVisible.value = false;
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: '批量添加失败，请重试',
            life: 3000
        });
    } finally {
        batchSubmitting.value = false;
    }
};

/**
 * 处理Excel粘贴
 * @param event - 粘贴事件
 */
const handlePaste = (event: ClipboardEvent) => {
    const pastedText = event.clipboardData?.getData('text/plain');
    if (!pastedText) return;

    event.preventDefault();

    const rows = pastedText.split('\n').filter((row) => row.trim());
    const parsedItems: BatchDictItem[] = [];

    rows.forEach((row, index) => {
        const columns = row.split('\t');
        const [label, value, sort, remark] = columns;

        if (label?.trim() || value?.trim()) {
            const newItem: BatchDictItem = {
                tempId: generateTempId(),
                label: label?.trim() || '',
                value: value?.trim() || '',
                sort: sort ? Number(sort) || props.existingItems.length + parsedItems.length + 1 : props.existingItems.length + parsedItems.length + 1,
                remark: remark?.trim() || '',
                status: true,
                isDefault: false,
                isEditing: true
            };
            parsedItems.push(newItem);
        }
    });

    if (parsedItems.length > 0) {
        // 清空现有数据并添加粘贴的数据
        batchItems.value = parsedItems;
        toast.add({
            severity: 'success',
            summary: '粘贴成功',
            detail: `已添加 ${parsedItems.length} 行数据`,
            life: 3000
        });

        // 隐藏粘贴区域
        hidePasteArea();
    } else {
        toast.add({
            severity: 'warn',
            summary: '粘贴失败',
            detail: '未检测到有效的数据，请确保数据格式正确',
            life: 3000
        });
    }
};

/**
 * 聚焦粘贴区域并尝试读取剪贴板
 */
const focusPasteArea = async () => {
    try {
        // 尝试使用现代剪贴板API
        if (navigator.clipboard && navigator.clipboard.readText) {
            const text = await navigator.clipboard.readText();
            if (text) {
                // 模拟粘贴事件
                const mockEvent = {
                    preventDefault: () => {},
                    clipboardData: {
                        getData: () => text
                    }
                } as unknown as ClipboardEvent;
                handlePaste(mockEvent);
                return;
            }
        }
    } catch (error) {
        console.warn('无法访问剪贴板，请手动粘贴:', error);
    }

    // 降级方案：显示粘贴区域并聚焦
    if (pasteArea.value) {
        // 临时显示粘贴区域
        pasteArea.value.style.position = 'fixed';
        pasteArea.value.style.top = '50%';
        pasteArea.value.style.left = '50%';
        pasteArea.value.style.transform = 'translate(-50%, -50%)';
        pasteArea.value.style.opacity = '1';
        pasteArea.value.style.pointerEvents = 'auto';
        pasteArea.value.style.width = '300px';
        pasteArea.value.style.height = '100px';
        pasteArea.value.style.zIndex = '9999';
        pasteArea.value.style.border = '2px dashed #3b82f6';
        pasteArea.value.style.borderRadius = '8px';
        pasteArea.value.style.padding = '16px';
        pasteArea.value.style.backgroundColor = '#ffffff';
        pasteArea.value.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';

        pasteArea.value.focus();
        pasteArea.value.select();

        // 提示用户
        toast.add({
            severity: 'info',
            summary: '粘贴提示',
            detail: '请在弹出的文本框中粘贴Excel数据（Ctrl+V）',
            life: 5000
        });

        // 5秒后自动隐藏
        setTimeout(() => {
            hidePasteArea();
        }, 5000);
    }
};

/**
 * 隐藏粘贴区域
 */
const hidePasteArea = () => {
    if (pasteArea.value) {
        pasteArea.value.style.position = 'absolute';
        pasteArea.value.style.left = '-9999px';
        pasteArea.value.style.opacity = '0';
        pasteArea.value.style.pointerEvents = 'none';
        pasteArea.value.style.width = '1px';
        pasteArea.value.style.height = '1px';
        pasteArea.value.style.zIndex = 'auto';
        pasteArea.value.style.border = 'none';
        pasteArea.value.style.borderRadius = '0';
        pasteArea.value.style.padding = '0';
        pasteArea.value.style.backgroundColor = 'transparent';
        pasteArea.value.style.boxShadow = 'none';
        pasteArea.value.value = '';
    }
};

/**
 * 标记字段为已交互
 * @param tempId - 临时ID
 * @param field - 字段名
 */
const markFieldTouched = (tempId: string, field: string) => {
    if (!touchedFields.value.has(tempId)) {
        touchedFields.value.set(tempId, new Set());
    }
    touchedFields.value.get(tempId)?.add(field);
};

/**
 * 检查字段是否有错误
 * @param item - 字典项
 * @param field - 字段名
 * @returns 是否有错误
 */
const hasFieldError = (item: BatchDictItem, field: 'label' | 'value'): boolean => {
    // 只有在字段被交互过后才显示错误
    const tempId = item.tempId;
    if (!tempId || !touchedFields.value.has(tempId) || !touchedFields.value.get(tempId)?.has(field)) {
        return false;
    }
    return !item[field]?.trim();
};

// 监听对话框打开，初始化数据
const handleDialogOpen = () => {
    if (dialogVisible.value) {
        initBatchItems();
    }
};

// 监听对话框可见性变化
watch(
    () => props.visible,
    (newVisible) => {
        if (newVisible) {
            initBatchItems();
        }
    }
);
</script>

<template>
    <Dialog v-model:visible="dialogVisible" header="批量添加字典项" :modal="true" :style="{ width: '1200px' }" class="batch-add-dialog" @show="handleDialogOpen">
        <!-- 操作提示区域 -->
        <div class="operation-tips">
            <div class="tips-content">
                <i class="pi pi-info-circle text-blue-500 mr-2"></i>
                <span class="text-sm text-gray-600"> 支持从Excel复制粘贴数据，格式：标签、值、排序、备注（Tab分隔） </span>
            </div>
            <Button label="粘贴Excel数据" icon="pi pi-clipboard" severity="secondary" outlined size="small" @click="focusPasteArea" />
        </div>

        <!-- 隐藏的粘贴区域 -->
        <textarea ref="pasteArea" class="paste-area" placeholder="在此粘贴Excel数据（Ctrl+V），按ESC键关闭" @paste="handlePaste" @keydown.esc="hidePasteArea" @blur="hidePasteArea" />

        <!-- 数据表格 -->
        <div class="table-container">
            <DataTable :value="batchItems" :scrollable="true" scroll-height="450px" striped-rows show-gridlines responsive-layout="scroll" data-key="tempId">
                <Column field="label" header="字典标签 *" style="min-width: 200px">
                    <template #body="{ data, index }">
                        <InputText
                            :model-value="data.label"
                            :class="{ 'p-invalid': hasFieldError(data, 'label') }"
                            placeholder="请输入字典标签"
                            @update:model-value="updateField(index, 'label', $event)"
                            @blur="markFieldTouched(data.tempId!, 'label')"
                        />
                    </template>
                </Column>

                <Column field="value" header="字典值 *" style="min-width: 200px">
                    <template #body="{ data, index }">
                        <InputText
                            :model-value="data.value"
                            :class="{ 'p-invalid': hasFieldError(data, 'value') }"
                            placeholder="请输入字典值"
                            @update:model-value="updateField(index, 'value', $event)"
                            @blur="markFieldTouched(data.tempId!, 'value')"
                        />
                    </template>
                </Column>

                <Column field="sort" header="排序" style="min-width: 120px">
                    <template #body="{ data, index }">
                        <InputNumber
                            :model-value="data.sort"
                            :min="0"
                            :max="999"
                            show-buttons
                            button-layout="horizontal"
                            increment-button-class="p-button-secondary"
                            decrement-button-class="p-button-secondary"
                            @update:model-value="updateField(index, 'sort', $event)"
                        />
                    </template>
                </Column>

                <Column field="remark" header="备注" style="min-width: 200px">
                    <template #body="{ data, index }">
                        <InputText :model-value="data.remark" placeholder="请输入备注" @update:model-value="updateField(index, 'remark', $event)" />
                    </template>
                </Column>

                <Column header="操作" style="width: 80px" :exportable="false">
                    <template #body="{ index }">
                        <Button icon="pi pi-trash" severity="danger" text size="small" :disabled="batchItems.length <= 1" title="删除此行" @click="removeBatchRow(index)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <template #footer>
            <div class="dialog-footer">
                <div class="footer-left">
                    <Button icon="pi pi-plus" label="添加一行" severity="secondary" outlined @click="addBatchRow" />
                    <div class="data-count">
                        <i class="pi pi-list mr-1"></i>
                        <span>共 {{ batchItems.length }} 行数据</span>
                    </div>
                </div>
                <div class="footer-right">
                    <Button label="取消" icon="pi pi-times" severity="secondary" outlined @click="dialogVisible = false" />
                    <Button label="提交" icon="pi pi-check" severity="primary" :loading="batchSubmitting" @click="submitBatchAdd" />
                </div>
            </div>
        </template>
    </Dialog>
</template>

<style scoped>
/* 操作提示区域 */
.operation-tips {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    margin-bottom: 16px;
}

.tips-content {
    display: flex;
    align-items: center;
    flex: 1;
    color: #64748b;
    font-size: 14px;
}

/* 隐藏的粘贴区域 */
.paste-area {
    position: absolute;
    left: -9999px;
    opacity: 0;
    pointer-events: none;
    width: 1px;
    height: 1px;
}

/* 批量表格样式 */
.batch-table {
    font-size: 14px;
}

/* 状态切换按钮 */
.status-toggle {
    width: 80px;
}

/* 默认值复选框 */
.default-checkbox {
    display: flex;
    justify-content: center;
}

/* 对话框底部样式 */
.dialog-footer {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0 0 0;
    border-top: 1px solid #e2e8f0;
    margin-top: 16px;
}

.footer-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.footer-right {
    display: flex;
    align-items: center;
    gap: 8px;
}

.data-count {
    display: flex;
    align-items: center;
    color: #64748b;
    font-size: 14px;
    padding: 6px 12px;
    background: #f8fafc;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .operation-tips {
        flex-direction: column;
        gap: 8px;
        text-align: center;
    }

    .dialog-footer {
        flex-direction: column;
        gap: 12px;
    }

    .footer-left,
    .footer-right {
        width: 100%;
        justify-content: center;
    }
}
</style>
