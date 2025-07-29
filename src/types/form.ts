import type { Component } from 'vue'
import type { FormResolverOptions } from '@primevue/forms'
import type z from 'zod'

/**
 * 表单字段选项定义
 */
export interface FormFieldOption {
    label: string
    value: string | number | boolean
    disabled?: boolean
}

/**
 * 表单字段验证规则
 */
export interface FormFieldRule {
    required?: boolean
    min?: number
    max?: number
    pattern?: string | RegExp
    validator?: string | ((value: any) => boolean | string | Promise<boolean | string>)
    message?: string
    [key: string]: any
}

/**
 * 表单字段配置
 */
export interface FormFieldConfig {
    name: string
    label?: string
    type: 'input' | 'password' | 'textarea' | 'number' | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'switch' | 'date' | 'daterange' | 'custom'
    placeholder?: string
    description?: string
    defaultValue?: any
    options?: FormFieldOption[]
    required?: boolean,
    component?: Component
    props?: Record<string, any>
    hidden?: boolean
    disabled?: boolean
    readonly?: boolean
    colSpan?: number
    labelWidth?: string | number
    labelPosition?: 'top' | 'left'
    validateOn?: 'blur' | 'valueUpdate' | 'submit' | 'mount' | string[]
}

/**
 * 表单配置
 */
export interface FormConfig {
    fields: FormFieldConfig[]
    layout?: 'grid' | 'vertical' | 'horizontal'
    gridCols?: number
    gridGap?: string
    labelWidth?: string | number
    labelPosition?: 'top' | 'left'
    submitText?: string
    resetText?: string
    showReset?: boolean
    showSubmit?: boolean
    validateOn?: 'blur' | 'valueUpdate' | 'submit' | 'mount' | string[]
    zodScheam?:  z.Schema;
}

/**
 * 表单提交数据
 */
export interface FormSubmitData {
    values: Record<string, any>
    valid: boolean
    errors: Record<string, any[]>
    reset: () => void
}
