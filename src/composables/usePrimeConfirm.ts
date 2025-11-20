import type { ConfirmationOptions } from 'primevue/confirmationoptions';
import { useConfirm } from 'primevue/useconfirm';


export const usePrimeConfirm = () => {
    const confirm = useConfirm();

    const confirmDelete = async (options: ConfirmationOptions) => {
        console.log('confirmDelete', options);
        const {
            message = '确定要删除吗？',
            header = '删除',
            accept,
            reject,
            acceptLabel = '确认',
            rejectLabel = '取消',
            ...rest
        } = options;
        const confirmOptions: ConfirmationOptions = {
            ...rest,
            message, header, icon: 'pi pi-exclamation-triangle',
            acceptClass: 'p-button-danger',
            acceptLabel, rejectLabel,
            accept, reject,
            rejectProps: {
                ...rest.rejectProps,
                severity: 'danger',
                variant: 'outlined'
            }

        };
        return confirm.require(confirmOptions);
    };

    const confirmInfo = async (options: ConfirmationOptions) => {
        const {
            message,
            header = '提示',
            accept,
            reject,
            acceptLabel = '确认',
            rejectLabel = '取消',
            ...rest
        } = options;
        const confirmOptions: ConfirmationOptions = {
            ...rest,
            message, header, icon: 'pi pi-info-circle',
            acceptClass: 'p-button-info',
            acceptLabel, rejectLabel,
            accept,
            reject,
            rejectProps: {
                ...rest.rejectProps,
                severity: 'danger',
                variant: 'outlined'
            }


        };
        return confirm.require(confirmOptions);
    };

    const confirmSuccess = async (options: ConfirmationOptions) => {
        const {
            message,
            header = '成功',
            accept,
            reject,
            acceptLabel = '确认',
            rejectLabel = '取消',
            ...rest
        } = options;
        const confirmOptions: ConfirmationOptions = {
            ...rest,
            message, header, icon: 'pi pi-check-circle',
            acceptClass: 'p-button-success',
            acceptLabel, rejectLabel,
            accept, reject

        };
        return confirm.require(confirmOptions);
    };


    const confirmWarning = async (options: ConfirmationOptions) => {
        const {
            message,
            header = '注意',
            accept,
            reject,
            acceptLabel = '确认',
            rejectLabel = '取消',
            ...rest
        } = options;
        const confirmOptions: ConfirmationOptions = {
            ...rest,
            message, header, icon: 'pi pi-exclamation-triangle',
            acceptClass: 'p-button-warning',
            acceptLabel, rejectLabel,
            accept, reject,
            rejectProps: {
                ...rest.rejectProps,
                severity: 'danger',
                variant: 'outlined'
            }
        };
        return confirm.require(confirmOptions);
    };
    // 继续扩展comfirmPopup

    return {
        confirmDelete,
        confirmInfo,
        confirmSuccess,
        confirmWarning
    };
};
