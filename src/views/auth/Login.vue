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
    if ( !result.ok ) {
        console.error('获取验证码失败:', result.error);
        return;
    }
    account.captchaId = result.value.captchaId;
    captchaImage.value = `data:image/svg+xml;base64,${ btoa(result.value.captcha) }`;

    // 开始过期定时器
    startCaptchaExpireTimer();
};

/**
 * 启动验证码过期定时器
 */
const startCaptchaExpireTimer = () => {
    // 清除之前的定时器
    if ( expireTimer ) {
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
        if ( !account.username || !account.password ) {
            return globalToast.warn('请输入账号和密码');
        }

        if ( !account.captcha ) {
            return globalToast.warn('请输入验证码');
        }
        loading.value = true;
        await loginAction(account);
        globalToast.success(`${ getGreeting() }，欢迎回来！`);
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
    if ( expireTimer ) {
        clearTimeout(expireTimer);
    }
});

// 写个方法，用来判断时间，区分上午、下午、晚上
const getGreeting = () => {
    const hour = new Date().getHours();
    if ( hour < 12 ) return '早上好';
    if ( hour < 18 ) return '下午好';
    return '晚上好';
};

const checked = ref(false);
</script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 min-h-screen flex "  >
        <!-- 左侧背景区域 -->
        <div class="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-800 items-center justify-center overflow-hidden">
            <!-- 背景装饰 -->
            <div class="absolute inset-0 bg-black/10"></div>
            <div class="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div class="absolute bottom-20 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>

            <!-- 浮动背景图片 -->
            <img src="@/assets/images/login-bg.png" class="w-3/4 max-w-md object-contain animate-float relative z-10" alt="">

        </div>

        <!-- 右侧登录表单区域 -->
        <div class="w-full lg:w-1/2 flex items-center justify-center p-8">
            <div class="w-full max-w-md">
                <!-- Logo 和标题 -->
                <div class="text-center mb-8">
                    <img class="w-16 h-16 mx-auto mb-6" src="@/assets/images/logo.svg" />
                    <h1 class="text-surface-900 dark:text-surface-0 text-2xl font-semibold mb-2">登录账户</h1>
                    <p class="text-muted-color">请使用您的账号密码登录系统</p>
                </div>

                <!-- 登录表单 -->
                <div class="space-y-6">
                    <!-- 账号输入 -->
                    <div>
                        <label class="block text-surface-900 dark:text-surface-0 font-medium mb-2" for="username">账号</label>
                        <InputText
                            id="username"
                            v-model="account.username"
                            class="w-full"
                            placeholder="请输入账号"
                            type="text" />
                    </div>

                    <!-- 密码输入 -->
                    <div>
                        <label class="block text-surface-900 dark:text-surface-0 font-medium mb-2" for="password">密码</label>
                        <Password
                            id="password"
                            v-model="account.password"
                            :feedback="false"
                            :toggle-mask="true"
                            class="w-full"
                            fluid
                            placeholder="请输入密码" />
                    </div>

                    <!-- 验证码 -->
                    <div>
                        <label class="block text-surface-900 dark:text-surface-0 font-medium mb-2" for="captcha">验证码</label>
                        <div class="flex items-center gap-4">
                            <InputText
                                id="captcha"
                                v-model="account.captcha"
                                class="flex-1"
                                placeholder="请输入验证码"
                                type="text" />
                            <!-- 验证码图片 -->
                            <div class="flex-shrink-0">
                                <div class="relative cursor-pointer" @click="getCaptcha">
                                    <img
                                        v-if="captchaImage"
                                        :src="captchaImage"
                                        alt="验证码"
                                        class="h-10 border rounded hover:border-primary-500 transition-colors" />
                                    <div
                                        v-else
                                        class="h-10 w-20 border rounded flex items-center justify-center text-xs text-muted-color hover:border-primary-500 transition-colors">
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

                    <!-- 记住我和忘记密码 -->
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <Checkbox id="rememberme1" v-model="checked" binary class="mr-2"></Checkbox>
                            <label for="rememberme1" class="text-surface-700 dark:text-surface-300">记住我</label>
                        </div>
                        <span class="text-primary font-medium cursor-pointer hover:text-primary-600 transition-colors">
                            忘记密码？
                        </span>
                    </div>

                    <!-- 登录按钮 -->
                    <Button
                        :loading="loading"
                        class="w-full"
                        label="登录"
                        size="large"
                        @click="handleLogin" />
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

/* 上下浮动动画 */
.animate-float {
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-20px);
    }
}

.auth-bg:after {
    background-color: #efefef;
    background-image: linear-gradient(90deg, rgba(60, 10, 30, 0.04) 3%, transparent 0), linear-gradient(1turn, rgba(60, 10, 30, 0.04) 3%, transparent 0);
    background-size: 20px 20px;
    background-position: 50%;
    background-repeat: repeat;
}

.auth-bg:after {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -10;
    pointer-events: none;
}
</style>
