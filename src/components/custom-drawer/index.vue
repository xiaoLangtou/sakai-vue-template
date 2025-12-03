<!--
 * @Author: weipc 755197142@qq.com
 * @Date: 2025-01-09 15:14:03
 * @LastEditors: weipc 755197142@qq.com
 * @LastEditTime: 2025-01-09 15:14:03
 * @Description: 自定义抽屉组件
-->
<template>
    <Drawer
        :style="{ '--custom-width': customWidth }"
        v-bind="{ ...drawerProps, class: ['custom-drawer', drawerClasses], baseZIndex: 999, dismissable: dismissable, modal: modal, position: position, showCloseIcon: showCloseIcon, visible: visible }"
        @hide="handleHide"
        @show="handleShow"
        @update:visible="handleUpdateVisible"
        @after-show="handleAfterShow"
        @after-hide="handleAfterHide"
        @before-hide="handleBeforeHide"
    >
        <!-- 头部插槽 -->
        <template #header>
            <div class="custom-drawer__header">
                <slot name="header">
                    <div class="flex flex-col gap-1">
                        <span class="text-[18px] font-medium">{{ header }}</span>
                        <span v-if="subheader" class="text-[12px] text-surface-500">{{ subheader }}</span>
                    </div>
                </slot>
            </div>
        </template>

        <!-- 关闭按钮插槽 -->
        <template v-if="$slots.closebutton" #closebutton="{ closeCallback }">
            <slot :close-callback="closeCallback" name="closebutton"></slot>
        </template>

        <!-- 关闭图标插槽 -->
        <template v-if="$slots.closeicon" #closeicon>
            <slot name="closeicon"></slot>
        </template>

        <!-- 主体内容 -->
        <div v-if="showContent" class="drawer-content">
            <slot></slot>
        </div>

        <!-- 底部插槽 -->
        <template v-if="showDefaultFooter" #footer>
            <div class="drawer-footer">
                <slot name="footer">
                    <div class="flex justify-end gap-2">
                        <Button v-if="showCancelButton" :icon="cancelButtonIcon" :label="cancelButtonText" severity="secondary" @click="handleCancel" />
                        <Button v-if="showConfirmButton" :icon="confirmButtonIcon" :label="confirmButtonText" :loading="confirmLoading" @click="handleConfirm" />
                    </div>
                </slot>
            </div>
        </template>
    </Drawer>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { DrawerProps } from 'primevue/drawer';
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';

/**
 * 自定义抽屉组件属性接口
 */
interface Props extends Partial<DrawerProps> {
    /** 抽屉是否可见 */
    visible?: boolean;
    /** 抽屉位置 */
    position?: 'left' | 'right' | 'top' | 'bottom' | 'full';
    /** 抽屉标题 */
    header?: string;
    /** 是否为模态框 */
    modal?: boolean;
    /** 是否可通过点击遮罩关闭 */
    dismissable?: boolean;
    /** 是否显示关闭图标 */
    showCloseIcon?: boolean;
    /** 是否显示内容区域 */
    showContent?: boolean;
    /** 是否显示默认底部 */
    showDefaultFooter?: boolean;
    /** 是否显示确认按钮 */
    showConfirmButton?: boolean;
    /** 是否显示取消按钮 */
    showCancelButton?: boolean;
    /** 确认按钮文本 */
    confirmButtonText?: string;
    /** 取消按钮文本 */
    cancelButtonText?: string;
    /** 确认按钮图标 */
    confirmButtonIcon?: string;
    /** 取消按钮图标 */
    cancelButtonIcon?: string;
    /** 确认按钮加载状态 */
    confirmLoading?: boolean;
    /** 抽屉宽度类型 */
    widthType?: 'small' | 'medium' | 'large' | 'extra-large' | 'full' | 'auto';
    /** 自定义宽度 */
    customWidth?: string;
    /** 抽屉高度类型 */
    subheader?: string;
}

/**
 * 组件名称定义
 */
defineOptions({
    name: 'CustomDrawer'
});

/**
 * 组件属性定义
 */
const props = withDefaults(defineProps<Props>(), {
    visible: false,
    position: 'right',
    header: '',
    modal: true,
    dismissable: false,
    showCloseIcon: true,
    showContent: true,
    showDefaultFooter: false,
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    confirmButtonIcon: '',
    cancelButtonIcon: '',
    confirmLoading: false,
    widthType: 'medium',
    customWidth: ''
});

/**
 * 组件事件定义
 */
