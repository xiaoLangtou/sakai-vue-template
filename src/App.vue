<script setup>
import { useGlobalToast } from './composables/useGlobalToast';
import PageLoading from '@/components/page-loading/index.vue';

// 启用全局 Toast 监听
useGlobalToast();
</script>

<template>
    <router-view />
    <Toast />
    <PageLoading />
</template>

<style scoped></style>
