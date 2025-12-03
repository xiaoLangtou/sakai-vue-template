<script lang="ts" setup>
import type { CustomDialogProps } from './type.ts';
import Button from 'primevue/button';

const visible = defineModel({
    default: false,
    type: Boolean
});

const props = defineProps<CustomDialogProps>();

const emit = defineEmits<{
    (e: 'cancel', $event: Event): void;
    (e: 'confirm', $event: Event): void;
}>();

const dialogStyle = computed(() => {
    let style: Record<string, any> = {};

    if (props.style) {
        style = { ...props.style };
    }

    if (props.width) {
        style.width = typeof props.width === 'number' ? `${props.width}px` : props.width;
    }
    return style;
});

const handleCancel = ($event: Event) => {
    emit('cancel', $event);
};

const handleConfirm = ($event: Event) => {
    emit('confirm', $event);
};
</script>

<template>
    <Dialog :style="dialogStyle" v-bind="{ ...props, visible: visible }">
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
        <!-- 底部插槽 -->
        <template v-if="showFooter" #footer>
            <div class="drawer-footer">
                <slot name="footer">
                    <div class="flex justify-end gap-2">
                        <Button v-if="showCancelButton" :icon="cancelButtonIcon" :label="cancelButtonText" severity="secondary" @click="handleCancel" />
                        <Button v-if="showConfirmButton" :icon="confirmButtonIcon" :label="confirmButtonText" :loading="confirmLoading" @click="handleConfirm" />
                    </div>
                </slot>
            </div>
        </template>
        <template v-if="$slots.closebutton" #closebutton>
            <slot name="closebutton"></slot>
        </template>
        <template v-if="$slots.closeicon" #closeicon>
            <slot name="closeicon"></slot>
        </template>
    </Dialog>
</template>

<style lang="scss" scoped></style>
