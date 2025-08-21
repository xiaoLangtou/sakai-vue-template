<script lang="ts" setup>
import AppConfigurator from '@/layout/shared/app-configurator.vue';
import { useLayoutStore } from '@/stores/layout';
import { storeToRefs } from 'pinia';

const layoutStore = useLayoutStore();
const { isDarkTheme } = storeToRefs(layoutStore);
const { toggleDarkMode } = layoutStore;
</script>

<template>
    <div class="fixed flex gap-4 top-8 right-8">
        <Button type="button" @click="toggleDarkMode" rounded :icon="isDarkTheme ? 'pi pi-moon' : 'pi pi-sun'"
            severity="secondary" />
        <div class="relative">
            <Button icon="pi pi-palette"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                type="button" rounded />
            <AppConfigurator />
        </div>
    </div>
</template>
