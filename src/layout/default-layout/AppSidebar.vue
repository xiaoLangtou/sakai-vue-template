<script setup>
import { computed, ref } from 'vue';
import AppMenu from './AppMenu.vue';

const props = defineProps({
    collapsed: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['toggle-sidebar']);

const userAvatar = computed(() => '/default-avatar.png');
const userName = computed(() => '未知用户');
const userRole = computed(() => '普通用户');

const toggleSidebar = () => {
    emit('toggle-sidebar');
};
</script>

<template>
    <aside :class="[
        'sidebar',
        'fixed lg:relative',
        'top-0 left-0 h-full',
        'bg-surface-0 dark:bg-surface-900',
        'border-r border-surface-200 dark:border-surface-700',
        'transition-all duration-300 ease-in-out',
        'z-40',
        collapsed ? 'w-16' : 'w-64',
        'flex flex-col',
        'shadow-lg lg:shadow-none'
    ]">
        <!-- 顶部Logo区域 -->
        <div :class="[
            'flex items-center gap-3',
            'pl-4 border-b border-surface-200 dark:border-surface-700',
            'min-h-[4rem]'
        ]">
            <!-- 折叠按钮 -->
            <Button
                @click="toggleSidebar"
                :icon="collapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'"
                severity="secondary"
                text
                rounded
                :class="[
                    'w-8 h-8 flex-shrink-0',
                    'hover:bg-surface-100 dark:hover:bg-surface-800',
                    'transition-colors duration-200'
                ]"
            />

            <!-- Logo -->
            <Transition
                enter-active-class="transition-all duration-300"
                leave-active-class="transition-all duration-300"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
            >
                <div v-show="!collapsed" class="flex items-center gap-2 min-w-0">
                    <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="pi pi-bolt text-white text-sm"></i>
                    </div>
                    <span class="text-lg font-semibold text-surface-900 dark:text-surface-0 truncate">
                        SAKAI
                    </span>
                </div>
            </Transition>
        </div>

        <!-- 中间导航菜单 -->
        <div class="flex-1 overflow-y-auto overflow-x-hidden">
            <div class="p-2">
                <AppMenu :collapsed="collapsed" />
            </div>
        </div>

        <!-- 底部用户信息 -->
        <div :class="[
            'p-4 border-t border-surface-200 dark:border-surface-700',
            'min-h-[5rem]'
        ]">
            <div class="flex items-center gap-3">
                <!-- 用户头像 -->
                <Avatar
                    :image="userAvatar"
                    size="normal"
                    shape="circle"
                    class="flex-shrink-0"
                />

                <!-- 用户信息 -->
                <Transition
                    enter-active-class="transition-all duration-300"
                    leave-active-class="transition-all duration-300"
                    enter-from-class="opacity-0 translate-x-2"
                    enter-to-class="opacity-100 translate-x-0"
                    leave-from-class="opacity-100 translate-x-0"
                    leave-to-class="opacity-0 translate-x-2"
                >
                    <div v-show="!collapsed" class="flex-1 min-w-0">
                        <div class="text-sm font-medium text-surface-900 dark:text-surface-0 truncate">
                            {{ userName }}
                        </div>
                        <div class="text-xs text-surface-500 dark:text-surface-400 truncate">
                            {{ userRole }}
                        </div>
                    </div>
                </Transition>

                <!-- 用户操作按钮 -->
                <Transition
                    enter-active-class="transition-all duration-300"
                    leave-active-class="transition-all duration-300"
                    enter-from-class="opacity-0 scale-95"
                    enter-to-class="opacity-100 scale-100"
                    leave-from-class="opacity-100 scale-100"
                    leave-to-class="opacity-0 scale-95"
                >
                    <Button
                        v-show="!collapsed"
                        icon="pi pi-cog"
                        severity="secondary"
                        text
                        rounded
                        size="small"
                        class="flex-shrink-0"
                        v-tooltip.top="'设置'"
                    />
                </Transition>
            </div>
        </div>
    </aside>
</template>
