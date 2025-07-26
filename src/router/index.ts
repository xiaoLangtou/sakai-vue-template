
import { createRouter, createWebHashHistory } from 'vue-router';
import staticRoute from './static-route';
import type { RouteRecordRaw } from 'vue-router';
import setupPageGuard from '@/router/guard';

const routes: RouteRecordRaw[] = [...staticRoute];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

setupPageGuard(router);

export default router;
