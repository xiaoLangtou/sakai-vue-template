<script setup lang="ts">
import { useLucideIcon } from '@/composables';
import { AVATAR_SIZES } from '@/global/layout-sizes';
import { useLayoutStore } from '@/stores/layout';
import { Check, ChevronsUpDown } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';

const { lucideIconName } = useLucideIcon();
const layoutStore = useLayoutStore();
const { isDarkTheme } = storeToRefs(layoutStore);
const { toggleDarkMode, openConfigDrawer } = layoutStore;
const items = ref([
    {
        separator: true
    },
    {
        label: "个人信息",
        icon: "User"
    },
    {
        label: "系统设置",
        icon: "Settings",
        command: () => openConfigDrawer
    },
    {
        label: "消息通知",
        icon: "Bell"
    },
    {
        separator: true
    },
    {
        label: "外观切换",
        icon: "SunMoon",
        items: [
            {
                label: "暗黑",
                icon: "Moon",
                command: () => {
                    if (!isDarkTheme.value) {
                        toggleDarkMode();
                    }
                }
            },
            {
                label: "明亮",
                icon: "Sun",
                command: () => {
                    if (isDarkTheme.value) {
                        toggleDarkMode();
                    }
                }
            }
        ]
    },
    {
        separator: true
    },
    {
        label: '退出登录',
        icon: "LogOut",
    }
]);
const menu = ref();

const toggle = (event: MouseEvent) => {
    menu.value.toggle(event);
};
</script>
<template>
    <div
:class="[' flex items-center  p-2 bg-zinc-50 dark:bg-zinc-800 rounded-md cursor-pointer', layoutStore.isCollapsed ? 'justify-center ' : 'justify-between']"
        @click="toggle">
        <div class="flex items-center gap-4">
            <Avatar
icon="pi pi-user"
                :style="{ width: AVATAR_SIZES.MEDIUM + 'px', height: AVATAR_SIZES.MEDIUM + 'px' }" />
            <div v-if="!layoutStore.isCollapsed" class="flex flex-col">
                <span class="text-sm font-medium text-surface-900 dark:text-surface-50">用户名称</span>
                <span class="text-xs text-surface-500 dark:text-surface-400">用户角色</span>
            </div>
        </div>
        <div v-if="!layoutStore.isCollapsed" class="flex justify-center items-center">
            <ChevronsUpDown :size="16" />
        </div>
    </div>
    <TieredMenu id="overlay_menu" ref="menu" :model="items" :popup="true" class="w-full md:w-60">
        <template #start>
            <div class="flex items-center gap-4 w-full p-2">
                <Avatar
icon="pi pi-user"
                    :style="{ width: AVATAR_SIZES.MEDIUM + 'px', height: AVATAR_SIZES.MEDIUM + 'px' }" />
                <div class="flex flex-col">
                    <span class="text-sm font-medium text-surface-900 dark:text-surface-50">用户名称</span>
                    <span class="text-xs text-surface-500 dark:text-surface-400">用户角色</span>
                </div>
            </div>
        </template>
        <template #item="{ item, props, hasSubmenu }">
            <div v-ripple class="flex items-center justify-between" v-bind="props.action">
                <div class="flex items-center gap-2">
                    <component :is="lucideIconName(item.icon)" :size="16"></component>
                    <span>{{ item.label }}</span>
                    <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
                    <span
v-if="item.shortcut"
                        class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{
                            item.shortcut }}</span>
                </div>
                <i v-if="hasSubmenu" class="pi pi-angle-right ml-auto"></i>
                <Check v-if="isDarkTheme && item.icon == 'Moon'" :size="16" />
                <Check v-if="!isDarkTheme && item.icon == 'Sun'" :size="16" />
            </div>
        </template>
    </TieredMenu>
</template>



<style scoped></style>
