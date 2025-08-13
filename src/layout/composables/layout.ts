import type { LayoutConfig, LayoutState, MenuItem, UseLayoutReturn } from '@/types/layout';
import { computed, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';

const layoutConfig = reactive<LayoutConfig>({
    preset: 'Aura',
    primary: 'emerald',
    surface: null,
    darkTheme: false,
    menuMode: 'static',
    layoutMode: 'sidebar',
    showTab: true,
    tabStyle: "Fashion",
    isShowIcon: true
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
    // 响应式断点状态
    const windowWidth = ref(window.innerWidth);

    // 响应式断点
    const isMobile = computed(() => windowWidth.value < 768)
    const isTablet = computed(() => windowWidth.value >= 768 && windowWidth.value < 1600)
    const isDesktop = computed(() => windowWidth.value >= 1600)

    // 移动端侧边栏显示状态
    const showMobileSidebar = ref(false);

    // 监听窗口大小变化
    const handleResize = () => {
        windowWidth.value = window.innerWidth;

        // 当切换到桌面端时，关闭移动端侧边栏并自动展开侧边栏
        if (isDesktop.value) {
            if (showMobileSidebar.value) {
                showMobileSidebar.value = false;
            }
            if (layoutState.staticMenuDesktopInactive) {
                layoutState.staticMenuDesktopInactive = false;
            }
        }
    };

    onMounted(() => {
        window.addEventListener('resize', handleResize);
        handleResize(); // 初始化

        // 确保主题在应用启动时正确应用
        nextTick(() => {
            // 触发主题更新事件，确保配置器能够应用当前的主题设置
            const event = new CustomEvent('layout-config-changed', {
                detail: { primary: layoutConfig.primary, surface: layoutConfig.surface }
            });
            window.dispatchEvent(event);
        });
    });

    onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
    });

    const setActiveMenuItem = (item: MenuItem): void => {
        layoutState.activeMenuItem = item.value || item;
    };

    const toggleDarkMode = (event?: MouseEvent): void => {
        // 检查浏览器是否支持 View Transition API
        if (!document.startViewTransition) {
            executeDarkModeToggle();
            return;
        }

        const x = event?.clientX ?? window.innerWidth / 2;
        const y = event?.clientY ?? window.innerHeight / 2;
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );


        // 设置CSS变量
        document.documentElement.style.setProperty('--x', x + 'px')
        document.documentElement.style.setProperty('--y', y + 'px')
        document.documentElement.style.setProperty('--r', endRadius + 'px')
        document.startViewTransition(() => executeDarkModeToggle());


    };

    const executeDarkModeToggle = (): void => {
        layoutConfig.darkTheme = !layoutConfig.darkTheme;
        document.documentElement.classList.toggle('app-dark');
    };

    const toggleMenu = (): void => {

        if (isMobile.value || isTablet.value) {

            showMobileSidebar.value = !showMobileSidebar.value;
        } else {

            layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive;
        }
    };

    // 关闭移动端侧边栏
    const closeMobileSidebar = (): void => {
        showMobileSidebar.value = false;
    };

    const isSidebarActive = computed(() => {
        if (isMobile.value || isTablet.value) {
            return showMobileSidebar.value;
        }
        return !layoutState.staticMenuDesktopInactive;
    });

    const isCollapsed = computed(() => {
        if (isMobile.value || isTablet.value) {
            return !showMobileSidebar.value;
        }
        return layoutState.staticMenuDesktopInactive;
    });

    const toggleSidebar = (): void => {
        toggleMenu();
    };

    const isDarkTheme = computed(() => layoutConfig.darkTheme);

    const getPrimary = computed(() => layoutConfig.primary);

    const getSurface = computed(() => layoutConfig.surface);

    const isShowTab = ref(layoutConfig.showTab);
    const tabStyle = ref(layoutConfig.tabStyle);
    const isShowIcon = ref(layoutConfig.isShowIcon);

    watch(() => isShowTab.value, (newVal) => {
        layoutConfig.showTab = newVal;
        console.log('isShowTab', newVal);
    })

    watch(() => tabStyle.value, (newVal) => {
        layoutConfig.tabStyle = newVal;
    })

    watch(() => isShowIcon.value, (newVal) => {
        layoutConfig.isShowIcon = newVal;
    })

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
        toggleDarkMode,
        // 新增响应式相关
        isMobile,
        isTablet,
        isDesktop,
        showMobileSidebar,
        closeMobileSidebar,
        windowWidth,
        // 新增标签相关
        isShowTab,
        tabStyle,
        isShowIcon
    };
}
