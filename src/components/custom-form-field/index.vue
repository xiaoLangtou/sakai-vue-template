<script setup lang="ts">
import { computed } from 'vue';
import { FormField } from '@primevue/forms';
import Message from 'primevue/message';

// 扩展FormField插槽属性的接口
export interface FormFieldSlotProps {
    value: any;
    touched: boolean;
    dirty: boolean;
    pristine: boolean;
    valid: boolean;
    invalid: boolean;
    error: any;
    errors: any[];
    onInput: (event: any) => void;
    onBlur: (event: any) => void;
    onChange: (event: any) => void;
    props: any;
    // 添加模板中使用的字段
    field: any;
}

/**
 * SmartFormField组件属性接口
 */
interface Props {
    /** 表单字段名称，必填 */
    name: string;
    /** 表单字段标签文本 */
    label?: string;
    /** 表单字段初始值 */
    initialValue?: any;
    /** 表单验证解析器 */
    resolver?: any;
    /** 是否为必填字段，如果为true，标签旁边会显示红色星号 */
    required?: boolean;
    /** 表单字段描述文本，显示在字段下方 */
    description?: string;
    /** 自定义CSS类名 */
    class?: string | object;
    /**
     * 是否使用行内模式，label和组件在同一行
     * @example <SmartFormField name="username" label="用户名" inline>
     */
    inline?: boolean;
    /**
     * label的宽度，可以是数字（px）或字符串（如'100px'、'8rem'等）
     * 在行内模式下特别有用，用于对齐多个表单字段的内容区域
     * @example <SmartFormField name="username" label="用户名" inline :labelWidth="100">
     * @example <SmartFormField name="username" label="用户名" inline labelWidth="8rem">
     */
    labelWidth?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
    initialValue: '',
    required: false,
    inline: false,
    labelWidth: ''
});

const fieldClass = computed(() => {
    const baseClass = 'flex flex-col gap-1';
    if (props.class) {
        return typeof props.class === 'string' ? `${baseClass} ${props.class}` : [baseClass, props.class];
    }
    return baseClass;
});

// 计算label样式
const labelStyle = computed(() => {
    if (!props.labelWidth) return {};

    const width = typeof props.labelWidth === 'number' ? `${props.labelWidth}px` : props.labelWidth;

    return {
        width,
        minWidth: width,
        '--label-width': width // 添加CSS变量以便在样式中使用
    };
});
</script>

<template>
    <FormField v-slot="$field" :name="name" :initial-value="initialValue" :resolver="resolver" :class="fieldClass">
        <div class="smart-form-field" :class="{ 'smart-form-field--inline': inline }">
            <!-- Label -->
            <label v-if="label" :for="name" class="smart-form-field__label" :class="{ 'smart-form-field__label--required': required }" :style="labelStyle">
                {{ label }}
                <span v-if="required" class="smart-form-field__required">*</span>
            </label>

            <!-- 字段内容插槽 -->
            <div class="smart-form-field__content">
                <slot :value="$field.value" :on-input="$field.onInput" :on-blur="$field.onBlur" :on-change="$field.onChange" :invalid="$field.invalid" :field="$field" />
            </div>

            <!-- 错误信息 -->
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple" class="smart-form-field__error">
                {{ $field.error?.message }}
            </Message>

            <!-- 字段描述 -->
            <small v-if="description" class="smart-form-field__description">
                {{ description }}
            </small>
        </div>
    </FormField>
</template>

<style lang="scss" scoped>
.smart-form-field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    &--inline {
        flex-direction: row;
        align-items: flex-start;
        flex-wrap: wrap;

        .smart-form-field__label {
            margin-bottom: 0;
            margin-right: 0.5rem;
            padding-top: 0.5rem; /* 与输入框对齐 */
        }

        .smart-form-field__content {
            flex: 1;
        }

        .smart-form-field__error,
        .smart-form-field__description {
            width: 100%;
            margin-left: var(--label-width, 0);
            margin-top: 0.25rem;
            padding-left: 0.5rem; /* 添加一些额外的缩进 */
        }
    }
}

.smart-form-field__label {
    font-weight: 500;
    color: var(--text-color);
    margin-bottom: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.smart-form-field__required {
    color: var(--p-rose-500, #f43f5e);
    font-weight: bold;
}

.smart-form-field__content {
    /* 字段内容容器 */
    @apply w-full;
}

.smart-form-field__error {
    margin-top: 0.25rem;
}

.smart-form-field__description {
    color: var(--text-color-secondary);
    font-size: 0.875rem;
    margin-top: 0.25rem;
}
</style>
