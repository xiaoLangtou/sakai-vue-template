import type { LayoutConfig, LayoutState, MenuItem, UseLayoutReturn } from '@/types/layout';
import { computed, reactive } from 'vue';

const layoutConfig = reactive<LayoutConfig>({
    preset: 'Aura',
    primary: 'emerald',
    surface: null,
    darkTheme: false,
    menuMode: 'static',
    layoutMode: 'sidebar'
});

const layoutState = reactive<LayoutState>({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
    activeMenuItem: null
});

export function useLayout(): UseLayoutReturn {
    const setActiveMenuItem = (item: MenuItem): void => {
        layoutState.activeMenuItem = item.value || item;
    };

    const toggleDarkMode = (): void => {
        if (!document.startViewTransition) {
            executeDarkModeToggle();

            return;
        }

        document.startViewTransition(() => executeDarkModeToggle());
    };

    const executeDarkModeToggle = (): void => {
        layoutConfig.darkTheme = !layoutConfig.darkTheme;
        document.documentElement.classList.toggle('app-dark');
    };

    const toggleMenu = (): void => {
        if (layoutConfig.menuMode === 'overlay') {
            layoutState.overlayMenuActive = !layoutState.overlayMenuActive;
        }

        if (window.innerWidth > 991) {
            layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive;
        } else {
            layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;
        }
    };

    const isSidebarActive = computed(() => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive);

    const isCollapsed = computed(() => layoutState.staticMenuDesktopInactive);

    const toggleSidebar = (): void => {
        toggleMenu();
    };

    const isDarkTheme = computed(() => layoutConfig.darkTheme);

    const getPrimary = computed(() => layoutConfig.primary);

    const getSurface = computed(() => layoutConfig.surface);

    return {
        layoutConfig,
        layoutState,
        toggleMenu,
        isSidebarActive,
        isCollapsed,
        toggleSidebar,
        isDarkTheme,
        getPrimary,
        getSurface,
        setActiveMenuItem,
        toggleDarkMode
    };
}
