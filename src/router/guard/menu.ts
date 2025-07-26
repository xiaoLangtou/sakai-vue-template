import useMenuStore from "@/stores/menu";
import nProgress from "nprogress";
import type { RouteLocationNormalized, Router, RouteRecordRaw } from "vue-router";

interface VueModule {
    default: any;
    [key: string]: any;
}

export interface MetaProps {
    icon: string;
    title: string;
    activeMenu?: string;
    isLink?: string;
    isHide: boolean;
    isFull: boolean;
    isAffix: boolean;
    isKeepAlive: boolean;
}

export interface MenuOptions {
    id: number;
    path: string;
    name: string;
    component: string;
    redirect?: string;
    meta: MetaProps;
    menuType?: string;
    children?: MenuOptions[];
    parentId?: string;

    [key: string]: any;
}

const context = import.meta.webpackContext("/src/views/", {
    recursive: true,
    regExp: /\.vue$/,
    mode: 'lazy',
    chunkName: "views/[request]",
    prefetch: true,
})

const views: Record<string, any> = {}


for (const path of context.keys()) {
    const modulePath = path.replace("./", "/src/views/");
    views[modulePath] = () => (context(path) as Promise<VueModule>).then((module) => module?.default || module);
}


const toRoutes = (menus: MenuOptions[]) => {
    const routes: RouteRecordRaw[] = [];

    menus.forEach(menu => {
        const path = menu.component ? `/src/views${menu.component}${menu.component.includes('.vue') ? '' : '.vue'}` : "";
        routes.push({
            name: menu.name,
            path: menu.path,
            component: views[path] ?? "",
            children: [...toRoutes(menu.children ?? [])],
            meta: {
                ...menu.meta,
                id: menu.id,
                parentId: menu.parentId,
            }
        })

    })

    return routes;
}


const setWebsiteTitle = (router: Router, to: RouteLocationNormalized) => {
    const route = router.getRoutes().find((item: RouteRecordRaw) => item.path === to.path);
    const appTitle = import.meta.env.VITE_GLOB_APP_TITLE;
    useTitle(`${route?.meta?.title} - ${appTitle}`)
}


export default function setupMenuGuard(router: Router) {
    let has404 = false;
    router.beforeEach(async (to, from, next) => {

        nProgress.start();
        if (to.name === 'Login') {
            next();
            nProgress.done();
            return;
        }

        if (!has404) {
            has404 = true;

            router.addRoute({
                path: "/:pathMatch(.*)*",
                component: () => import('@/views/error-page/not-found.vue')
            })
        }
        await nextTick();

        const { menuList, getAuthMenuList } = useMenuStore()

        if (menuList.length) {
            next()
            nProgress.done()
            return;
        }

        const data = await getAuthMenuList();

        if (!data.length) {
            next({ name: "403" });
            nProgress.done();
            return;
        }

        const routes = toRoutes(data)
        console.log(routes)
        routes.forEach((route: RouteRecordRaw) => {
            console.log(route.name, !router.hasRoute(route.name))
            if (route.name && !router.hasRoute(route.name)) {
                router.addRoute("root", route)
            }
        })
        console.log(router.getRoutes())
        setWebsiteTitle(router, to);
        next({ ...to, replace: true });
        nProgress.done();
    })
}
