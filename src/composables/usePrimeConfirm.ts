import type { ConfirmationOptions } from "primevue/confirmationoptions";
import { useConfirm } from "primevue/useconfirm";




export const usePrimeConfirm = () => {
    const confirm = useConfirm();

    const confirmDelete = async (options: ConfirmationOptions) => {
        const { message, header, accept, reject, acceptLabel = '确认', rejectLabel = '取消', ...rest } = options;
        const confirmOptions: ConfirmationOptions = {
            message, header, icon: 'pi pi-exclamation-triangle',
            acceptClass: 'p-button-danger',
            acceptLabel, rejectLabel,
            accept, reject,
            ...rest,
        };
        return confirm.require(confirmOptions);
    }

    const confirmInfo = async (options: ConfirmationOptions) => {
        const { message, header, accept, reject, acceptLabel, rejectLabel, ...rest } = options;
        const confirmOptions: ConfirmationOptions = {
            message, header, icon: 'pi pi-info-circle',
            acceptClass: 'p-button-info',
            acceptLabel, rejectLabel,
            accept,
            reject,
            ...rest,
        };
        return confirm.require(confirmOptions);
    }

    const confirmSuccess = async (options: ConfirmationOptions) => {
        const { message, header, accept, reject, acceptLabel, rejectLabel, ...rest } = options;
        const confirmOptions: ConfirmationOptions = {
            message, header, icon: 'pi pi-check-circle',
            acceptClass: 'p-button-success',
            acceptLabel, rejectLabel,
            accept, reject,
            ...rest,
        };
        return confirm.require(confirmOptions);
    }


    const confirmWarning = async (options: ConfirmationOptions) => {
        const { message, header, accept, reject, acceptLabel, rejectLabel, ...rest } = options;
        const confirmOptions: ConfirmationOptions = {
            message, header, icon: 'pi pi-exclamation-triangle',
            acceptClass: 'p-button-warning',
            acceptLabel, rejectLabel,
            accept, reject,
            ...rest,
        };
        return confirm.require(confirmOptions);
    }
    // 继续扩展comfirmPopup

    return {
        confirmDelete,
        confirmInfo,
        confirmSuccess,
        confirmWarning,
    }
}
