import { loginService } from "@/services/modules/login";
import { useAuthStore } from "@/stores";
import nProgress from "nprogress";
import type { LocationQueryRaw, Router } from "vue-router";
import { to as _to } from "@/utils/result-handler";

export default function setupInfoGuard(router: Router) {
    router.beforeEach(async (to, from, next) => {
        nProgress.start();
        if (to.name === 'Login') {
            next();
            nProgress.done();
            return;
        }
        const { setToken, setUserInfo } = useAuthStore()

        const gotoLogin = () => {
            next({
                name: "Login",
                query: {
                    redirect: to.name,
                    ...to.query
                }
            } as unknown as LocationQueryRaw)

            setToken('')
            nProgress.done();
        }


        const result = await _to(loginService.getUserInfo())
        if (!result.ok) {
            gotoLogin()
            return;
        }
        const { userInfo } = result.value ?? { userInfo: null }
        if (!userInfo) {
            gotoLogin()
            return;
        }
        setUserInfo(userInfo)
        next()
        nProgress.done();
    })
}
