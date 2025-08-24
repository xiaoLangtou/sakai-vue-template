<script setup>
import { computed } from 'vue';
import { useLayoutStore } from '@/stores/layout';
import { storeToRefs } from 'pinia';
import DefaultLayout from './default-layout/app-layout.vue';
import TopbarLayout from './topbar-layout/app-layout.vue';
import AppConfigurator from './shared/app-configurator.vue';

const layoutStore = useLayoutStore();
const { layoutConfig, layoutState } = storeToRefs(layoutStore);



const currentLayout = computed(() => {
    switch (layoutConfig.value.layoutMode) {
        case 'topbar':
            return TopbarLayout;
        default:
            return DefaultLayout;
    }
});
</script>

<template>
    <component :is="currentLayout" />
     <!-- 系统配置抽屉 -->
    <AppConfigurator v-model:visible="layoutState.configSidebarVisible" />
</template>
