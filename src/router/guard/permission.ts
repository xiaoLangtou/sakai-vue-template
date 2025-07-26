import globalToast from "@/services/core/toast";
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
            await nextTick();
            globalToast.warn("请先登录");
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
