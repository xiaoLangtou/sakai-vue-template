<script setup>
import { useGlobalToast } from './composables/useGlobalToast';
import { useLoginDialog } from './composables/useLoginDialog';
import PageLoading from '@/components/page-loading/index.vue';
import { LoginDialog } from '@/components';

// 启用全局 Toast 监听
useGlobalToast();

// 获取登录弹窗状态
const { isLoginDialogVisible } = useLoginDialog();
</script>

<template>
    <router-view />
    <Toast />
    <PageLoading />
    
    <!-- 全局登录弹窗 -->
    <LoginDialog 
        v-model:visible="isLoginDialogVisible"
        @login-success="() => {}"
    />
</template>

<style scoped></style>
