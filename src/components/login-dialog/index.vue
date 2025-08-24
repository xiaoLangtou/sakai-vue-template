<script setup lang="ts">
import { CAPTCHA_EXPIRE_TIME } from '@/global/constants';
import { loginService } from '@/services/modules/login';
import type { ICaptcha, ILoginAccount } from '@/services/types/login';
import { to } from '@/utils/result-handler';
import globalToast from '@/services/core/toast';
import { useAuthStore } from '@/stores/auth';
import { onUnmounted, ref, watch } from 'vue';
import router from '@/router';

interface Props {
    /** 是否显示弹窗 */
    visible: boolean;
}

interface Emits {
    /** 更新显示状态 */
    (e: 'update:visible', value: boolean): void;
    /** 登录成功事件 */
    (e: 'login-success'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { loginAction } = useAuthStore();

const account = reactive<ILoginAccount>({
    username: '',
    password: '',
    captcha: '',
    captchaId: '',
});

const captchaImage = ref('');
const loading = ref(false);
const isCaptchaExpired = ref(false);
let expireTimer: NodeJS.Timeout | null = null;

/**
 * 获取验证码图片
 */
const getCaptcha = async () => {
    const result = await to<ICaptcha>(loginService.getCaptchaImage());
    if (!result.ok) {
        console.error('获取验证码失败:', result.error);
        return;
    }
    account.captchaId = result.value.captchaId;
    captchaImage.value = `data:image/svg+xml;base64,${btoa(result.value.captcha)}`;

    // 开始过期定时器
    startCaptchaExpireTimer();
};

/**
 * 启动验证码过期定时器
 */
const startCaptchaExpireTimer = () => {
    // 清除之前的定时器
    if (expireTimer) {
        clearTimeout(expireTimer);
    }

    // 重置过期状态
    isCaptchaExpired.value = false;

    // 设置过期定时器
    expireTimer = setTimeout(() => {
        isCaptchaExpired.value = true;
    }, CAPTCHA_EXPIRE_TIME);
};

/**
 * 关闭过期提示并重新获取验证码
 */
const closeCaptchaExpiredModal = () => {
    isCaptchaExpired.value = false;
    getCaptcha();
};

/**
 * 登录处理
 */
const handleLogin = async () => {
    try {
        if (!account.username || !account.password) {
            return globalToast.warn('请输入账号和密码');
        }

        if (!account.captcha) {
            return globalToast.warn('请输入验证码');
        }

        loading.value = true;
        const name = router.currentRoute.value.name ?? ''
        await loginAction(account, name as string);
        globalToast.success(`${getGreeting()}，欢迎回来！`);

        // 登录成功，关闭弹窗
        emit('update:visible', false);
        emit('login-success');
    } catch {
        // 登录失败，重新获取验证码
        await getCaptcha();
        account.captcha = '';
    } finally {
        loading.value = false;
    }
};

/**
 * 重置表单
 */
const resetForm = () => {
    account.username = '';
    account.password = '';
    account.captcha = '';
    account.captchaId = '';
    captchaImage.value = '';
    isCaptchaExpired.value = false;
    if (expireTimer) {
        clearTimeout(expireTimer);
        expireTimer = null;
    }
};

// 监听弹窗显示状态
watch(
    () => props.visible,
    (newVisible) => {
        if (newVisible) {
            // 弹窗打开时获取验证码
            getCaptcha();
        } else {
            // 弹窗关闭时重置表单
            resetForm();
        }
    }
);

// 组件卸载时清除定时器
onUnmounted(() => {
    if (expireTimer) {
        clearTimeout(expireTimer);
    }
});

// 写个方法，用来判断时间，区分上午、下午、晚上
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
};
</script>

<template>
    <Dialog
:visible="visible" modal header="重新登录" :style="{ width: '28rem' }" :closable="false" :draggable="false"
        class="login-dialog">
        <div class="flex flex-col gap-6">
            <div class="text-center">
                <div class="text-surface-500 dark:text-surface-400 text-sm mb-4">
                    登录已过期，请重新登录
                </div>
            </div>

            <div class="flex flex-col gap-4">
                <div>
                    <label for="dialog-username" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">
                        账号
                    </label>
                    <InputText
id="dialog-username" v-model="account.username" type="text" placeholder="请输入账号"
                        class="w-full" @keyup.enter="handleLogin" />
                </div>

                <div>
                    <label for="dialog-password" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">
                        密码
                    </label>
                    <Password
id="dialog-password" v-model="account.password" placeholder="请输入密码" :toggle-mask="true"
                        class="w-full" fluid :feedback="false" @keyup.enter="handleLogin" />
                </div>

                <div>
                    <label for="dialog-captcha" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">
                        验证码
                    </label>
                    <div class="flex items-center gap-3">
                        <InputText
id="dialog-captcha" v-model="account.captcha" type="text" placeholder="请输入验证码"
                            class="flex-1" @keyup.enter="handleLogin" />
                        <!-- 验证码图片 -->
                        <div class="flex-shrink-0">
                            <div class="relative cursor-pointer" @click="getCaptcha">
                                <img v-if="captchaImage" :src="captchaImage" alt="验证码" class="h-10 border rounded" />
                                <div
v-else
                                    class="h-10 w-20 border rounded flex items-center justify-center text-xs text-muted-color">
                                    点击获取
                                </div>
                                <!-- 验证码过期蒙层 -->
                                <div
v-if="isCaptchaExpired"
                                    class="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded cursor-pointer"
                                    @click="closeCaptchaExpiredModal">
                                    <div class="text-white text-xs text-center px-2">
                                        <i class="pi pi-exclamation-triangle text-orange-400 mb-1 block"></i>
                                        <div class="text-xs opacity-80">点击刷新</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex gap-3 pt-4">
                <Button label="登录" class="flex-1" :loading="loading" @click="handleLogin" />
            </div>
        </div>
    </Dialog>
</template>

<style scoped>
.login-dialog :deep(.p-dialog-header) {
    padding-bottom: 1rem;
}

.login-dialog :deep(.p-dialog-content) {
    padding-top: 0;
}
</style>
