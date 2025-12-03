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
    captchaId: ''
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
    <div class="bg-surface-0 dark:bg-surface-900 min-h-screen w-full flex overflow-hidden text-surface-900 dark:text-surface-0">
        <!-- 左侧视觉区域 -->
        <div class="hidden lg:flex lg:w-1/2 relative bg-primary-600 items-center justify-center overflow-hidden">
            <!-- 背景渐变与装饰 -->
            <div class="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-800 opacity-90 z-0"></div>
            <div class="absolute inset-0 bg-[url('@/assets/images/login-bg.png')] bg-cover bg-center opacity-10 mix-blend-overlay z-0"></div>

            <!-- 动态光斑 -->
            <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white/20 rounded-full blur-[100px] animate-pulse-slow"></div>
            <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-900/30 rounded-full blur-[120px]"></div>

            <!-- 内容展示 -->
            <div class="relative z-10 flex flex-col items-center text-center px-12">
                <div class="mb-12 relative">
                    <!-- 光效背景 -->
                    <div class="absolute inset-0 bg-white/20 blur-3xl rounded-full transform scale-75"></div>
                    <img src="@/assets/images/login-bg.png" class="w-[400px] relative z-10 drop-shadow-2xl animate-float" alt="Illustration" />
                </div>
                <h2 class="text-3xl xl:text-4xl font-bold text-white mb-4 tracking-tight">欢迎使用 Sakai Vue</h2>
                <p class="text-primary-100 text-lg max-w-md leading-relaxed">构建现代化、高效、安全的企业级应用系统的最佳选择。</p>
            </div>
        </div>

        <!-- 右侧表单区域 -->
        <div class="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
            <!-- 移动端顶部装饰 -->
            <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500 to-primary-700 lg:hidden"></div>

            <div class="w-full max-w-[420px] space-y-8">
                <!-- 头部信息 -->
                <div class="text-center mb-8">
                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-6 shadow-sm">
                        <img class="w-10 h-10" src="@/assets/images/logo.svg" alt="Logo" />
                    </div>
                    <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-2">登录账户</h1>
                    <p class="text-surface-500 dark:text-surface-400">请输入您的账号密码以继续</p>
                </div>

                <!-- 表单内容 -->
                <div class="flex flex-col gap-5">
                    <!-- 账号 -->
                    <div class="flex flex-col gap-2">
                        <label for="username" class="text-sm font-medium text-surface-700 dark:text-surface-300">账号</label>
                        <IconField>
                            <InputIcon class="pi pi-user text-surface-400" />
                            <InputText id="username" v-model="account.username" class="w-full pl-10" size="large" placeholder="请输入账号" :class="{ 'p-invalid': !account.username && checked }" />
                        </IconField>
                    </div>

                    <!-- 密码 -->
                    <div class="flex flex-col gap-2">
                        <div class="flex justify-between items-center">
                            <label for="password" class="text-sm font-medium text-surface-700 dark:text-surface-300">密码</label>
                        </div>
                        <IconField>
                            <InputIcon class="pi pi-lock z-10 text-surface-400" />
                            <Password id="password" v-model="account.password" :feedback="false" toggle-mask class="w-full" :input-class="'w-full pl-10 p-3'" placeholder="请输入密码" />
                        </IconField>
                    </div>

                    <!-- 验证码 -->
                    <div class="flex flex-col gap-2">
                        <label for="captcha" class="text-sm font-medium text-surface-700 dark:text-surface-300">验证码</label>
                        <div class="flex gap-3">
                            <IconField class="flex-1">
                                <InputIcon class="pi pi-shield text-surface-400" />
                                <InputText id="captcha" v-model="account.captcha" class="w-full pl-10" size="large" placeholder="验证码" @keyup.enter="handleLogin" />
                            </IconField>
                            <div class="relative shrink-0">
                                <div class="h-[46px] w-32 rounded-md overflow-hidden border border-surface-200 dark:border-surface-700 cursor-pointer relative group transition-all hover:border-primary-500 hover:shadow-sm" @click="getCaptcha">
                                    <img v-if="captchaImage" :src="captchaImage" alt="验证码" class="w-full h-full object-cover" />
                                    <div v-else class="w-full h-full flex items-center justify-center bg-surface-50 dark:bg-surface-800 text-xs text-surface-400"><i class="pi pi-refresh mr-1"></i> 获取中</div>

                                    <!-- 过期遮罩 -->
                                    <div v-if="isCaptchaExpired" class="absolute inset-0 bg-surface-900/80 backdrop-blur-[1px] flex flex-col items-center justify-center text-white/90 z-10">
                                        <i class="pi pi-exclamation-circle mb-1 text-orange-400"></i>
                                        <span class="text-xs font-medium">点击刷新</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 选项 -->
                    <div class="flex items-center justify-between mt-2">
                        <div class="flex items-center gap-2">
                            <Checkbox id="rememberme" v-model="checked" binary />
                            <label for="rememberme" class="text-sm text-surface-600 dark:text-surface-400 cursor-pointer select-none hover:text-surface-900 dark:hover:text-surface-200 transition-colors">记住我</label>
                        </div>
                        <span class="text-sm font-medium text-primary-600 hover:text-primary-700 cursor-pointer transition-colors">忘记密码？</span>
                    </div>

                    <!-- 登录按钮 -->
                    <Button label="登录" class="w-full mt-2 font-bold text-lg shadow-lg shadow-primary-500/30" size="large" :loading="loading" @click="handleLogin" />
                </div>

                <!-- 底部 -->
                <div class="text-center mt-8 text-sm text-surface-500 dark:text-surface-400">
                    还没有账号？
                    <span class="font-medium text-primary-600 hover:text-primary-700 cursor-pointer transition-colors">立即注册</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 浮动动画 */
@keyframes float {
    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-20px);
    }
}

.animate-float {
    animation: float 6s ease-in-out infinite;
}

/* 缓慢脉冲 */
@keyframes pulse-slow {
    0%,
    100% {
        opacity: 0.4;
        transform: scale(1);
    }

    50% {
        opacity: 0.2;
        transform: scale(1.1);
    }
}

.animate-pulse-slow {
    animation: pulse-slow 8s infinite ease-in-out;
}
</style>
