<script lang="ts" setup>
import DarkLogo from '@/assets/images/dark-logo.svg';
import LightLogo from '@/assets/images/light-logo.svg';
import DarkSmallLogo from '@/assets/images/dark-small-logo.svg';
import LightSmallLogo from '@/assets/images/light-small-logo.svg';
import { useLayoutStore } from '@/stores/layout.ts';
import { storeToRefs } from 'pinia';




const router = useRouter();
const handleLogoClick = () => {
    router.push('/');
};

const layoutStore = useLayoutStore();
const { isDarkTheme } = storeToRefs(layoutStore);


const logo = computed(() => {
    return isDarkTheme.value ? DarkLogo : LightLogo;
})

const smallLogo = computed(() => {
    return isDarkTheme.value ? DarkSmallLogo : LightSmallLogo;
})

defineProps({
    collapsed: {
        type: Boolean,
        default: false
    }
});


</script>

<template>
    <div v-if="!collapsed" class="flex items-center gap-2 cursor-pointer" @click="handleLogoClick">
        <img :src="logo" alt="TVA Logo" class="w-full h-10" />
    </div>
    <div
        v-else
        class="bg-white dark:bg-surface-800 p-2 rounded-lg shadow-sm border border-surface-200/60 dark:border-surface-700/60 hover:shadow-md transition-shadow duration-200"
        @click="handleLogoClick">
        <img alt="TVA" class="w-6 h-6" :src="smallLogo" />
    </div>
</template>


<style scoped></style>
