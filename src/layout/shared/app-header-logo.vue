<script lang="ts" setup>
const router = useRouter();
const handleLogoClick = () => {
    router.push('/');
};

defineProps({
    collapsed: {
        type: Boolean,
        default: false
    }
});

</script>

<template>
    <div v-if="!collapsed" class="flex items-center gap-2 cursor-pointer" @click="handleLogoClick">
        <!-- Logo图标 -->
        <div
            class="bg-white dark:bg-surface-800 p-1 rounded-lg shadow-sm border border-surface-200/60 dark:border-surface-700/60">
            <img alt="TVA Logo" class="w-8 h-8" src="@/assets/images/logo.svg" />
        </div>

        <!-- 品牌信息 -->
        <div class="flex items-center gap-1">
            <span class="font-bold tracking-wide flex items-baseline gap-1"
                  style="font-size: 20px;">
                <em class="main-title">Tva</em>
                <em style="font-size: 14px;font-style: normal">Admin</em>
            </span>
        </div>
    </div>
    <div
        v-else
        class="bg-white dark:bg-surface-800 p-2 rounded-lg shadow-sm border border-surface-200/60 dark:border-surface-700/60 hover:shadow-md transition-shadow duration-200"
        @click="handleLogoClick">
        <img alt="TVA" class="w-6 h-6" src="@/assets/images/logo.svg" />
    </div>
</template>


<style lang="scss" scoped>
.main-title{
    @apply bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-primary-300 hover:from-primary-700 hover:to-primary-600 dark:hover:from-primary-300 dark:hover:to-primary-200 transition-all duration-300;
    font-style: normal;
}
</style>
