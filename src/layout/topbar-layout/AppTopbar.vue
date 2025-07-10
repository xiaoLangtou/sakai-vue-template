<script setup>
import { useLayout } from '../composables/layout';
import AppConfigurator from './AppConfigurator.vue';

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
                <div class="relative">
                    <button
                        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                        type="button" class="layout-topbar-action layout-topbar-action-highlight">
                        <i class="pi pi-palette"></i>
                    </button>
                    <AppConfigurator />
                </div>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-inbox"></i>
                        <span>Messages</span>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.layout-topbar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.layout-topbar-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.layout-config-menu {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.layout-topbar-action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border: none;
    background: transparent;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s;
    color: var(--text-color);
}

.layout-topbar-action:hover {
    background: var(--surface-hover);
}

.layout-topbar-action-highlight {
    background: var(--primary-color);
    color: var(--primary-color-text);
}

.layout-topbar-action-highlight:hover {
    background: var(--primary-color);
    opacity: 0.8;
}

.layout-topbar-menu-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.layout-topbar-menu-content .layout-topbar-action {
    width: auto;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    gap: 0.5rem;
}

.layout-topbar-menu-content .layout-topbar-action span {
    font-size: 0.875rem;
    font-weight: 500;
}
</style>
