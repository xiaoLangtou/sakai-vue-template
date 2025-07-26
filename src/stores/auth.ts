import { LOGIN_URL } from '@/global/constants';
import router from '@/router';
import { loginService } from '@/services/modules/login';
import { type ILoginAccount, type ILoginResponse, type IUserInfo } from '@/services/types/login';
import { to } from '@/utils/result-handler';
import { StorageUtil } from '@/utils/storage';
import md5 from 'md5';
import { defineStore } from 'pinia';
import { useConfirm } from "primevue/useconfirm";
import { computed, ref } from 'vue';



/**
 * 用户认证 Store
 */
export const useAuthStore = defineStore('auth', () => {
    const token = ref(StorageUtil.get("accessToken") ?? '');
    const userInfo = ref<IUserInfo>();
    const confirm = useConfirm();

    const isLogin = computed(() => {
        return !!token.value;
    })

    const getToken = computed(() => {
        return token.value;
    })

    const setToken = (_token: string) => {
        token.value = _token;
    }

    const setUserInfo = (_userInfo: IUserInfo) => {
        userInfo.value = _userInfo;
    }
    const loginAction = async (account: ILoginAccount) => {
        const result = await to<ILoginResponse>(loginService.login({
            username: account.username,
            password: md5(account.password),
            captcha: account.captcha,
            captchaId: account.captchaId,
        }))
        if (!result.ok) return Promise.reject(result.error);
        const { accessToken, userInfo } = result.value;
        setToken(accessToken);
        StorageUtil.set('accessToken', accessToken);
        setUserInfo(userInfo);

        console.log(router)

        await router.replace({
            name: 'dashboard',
        })
    }

    const logoutAction = async () => {
        await confirm.require({
            message: '确定退出登录吗？',
            header: '提示',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                const result = await to(loginService.logout());
                if (!result.ok) return;
                setToken('');
                setUserInfo({} as IUserInfo);
                await router.replace(LOGIN_URL);
            }
        });
    }


    return {
        isLogin,
        getToken,
        setToken,
        setUserInfo,
        loginAction,
        logoutAction,
    }


});
