<script setup>
import { computed } from 'vue';
import { useLayout } from './composables/layout';
import DefaultLayout from './default-layout/app-layout.vue';
import TopbarLayout from './topbar-layout/app-layout.vue';

const { layoutConfig } = useLayout();

const currentLayout = computed(() => {
    switch (layoutConfig.layoutMode) {
        case 'topbar':
            return TopbarLayout;
        default:
            return DefaultLayout;
    }
});
</script>

<template>
    <component :is="currentLayout" />
</template>
