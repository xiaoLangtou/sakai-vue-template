<script setup lang="ts">
import Breadcrumb from 'primevue/breadcrumb';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

/**
 * 面包屑导航项接口
 */
interface BreadcrumbItem {
    /** 显示标签 */
    label: string;
    /** 路由路径 */
    to: string;
    /** 图标类名 */
    icon?: string;
    /** 是否禁用 */
    disabled?: boolean;
}

const route = useRoute();

/**
 * 计算面包屑导航项
 * @returns {Array} 面包屑项数组
 */
const breadcrumbItems = computed((): BreadcrumbItem[] => {
    const matched = route.matched.filter((item) => item.meta?.title);

    // 如果当前路由就是首页，返回空数组（只显示 home）
    if (route.path === '/') {
        return [];
    }

    // 过滤掉首页路由，避免重复显示
    const filteredMatched = matched.filter((item) => item.path !== '/');

    return filteredMatched.map(
        (item, index): BreadcrumbItem => ({
            label: item.meta.title as string,
            to: item.path,
            icon: index === filteredMatched.length - 1 ? undefined : (item.meta?.icon as string), // 最后一级不显示图标
            disabled: index === filteredMatched.length - 1 // 最后一项禁用链接
        })
    );
});

/**
 * 首页面包屑项
 * @returns {Object} 首页导航项
 */
const home = computed(() => {
    // 从路由配置中获取首页标题
    const homeRoute = route.matched.find((item) => item.path === '/');
    return {
        label: homeRoute?.meta?.title || '首页',
        to: '/',
        icon: homeRoute?.meta?.icon || 'pi pi-home' // 首页显示图标
    };
});
</script>

<template>
    <div class="app-breadcrumb">
        <Breadcrumb :model="breadcrumbItems" :home="home">
            <template #item="{ item, props }">
                <router-link v-if="item.to && !item.disabled" v-bind="props.action" :to="item.to" class="breadcrumb-link">
                    <i v-if="item.icon" :class="item.icon" class="breadcrumb-icon"></i>
                    <span>{{ item.label }}</span>
                </router-link>
                <span v-else class="breadcrumb-text">
                    <i v-if="item.icon" :class="item.icon" class="breadcrumb-icon"></i>
                    <span>{{ item.label }}</span>
                </span>
            </template>
        </Breadcrumb>
    </div>
</template>

<style scoped>
.app-breadcrumb {
    background: transparent;
    padding: 0;
    border: none;
}

.app-breadcrumb :deep(.p-breadcrumb) {
    background: transparent;
    padding: 0;
    border: none;
}

.app-breadcrumb :deep(.p-breadcrumb-list) {
    background: transparent;
    padding: 0;
    margin: 0;
}

.breadcrumb-link,
.breadcrumb-text {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    color: var(--text-color-secondary);
    text-decoration: none;
    transition: color 0.2s;
}

.breadcrumb-link:hover {
    color: var(--primary-color);
}

.breadcrumb-text {
    color: var(--text-color);
    font-weight: 500;
}

.breadcrumb-icon {
    font-size: 0.875rem;
}

/* PrimeVue 面包屑样式覆盖 */
.app-breadcrumb :deep(.p-breadcrumb-list li) {
    background: transparent;
}

.app-breadcrumb :deep(.p-breadcrumb-list li .p-breadcrumb-separator) {
    color: var(--text-color-secondary);
    margin: 0 0.5rem;
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
    .breadcrumb-link {
        color: var(--surface-400);
    }

    .breadcrumb-link:hover {
        color: var(--primary-300);
    }

    .breadcrumb-text {
        color: var(--surface-0);
    }

    .app-breadcrumb :deep(.p-breadcrumb-list li .p-breadcrumb-separator) {
        color: var(--surface-400);
    }
}
</style>
