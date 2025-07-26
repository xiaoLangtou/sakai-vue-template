/**
 * @Author: weipc 755197142@qq.com
 * @Date: 2025-02-17 21:44:48
 * @LastEditors: weipc 755197142@qq.com
 * @LastEditTime: 2025-04-10 10:38:36
 * @FilePath: src/router/static-route.ts
 * @Description: 这是默认设置,可以在设置》工具》File Description中进行配置
 */
import DynamicLayout from '@/layout/dynamic-layout.vue';
import type { RouteRecordRaw } from 'vue-router';

const staticRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'root',
        component: DynamicLayout,
        redirect: '/dashboard',
        meta: {
            title: '首页',
            icon: 'pi pi-home'
        },
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                component: () => import('@/views/dashboard/index.vue')
            },
            
        ]
    },
    {
        path: '/auth/login',
        name: 'Login',
        component: () => import('@/views/auth/Login.vue'),
        meta: {
            title: '登录'
        }
    },
    {
        path: '/403',
        name: '403',
        component: () => import('@/views/error-page/forbidden.vue'),
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/error-page/not-found.vue'),
    },
    {
        path: '/503',
        name: '503',
        component: () => import('@/views/error-page/service-unavailable.vue'),
    },
]

export default staticRoutes;