const emit = defineEmits<{
    /** 可见性更新事件 */
    (e: 'update:visible', value: boolean): void;
    /** 显示事件 */
    (e: 'show'): void;
    /** 显示后事件 */
    (e: 'after-show'): void;
    /** 隐藏事件 */
    (e: 'hide'): void;
    /** 隐藏后事件 */
    (e: 'after-hide'): void;
    /** 隐藏前事件 */
    (e: 'before-hide'): void;
    /** 取消事件 */
    (e: 'cancel'): void;
    /** 确认事件 */
    (e: 'confirm'): void;
}>();

/**
 * 定义插槽
 */
defineSlots<{
    /** 默认插槽，用于放置抽屉的主体内容 */
    default: () => any;
    /** 头部插槽，用于自定义抽屉头部内容 */
    header: () => any;
    /** 关闭按钮插槽，用于自定义关闭按钮 */
    closebutton: (props: { closeCallback: () => void }) => any;
    /** 关闭图标插槽，用于自定义关闭图标 */
    closeicon: () => any;
    /** 底部插槽，用于自定义抽屉底部内容 */
    footer: () => any;
}>();

/**
 * 抽屉样式类计算
 */
const drawerClasses = computed(() => {
    if (props.customWidth) {
        return 'custom-drawer-width';
    }

    const widthClasses = {
        small: 'drawer-width-small',
        medium: 'drawer-width-medium',
        large: 'drawer-width-large',
        'extra-large': 'drawer-width-extra-large',
        full: 'drawer-width-full',
        auto: 'drawer-width-auto'
    };

    return widthClasses[props.widthType] || 'drawer-width-medium';
});

/**
 * 抽屉属性计算
 */
const drawerProps = computed(() => {
    const { ...rest } = props;
    return rest;
});

const customWidth = computed(() => {
    return props.customWidth;
});

/**
 * 处理可见性更新
 * @param value - 新的可见性状态
 */
const handleUpdateVisible = (value: boolean) => {
    emit('update:visible', value);
};

/**
 * 处理显示事件
 */
const handleShow = () => {
    emit('show');
};

/**
 * 处理显示后事件
 */
const handleAfterShow = () => {
    emit('after-show');
};

/**
 * 处理隐藏事件
 */
const handleHide = () => {
    emit('hide');
};

/**
 * 处理隐藏后事件
 */
const handleAfterHide = () => {
    emit('after-hide');
};

/**
 * 处理隐藏前事件
 */
const handleBeforeHide = () => {
    emit('before-hide');
};

/**
 * 处理取消操作
 */
const handleCancel = () => {
    emit('cancel');
    emit('update:visible', false);
};

/**
 * 处理确认操作
 */
const handleConfirm = () => {
    emit('confirm');
};
</script>

<style lang="scss">
.drawer-content {
    @apply flex-1;
}

.custom-drawer__header {
    @apply w-full;
}

/* 响应式抽屉宽度样式 */
.custom-drawer {
    .p-drawer-header {
        border-bottom: 1px solid;
        @apply border-surface-100 dark:border-surface-700;
        --p-drawer-header-padding: 0.75rem 1.25rem;
    }
    .p-drawer-footer {
        border-top: 1px solid;
        @apply border-surface-100 dark:border-surface-700;
        --p-drawer-footer-padding: 0.75rem 1.25rem;
    }

    .p-button-text {
        border: none;
    }

    /* 小尺寸抽屉 */

    &.drawer-width-small {
        width: 280px;
    }

    /* 中等尺寸抽屉 */

    &.drawer-width-medium {
        width: 400px;
    }

    /* 大尺寸抽屉 */

    &.drawer-width-large {
        width: 600px;
    }

    /* 超大尺寸抽屉 */

    &.drawer-width-extra-large {
        width: 800px;
    }

    /* 全屏宽度 */

    &.drawer-width-full {
        width: 100%;
    }

    /* 自动宽度 */

    &.drawer-width-auto {
        width: auto;
        min-width: 320px;
        max-width: 90vw;
    }

    /* 自定义宽度 */

    &.custom-drawer-width {
        width: var(--custom-width) !important;
    }

    /* 移动端响应式 */
    @media (max-width: 640px) {
        &.drawer-width-small,
        &.drawer-width-medium,
        &.drawer-width-large,
        &.drawer-width-extra-large {
            width: 100vw;
            max-width: 100vw;
        }

        &.drawer-width-auto {
            width: 100vw;
            min-width: 100vw;
            max-width: 100vw;
        }
    }

    /* 平板端响应式 */
    @media (min-width: 641px) and (max-width: 1024px) {
        &.drawer-width-large {
            width: 500px;
        }

        &.drawer-width-extra-large {
            width: 600px;
        }

        &.drawer-width-auto {
            max-width: 80vw;
        }
    }

    /* 大屏幕响应式 */
    @media (min-width: 1025px) {
        &.drawer-width-auto {
            max-width: 70vw;
        }
    }
}
</style>
