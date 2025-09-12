<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useLayoutStore } from '@/stores/layout';
import { storeToRefs } from 'pinia';
import Drawer from 'primevue/drawer';
import OverlayPanel from 'primevue/overlaypanel';
import { UserProfile } from '@/components';
import { useAuthStore } from '@/stores';
import { AVATAR_SIZES } from '@/global/layout-sizes';
import { Bell, CalendarDays, MoonIcon, Sun, SwatchBook } from 'lucide-vue-next';
// ==================== Store 状态管理 ====================
const layoutStore = useLayoutStore();
const { isDarkTheme } = storeToRefs(layoutStore);
const { toggleDarkMode, openConfigDrawer } = layoutStore;
const authStore = useAuthStore();
// ==================== 本地状态管理 ====================
/** 用户资料抽屉显示状态 */
const profileDrawerVisible = ref<boolean>(false);
/** 移动端菜单面板引用 */
const mobileMenuPanel = ref<InstanceType<typeof OverlayPanel>>();

// ==================== 事件处理方法 ====================
const avatarProps = computed(() => {
    const props: Record<string, any> = {};
    if ( authStore.userInfo?.headPic ) {
        props.image = authStore.userInfo?.headPic;
    } else {
        props.icon = 'pi pi-user';
    }
    return props;
});

/**
 * 打开用户资料抽屉
 */
const openProfileDrawer = (): void => {
    profileDrawerVisible.value = true;
};

/**
 * 切换移动端菜单面板
 */
const toggleMobileMenu = (event: Event): void => {
    mobileMenuPanel.value?.toggle(event);
};
</script>

<template>
    <div :class="[
        'layout-topbar',
        {
            'mobile-topbar': layoutStore.isMobile,
            'desktop-topbar': !layoutStore.isMobile
        }
    ]">
        <div class="layout-topbar-actions">
            <!-- 移动端布局 -->
            <template v-if="layoutStore.isMobile">
                <!-- 主题切换按钮 -->
                <button class="layout-topbar-action" type="button" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>

                <!-- 移动端更多菜单 -->
                <button aria-label="更多选项" class="layout-topbar-action" type="button" @click="toggleMobileMenu">
                    <i class="pi pi-ellipsis-v"></i>
                </button>

                <!-- 移动端菜单面板 -->
                <OverlayPanel ref="mobileMenuPanel" class="mobile-menu-panel">
                    <div class="mobile-menu-content">
                        <button class="mobile-menu-item" type="button" @click="openProfileDrawer">
                            <i class="pi pi-calendar"></i>
                            <span>Calendar</span>
                        </button>
                        <button class="mobile-menu-item" type="button">
                            <i class="pi pi-inbox"></i>
                            <span>Messages</span>
                        </button>
                        <button class="mobile-menu-item" type="button" @click="openProfileDrawer">
                            <i class="pi pi-user"></i>
                            <span>Profile</span>
                        </button>
                        <div class="mobile-menu-divider"></div>
                        <button class="mobile-menu-item" type="button" @click="openConfigDrawer">
                            <i class="pi pi-palette"></i>
                            <span>主题配置</span>
                        </button>
                    </div>
                </OverlayPanel>
            </template>

            <!-- 桌面端布局 -->
            <template v-else>
                <div class="layout-config-menu">
                    <div class="layout-topbar-action" @click="toggleDarkMode">
                        <Sun v-if="!isDarkTheme" :size="18" />
                        <MoonIcon v-else :size="18" />
                    </div>
                    <div class="layout-topbar-action"
                         @click="openConfigDrawer">
                        <SwatchBook :size="18"></SwatchBook>
                    </div>

                    <div
                        class="layout-topbar-action  hidden lg:block"
                        @click="openProfileDrawer">
                        <OverlayBadge>
                            <CalendarDays :size="18" />
                        </OverlayBadge>
                    </div>

                    <div class="layout-topbar-action  hidden lg:block">
                        <OverlayBadge>
                            <Bell :size="18" class="bell-animation" />
                        </OverlayBadge>
                    </div>

                    <div
                        class=" hidden lg:block ml-1"
                        @click="openProfileDrawer">
                        <Avatar :style="{ width: AVATAR_SIZES.MEDIUM + 'px', height: AVATAR_SIZES.MEDIUM + 'px' }"
                                class="overflow-hidden rounded-sm"
                                v-bind="avatarProps" />
                    </div>
                </div>
            </template>
        </div>
    </div>

    <!-- 用户资料抽屉 -->
    <Drawer v-model:visible="profileDrawerVisible" :style="{ width: layoutStore.isMobile ? '100vw' : '50rem' }"
            class="profile-drawer" header="Profile"
            position="right">
        <UserProfile />
    </Drawer>

</template>


<style lang="scss" scoped>

</style>
