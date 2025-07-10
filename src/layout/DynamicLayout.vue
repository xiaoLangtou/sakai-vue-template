<script setup>
import { computed } from 'vue';
import { useLayout } from './composables/layout';
import DefaultLayout from './default-layout/AppLayout.vue';
import TopbarLayout from './topbar-layout/AppLayout.vue';

const { layoutConfig } = useLayout();

const currentLayout = computed(() => {
    return layoutConfig.layoutMode === 'topbar' ? TopbarLayout : DefaultLayout;
});
</script>

<template>
    <component :is="currentLayout" />
</template>
