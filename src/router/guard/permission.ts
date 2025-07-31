import { useAuthStore } from "@/stores";
import nProgress from "nprogress";
import { nextTick } from "vue";
import type { LocationQueryRaw, Router } from "vue-router";

export default function setupPermissionGuard(router: Router) {
    router.beforeEach(async (to, from, next) => {
        const { isLogin } = useAuthStore()
        nProgress.start();

        if (!isLogin) {
            if (to.name === 'Login') {
                next();
                nProgress.done();
                return;
            }
            // 如果没有登录且不是访问登录页，直接跳转到登录页
            // 不显示toast，因为这是初始访问，不是token失效
            await nextTick();
            next({
                name: 'Login',
                query: {
                    redirect: to.name as string,
                    ...to.query,
                },
            } as unknown as LocationQueryRaw);
            nProgress.done();
        } else {
            next();
            nProgress.done();
        }
    });
}
