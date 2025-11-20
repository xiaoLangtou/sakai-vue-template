import type { DialogProps } from 'primevue';

export interface CustomDialogProps extends DialogProps {
    /** 宽度 */
    width?: string | number | undefined;
    /** 副标题 */
    subheader?: string | undefined;
    /** 是否显示底部 */
    showFooter?: boolean | undefined;
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
}
