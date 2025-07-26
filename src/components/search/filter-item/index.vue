<script setup lang="ts">
import { computed, ref, withDefaults } from 'vue';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import Calendar from 'primevue/calendar';
import InputNumber from 'primevue/inputnumber';
import type { FilterConfig, FilterValue } from '@/types/search';

interface Props {
    /** 筛选配置 */
    config: FilterConfig;
    /** 当前值 */
    value: FilterValue;
    /** 是否显示错误 */
    showError?: boolean;
}

interface Emits {
    (e: 'update', key: string, value: FilterValue): void;
    (e: 'validate', key: string, valid: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
    showError: false
});

const emit = defineEmits<Emits>();

// 组件映射
const componentMap = {
    input: InputText,
    select: Dropdown,
    multiSelect: MultiSelect,
    date: Calendar,
    dateRange: Calendar,
    number: InputNumber
};

// 错误状态
const hasError = ref(false);
const errorMessage = ref('');

// 组件属性
const componentProps = computed(() => {
    const baseProps = {
        placeholder: props.config.placeholder,
        class: 'w-full'
    };

    switch (props.config.type) {
        case 'select':
            return {
                ...baseProps,
                options: props.config.options || [],
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                filter: true,
                filterPlaceholder: '搜索选项...'
            };

        case 'multiSelect':
            return {
                ...baseProps,
                options: props.config.options || [],
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                filter: true,
                filterPlaceholder: '搜索选项...',
                display: 'chip',
                maxSelectedLabels: 3,
                selectedItemsLabel: '{0} 项已选择'
            };

        case 'date':
            return {
                ...baseProps,
                showIcon: true,
                dateFormat: 'yy-mm-dd',
                showButtonBar: true,
                touchUI: false
            };

        case 'dateRange':
            return {
                ...baseProps,
                showIcon: true,
                selectionMode: 'range',
                dateFormat: 'yy-mm-dd',
                showButtonBar: true,
                touchUI: false
            };

        case 'number':
            return {
                ...baseProps,
                showButtons: true,
                buttonLayout: 'horizontal',
                incrementButtonClass: 'p-button-secondary',
                decrementButtonClass: 'p-button-secondary'
            };

        case 'input':
        default:
            return {
                ...baseProps,
                type: 'text'
            };
    }
});

/**
 * 验证值
 * @param value 要验证的值
 */
const validateValue = (value: FilterValue): { valid: boolean; message: string } => {
    // 必填验证
    if (props.config.required) {
        if (value === null || value === undefined || value === '') {
            return { valid: false, message: `${props.config.label}不能为空` };
        }
        if (Array.isArray(value) && value.length === 0) {
            return { valid: false, message: `${props.config.label}不能为空` };
        }
    }

    // 自定义规则验证
    if (props.config.rules && props.config.rules.length > 0) {
        for (const rule of props.config.rules) {
            if (typeof rule === 'function') {
                const result = rule(value);
                if (result !== true) {
                    return { valid: false, message: result || '验证失败' };
                }
            }
        }
    }

    return { valid: true, message: '' };
};

/**
 * 处理值更新
 * @param newValue 新值
 */
const handleUpdate = (newValue: FilterValue) => {
    // 验证新值
    const validation = validateValue(newValue);
    hasError.value = !validation.valid && props.showError;
    errorMessage.value = validation.message;

    // 发送验证结果
    emit('validate', props.config.key, validation.valid);

    // 发送更新事件
    emit('update', props.config.key, newValue);
};

// 暴露验证方法
defineExpose({
    validate: () => {
        const validation = validateValue(props.value);
        hasError.value = !validation.valid;
        errorMessage.value = validation.message;
        return validation.valid;
    },
    clearError: () => {
        hasError.value = false;
        errorMessage.value = '';
    }
});
</script>

<template>
    <div class="filter-item">
        <div class="filter-header">
            <label v-if="config.label" class="filter-label">
                {{ config.label }}
                <span v-if="config.required" class="required-mark">*</span>
            </label>
            <div v-if="config.tooltip" class="filter-tooltip">
                <i class="pi pi-info-circle" v-tooltip="config.tooltip" />
            </div>
        </div>

        <div class="filter-input-wrapper">
            <component :is="componentMap[config.type]" v-bind="componentProps" :model-value="value" @update:model-value="handleUpdate" />
            <div v-if="hasError" class="error-indicator">
                <i class="pi pi-exclamation-triangle" />
            </div>
        </div>

        <Transition name="error-fade">
            <div v-if="hasError" class="error-message">
                <i class="pi pi-times-circle" />
                {{ errorMessage }}
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.filter-label {
    font-weight: 700;
    color: var(--text-color);
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    letter-spacing: 0.025em;
}

.required-mark {
    color: var(--red-500);
    font-weight: 800;
    font-size: 0.9rem;
}

.filter-tooltip {
    color: var(--text-color-secondary);
    cursor: help;
    transition: color 0.2s ease;
}

.filter-tooltip:hover {
    color: var(--primary-color);
}

.filter-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.filter-input {
    @apply w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200 min-h-[40px];
}

.filter-input:focus,
.filter-input:focus-within {
    outline: none;
    border-color: var(--primary-500);
    outline: 2px solid rgba(59, 130, 246, 0.2);
    outline-offset: -1px;
}

.filter-input.p-invalid {
    border-color: #dc2626;
    outline: 2px solid rgba(220, 38, 38, 0.2);
    outline-offset: -1px;
}

.error-indicator {
    position: absolute;
    right: 8px;
    color: var(--red-500);
    pointer-events: none;
    z-index: 1;
}

.error-message {
    @apply flex items-center gap-2 text-red-600 dark:text-red-400 text-xs mt-1.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded px-2 py-1;
}

.error-message i {
    flex-shrink: 0;
}

/* 过渡效果 */
.error-fade-enter-active,
.error-fade-leave-active {
    transition: all 0.2s ease;
}

.error-fade-enter-from,
.error-fade-leave-to {
    opacity: 0;
    transform: translateY(-5px);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .filter-item {
        margin-bottom: 0.875rem;
        padding: 0.875rem;
    }

    .filter-header {
        margin-bottom: 0.5rem;
    }

    .filter-label {
        font-size: 0.875rem;
    }

    .filter-input {
        padding: 0.5rem 0.625rem;
        font-size: 0.8rem;
    }

    .error-message {
        font-size: 0.7rem;
        padding: 0.25rem 0.375rem;
        margin-top: 0.25rem;
    }
}

/* 深色主题适配 */
</style>