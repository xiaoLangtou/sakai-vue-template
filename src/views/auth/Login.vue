<script lang="ts" setup>
import FloatingConfigurator from '@/components/floating-configurator/index.vue';
import { CAPTCHA_EXPIRE_TIME } from '@/global/constants';
import { loginService } from '@/services/modules/login';
import type { ICaptcha, ILoginAccount } from '@/services/types/login';
import { to } from '@/utils/result-handler';

import globalToast from '@/services/core/toast';
import { useAuthStore } from '@/stores/auth';
import { onMounted, onUnmounted, ref } from 'vue';

const { loginAction } = useAuthStore();

const account = reactive<ILoginAccount>({
    username: 'admin',
    password: '12345678',
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
            return globalToast.warn("请输入账号和密码");
        }

        if (!account.captcha) {
            return globalToast.warn("请输入验证码");
        }
        loading.value = true;
        await loginAction(account);
        globalToast.success(`${getGreeting()}，欢迎回来！`);
    } finally {
        await getCaptcha();
        loading.value = false;
    }

};

// 组件挂载时获取验证码
onMounted(() => {
    getCaptcha();
});

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

const checked = ref(false);
</script>

<template>
    <FloatingConfigurator />
    <div
        class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8 flex flex-col items-center gap-2">
                        <img class="w-[54px] h-[54px]" src="@/assets/images/light-logo.svg" />
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">欢迎来到 TVA!</div>
                        <span class="text-muted-color font-medium">请使用您的账号密码登录系统</span>
                    </div>

                    <div>
                        <label
for="username"
                            class="block text-surface-900 dark:text-surface-0 font-medium mb-2">账号</label>
                        <InputText
id="username" v-model="account.username" type="text" placeholder="请输入账号"
                            class="w-full md:w-[30rem] mb-4" />

                        <label
for="password"
                            class="block text-surface-900 dark:text-surface-0 font-medium mb-2">密码</label>
                        <Password
id="password" v-model="account.password" placeholder="请输入密码" :toggle-mask="true"
                            class="mb-4 md:w-[30rem]" fluid :feedback="false"></Password>

                        <!-- 验证码 -->
                        <label
for="captcha"
                            class="block text-surface-900 dark:text-surface-0 font-medium mb-2">验证码</label>
                        <div class="flex items-center justify-between gap-4 md:w-[30rem] mb-8">
                            <InputText
id="captcha" v-model="account.captcha" type="text" placeholder="请输入验证码"
                                class="w-full" />
                            <!-- 验证码图片 -->
                            <div class="flex-shrink-0">
                                <div class="relative cursor-pointer" @click="getCaptcha">
                                    <img
v-if="captchaImage" :src="captchaImage" alt="验证码"
                                        class="h-10 border rounded" />
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

                        <div class="flex items-center justify-between mb-8">
                            <div class="flex items-center">
                                <Checkbox id="rememberme1" v-model="checked" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">记住我</label>
                            </div>
                            <span
                                class="text-primary font-medium no-underline ml-2 text-right cursor-pointer">忘记密码？</span>
                        </div>
                        <Button label="登录" class="w-full" :loading="loading" @click="handleLogin"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>


</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
