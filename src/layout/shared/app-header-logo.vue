<script setup lang="ts">
const router = useRouter();
const handleLogoClick = () => {
    router.push("/");
}

defineProps({
    collapsed: {
        type: Boolean,
        default: false
    }
})

</script>

<template>
    <div v-if="!collapsed" class="flex items-center gap-2 cursor-pointer" @click="handleLogoClick">
        <!-- Logo图标 -->
        <div
            class="bg-white dark:bg-surface-800 p-2 rounded-lg shadow-sm border border-surface-200/60 dark:border-surface-700/60">
            <img src="@/assets/images/logo.svg" alt="TVA Logo" class="w-6 h-6" />
        </div>

        <!-- 品牌信息 -->
        <div class="flex items-center">
            <span class="text-base font-semibold text-surface-900 dark:text-surface-50">
                TVA
            </span>
        </div>
    </div>
    <div
v-else class="bg-white dark:bg-surface-800 p-2 rounded-lg shadow-sm border border-surface-200/60 dark:border-surface-700/60 hover:shadow-md transition-shadow duration-200"
        @click="handleLogoClick">
        <img src="@/assets/images/logo.svg" alt="TVA" class="w-6 h-6" />
    </div>
</template>


<style scoped></style>
