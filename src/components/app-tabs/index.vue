<script lang="ts" setup>
import { useLucideIcon } from '@/composables';
import type { TabItem } from '@/stores/tabs.ts';
import { useTabsStore } from '@/stores/tabs.ts';
import { ChevronDown, Pin, X } from 'lucide-vue-next';
import ContextMenu from 'primevue/contextmenu';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

//标签页样式
export type TabStyle = 'Card' | 'Square';

/**
 * 标签页组件属性
 */
interface Props {
    /** 是否显示图标 */
    showIcon?: boolean;
    /** 是否显示关闭按钮 */
    showClose?: boolean;
    /** 标签页样式 */
    tabStyle?: TabStyle;
    /** 是否启用右键菜单 */
    enableContextMenu?: boolean;
    /** 自定义样式类名 */
    class?: string;
}

const props = withDefaults(defineProps<Props>(), {
    showIcon: true,
    showClose: true,
    tabStyle: 'Square',
    enableContextMenu: true,
    class: ''
});

const router = useRouter();
const route = useRoute();
const tabsStore = useTabsStore();

// 响应式数据
const contextMenuRef = ref<InstanceType<typeof ContextMenu>>();
const contextMenuTab = ref<TabItem | null>(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);
const isPopoverVisible = ref(false);

// 计算属性
const tabs = computed(() => tabsStore.activeTabs);
const activeTabKey = computed(() => String(tabsStore.activeTabKey));
const { isLucideIcon, lucideIconName } = useLucideIcon();

// 右键菜单项配置
const contextMenuItems = computed(() => {
    if (!contextMenuTab.value) return [];
    const tab = contextMenuTab.value;
    const currentTabIndex = tabs.value.findIndex((t) => t.key === tab.key);
    const isFirstTab = currentTabIndex === 0;
    const isLastTab = currentTabIndex === tabs.value.length - 1;

    const menuItems = [
        {
            label: tab.pinned ? '取消固定' : '固定标签页',
            icon: tab.pinned ? 'pi pi-bookmark-fill' : 'pi pi-bookmark',
            command: () => handleContextMenuAction('togglePin')
        },
        {
            separator: true
        },
        {
            label: '重新加载',
            icon: 'pi pi-refresh',
            command: () => handleContextMenuAction('refresh')
        },
        {
            label: '新窗口打开',
            icon: 'pi pi-external-link',
            command: () => handleContextMenuAction('refresh')
        },

        {
            separator: true
        },
        {
            label: '关闭当前标签页',
            icon: 'pi pi-times',
            command: () => handleContextMenuAction('close'),
            disabled: !tab.closable || tab.pinned
        },
        {
            label: '关闭其他标签页',
            icon: 'pi pi-times-circle',
            command: () => handleContextMenuAction('closeOthers')
        }
    ];

    // 如果不是最左侧标签页，显示"关闭左侧标签页"
    if (!isFirstTab) {
        menuItems.push({
            label: '关闭左侧标签页',
            icon: 'pi pi-angle-double-left',
            command: () => handleContextMenuAction('closeLeft')
        });
    }

    // 如果不是最右侧标签页，显示"关闭右侧标签页"
    if (!isLastTab) {
        menuItems.push({
            label: '关闭右侧标签页',
            icon: 'pi pi-angle-double-right',
            command: () => handleContextMenuAction('closeRight')
        });
    }

    menuItems.push({
        label: '关闭所有标签页',
        icon: 'pi pi-times',
        command: () => handleContextMenuAction('closeAll')
    });

    return menuItems;
});

/**
 * 处理标签页切换
 * @param value - 标签页key
 */
const handleTabChange = (value: string | number): void => {
    if (value === activeTabKey.value) return;

    tabsStore.setActiveTab(String(value));
    const tab = tabs.value.find((t) => t.key === value);
    if (tab) {
        router.push({
            path: tab.path,
            ...(tab.params && Object.keys(tab.params).length > 0 && { params: tab.params }),
            ...(tab.query && Object.keys(tab.query).length > 0 && { query: tab.query })
        });
        // 滚动到激活标签
        scrollToActiveTab();
        // 更新是否为最后一个标签页的状态
        hideScrollLastButton();
    }
};

/**
 * 处理标签页关闭
 * @param tab - 标签页对象
 * @param event - 事件对象
 */
const handleTabClose = (tab: TabItem, event: Event): void => {
    event.stopPropagation();
    const success = tabsStore.removeTab(tab.key);
    if (success && tabsStore.activeTab) {
        const activeTab = tabsStore.activeTab;
        router.push({
            path: activeTab.path,
            ...(activeTab.params && Object.keys(activeTab.params).length > 0 && { params: activeTab.params }),
            ...(activeTab.query && Object.keys(activeTab.query).length > 0 && { query: activeTab.query })
        });
    }
};

/**
 * 处理右键菜单
 * @param tab - 标签页对象
 * @param event - 鼠标事件
 */
const handleContextMenu = (tab: TabItem, event: MouseEvent): void => {
    if (!props.enableContextMenu) return;

    // 如果只有一个标签页，不显示右键菜单
    if (tabs.value.length <= 1) return;

    contextMenuTab.value = tab;
    contextMenuRef.value?.show(event);
};

/**
 * 关闭右键菜单
 */
const closeContextMenu = (): void => {
    contextMenuRef.value?.hide();
    contextMenuTab.value = null;
};

/**
 * 处理右键菜单操作
 * @param action - 操作类型
 */
const handleContextMenuAction = (action: string): void => {
    if (!contextMenuTab.value) return;

    const tab = contextMenuTab.value;

    switch (action) {
        case 'close':
            handleTabClose(tab, new Event('click'));
            break;
        case 'closeOthers':
            tabsStore.closeOtherTabs(tab.key);
            router.push({
                path: tab.path,
                ...(tab.params && Object.keys(tab.params).length > 0 && { params: tab.params }),
                ...(tab.query && Object.keys(tab.query).length > 0 && { query: tab.query })
            });
            break;
        case 'closeAll':
            tabsStore.closeAllTabs();
            if (tabsStore.activeTab) {
                const activeTab = tabsStore.activeTab;
                router.push({
                    path: activeTab.path,
                    ...(activeTab.params && Object.keys(activeTab.params).length > 0 && { params: activeTab.params }),
                    ...(activeTab.query && Object.keys(activeTab.query).length > 0 && { query: activeTab.query })
                });
            }
            break;
        case 'closeLeft':
            tabsStore.closeLeftTabs(tab.key);
            break;
        case 'closeRight':
            tabsStore.closeRightTabs(tab.key);
            break;
        case 'refresh':
            tabsStore.setTabLoading(tab.key, true);
            router.go(0); // 刷新当前页面
            break;
        case 'togglePin':
            tabsStore.togglePinTab(tab.key);
            break;
    }

    closeContextMenu();
};

/**
 * 检查滚动状态
 */
const checkScrollStatus = (): void => {
    const tabList = document.querySelector('.p-tablist-tab-list') as HTMLElement;
    if (!tabList) return;

    const { scrollLeft, scrollWidth, clientWidth } = tabList;
    canScrollLeft.value = scrollLeft > 5; // 留一点容差
    canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 5;
};

/**
 * 滚动到激活的标签页
 */
const scrollToActiveTab = (): void => {
    setTimeout(() => {
        const activeTab = document.querySelector('.p-tab-active') as HTMLElement;
        if (!activeTab) return;
        // 使用 scrollIntoView 实现平滑滚动
        activeTab.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
        // 更新滚动状态
        setTimeout(() => checkScrollStatus(), 400);
    }, 150);
};

/**
 * 判断是不是选中的为最后一个标签页，如果是，则隐藏右侧的按钮
 */
const hideScrollLastButton = () => {
    const activeTabKey = tabsStore.activeTabKey;
    const tabKeys = tabsStore.tabs.map(tab => tab.key);
    const nextButton = document.querySelector('.p-tablist-next-button') as HTMLElement;
    if (nextButton) {
        if (activeTabKey === tabKeys[tabKeys.length - 1]) {
            nextButton.classList.add('next-hidden');
        } else {
            nextButton.classList.remove('next-hidden');
        }
    }

    return false;
}



/**
 * 监听路由变化，自动添加标签页
 */
watch(
    () => route,
    (newRoute) => {
        if (newRoute.meta?.hideInTabs) return;
        tabsStore.addTab(newRoute);
    },
    { immediate: true, deep: true }
);

/**
 * 组件挂载时初始化
 */
onMounted(() => {
    // 添加当前路由标签
    if (!route.meta?.hideInTabs) {
        tabsStore.addTab(route);
    }

    // 监听点击事件，关闭右键菜单
    document.addEventListener('click', closeContextMenu);

    // 初始化滚动状态
    setTimeout(() => {
        checkScrollStatus();
        scrollToActiveTab(); // 初始化时滚动到激活标签
        // 监听标签列表滚动
        const tabList = document.querySelector('.p-tablist-tab-list');
        if (tabList) {
            tabList.addEventListener('scroll', checkScrollStatus);
        }
    }, 100);

    // 监听窗口大小变化
    window.addEventListener('resize', checkScrollStatus);
});

/**
 * 组件卸载时清理
 */
onUnmounted(() => {
    document.removeEventListener('click', closeContextMenu);
    window.removeEventListener('resize', checkScrollStatus);

    // 移除滚动监听
    const tabList = document.querySelector('.p-tablist-tab-list');
    if (tabList) {
        tabList.removeEventListener('scroll', checkScrollStatus);
    }
});

const setTabStyle = (name: string | undefined, key: string) => {
    if (!name) return '';
    const tab = tabs.value.find(t => t.key === key);
    const pinnedClass = tab?.pinned ? 'app-tab-item--pinned' : '';
    return {
        Card: `app-tab-item overflow-hidden ${pinnedClass} ${key !== activeTabKey.value ? 'hvr-bounce-to-top' : ''}`,
        Square: `app-tab-item overflow-hidden ${pinnedClass} ${key !== activeTabKey.value ? 'hvr-bounce-to-top' : ''}`
    }[name];
};

/**
 * 监听标签页变化，更新滚动状态
 */
watch(
    () => tabs.value.length,
    () => {
        setTimeout(() => {
            checkScrollStatus();
            scrollToActiveTab();
        }, 100);
    }
);

/**
 * 监听激活标签变化，自动滚动
 */
watch(
    () => activeTabKey.value,
    () => {
        scrollToActiveTab();
    }
);

const op = useTemplateRef('op');

// 搜索功能
const searchKeyword = ref('');

/**
 * 过滤后的标签页列表
 */
const filteredTabs = computed(() => {
    if (!searchKeyword.value.trim()) {
        return tabs.value;
    }

    const keyword = searchKeyword.value.toLowerCase().trim();
    return tabs.value.filter((tab) => tab.title.toLowerCase().includes(keyword) || (tab.path && tab.path.toLowerCase().includes(keyword)));
});

/**
 * 切换Popover显示状态
 * @param event - 事件对象
 */
const toggle = (event: Event) => {
    // 每次切换时清空搜索关键词
    clearSearch();
    isPopoverVisible.value = !isPopoverVisible.value;
    op.value?.toggle(event);
};

/**
 * 清空搜索关键词
 */
const clearSearch = () => {
    searchKeyword.value = '';
};

/**
 * 处理搜索输入
 * @param event - 输入事件
 */
const handleSearchInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    searchKeyword.value = target.value;
};
</script>

<template>
    <div :class="[
        'app-tabs',
        props.class,
        'app-tabs__' + tabStyle,
        { 'has-scroll-left': canScrollLeft },
        { 'has-scroll-right': canScrollRight }
    ]">
        <div class="flex items-center justify-between pr-4 gap-4">
            <div class="flex-[calc(100%_-_46px)] w-[calc(100%_-_46px)]">
                <Tabs :scrollable="true" :show-navigators="true" :value="activeTabKey" class="custom-tabs"
                    @update:value="handleTabChange">
                    <TabList class="custom-tab-list">
                        <Tab v-for="tab in tabs" :key="tab.key" :class="setTabStyle(tabStyle, tab.key)" :value="tab.key"
                            as="div" @contextmenu.prevent="handleContextMenu(tab, $event)">
                            <div
                                class="flex justify-between items-center min-w-[80px] max-w-[180px] gap-2 app-tab-content">
                                <div class="flex items-center gap-1.5 flex-1 min-w-0">
                                    <!-- 标签图标 -->
                                    <div v-if="props.showIcon && tab.icon" class="app-tab__icon">
                                        <component :is="lucideIconName(tab.icon)" v-if="isLucideIcon(tab.icon)"
                                            :size="16" />
                                        <i v-else-if="tab.icon" :class="tab.icon" />
                                    </div>
                                    <!-- 标签标题 -->
                                    <span
                                        class="app-tab__title text-ellipsis overflow-hidden whitespace-nowrap inline-block flex-1 text-left">{{
                                            tab.title }}</span>
                                </div>
                                <!-- 固定图标 - 替换关闭按钮位置 -->
                                <div v-if="tab.pinned">
                                    <Pin :size="16" :class="tab.key == activeTabKey ? 'text-white' : 'text-secondary'"
                                        :stroke-width="2.5" />
                                </div>
                                <!-- 关闭按钮 - 非固定标签显示 -->
                                <button v-else-if="tabs.length > 1 && tab.closable"
                                    :class="tab.key == activeTabKey ? 'app-tab__close-button--active' : ''"
                                    :aria-label="`关闭 ${tab.title}`" @click.stop="handleTabClose(tab, $event)">
                                    <X :size="12" />
                                </button>
                            </div>
                        </Tab>
                    </TabList>
                </Tabs>
            </div>
            <div v-if="tabs.length > 1"
                class="relative w-[36px] h-[36px] flex items-center justify-center bg-white dark:bg-gray-800 cursor-pointer rounded-[8px] transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-110 border border-gray-200 dark:border-gray-700"
                @click="toggle">
                <chevron-down :size="16" class="transition-transform duration-200"
                    :class="{ 'rotate-180': isPopoverVisible }" />
                <span
                    class="absolute -top-1 -right-1 bg-primary-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {{ tabs.length }}
                </span>
            </div>
        </div>

        <!-- 右键菜单 -->
        <ContextMenu v-if="props.enableContextMenu" ref="contextMenuRef" :model="contextMenuItems" />

        <Popover ref="op">
            <div class="flex flex-col w-[280px] p-2">
                <!-- 搜索框 -->
                <div class="relative">
                    <IconField>
                        <InputIcon class="pi pi-search" />
                        <InputText v-model="searchKeyword" class="w-full text-sm pr-8" placeholder="搜索标签页"
                            @input="handleSearchInput" />
                        <InputIcon v-if="searchKeyword" class="pi pi-times cursor-pointer" @click="clearSearch" />
                    </IconField>
                    <!-- 清空搜索按钮 -->
                </div>

                <Divider />

                <!-- 标签页列表 -->
                <div class="flex flex-col gap-1">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400"> 打开的标签页 </span>
                        <span class="text-xs text-gray-500 dark:text-gray-500"> {{ filteredTabs.length }}/{{ tabs.length
                        }} </span>
                    </div>

                    <!-- 搜索结果为空时的提示 -->
                    <div v-if="searchKeyword && filteredTabs.length === 0"
                        class="text-center py-4 text-gray-500 dark:text-gray-400">
                        <i class="pi pi-search text-2xl mb-2 block"></i>
                        <p class="text-sm">未找到匹配的标签页</p>
                    </div>

                    <!-- 标签页列表容器 -->
                    <div class="max-h-[240px] overflow-y-auto">
                        <div v-for="(tab, index) in filteredTabs" :key="`${tab.title}-${index}`" :class="{
                            'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700': tab.key === activeTabKey
                        }" class="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            @click="handleTabChange(tab.key)">
                            <!-- 图标 -->
                            <component :is="lucideIconName(tab.icon)" v-if="isLucideIcon(tab.icon)" :size="16"
                                class="text-gray-600 dark:text-gray-400 flex-shrink-0" />
                            <i v-else-if="tab.icon"
                                :class="[tab.icon, 'text-sm text-gray-600 dark:text-gray-400 flex-shrink-0']" />

                            <!-- 标题和路径 -->
                            <div class="flex-1 min-w-0">
                                <div :class="{
                                    'font-medium text-blue-600 dark:text-blue-400': tab.key === activeTabKey
                                }" class="text-sm text-gray-700 dark:text-gray-300 truncate">
                                    {{ tab.title }}
                                </div>
                                <div v-if="tab.path" class="text-xs text-gray-500 dark:text-gray-500 truncate">
                                    {{ tab.path }}
                                </div>
                            </div>

                            <!-- 关闭按钮 -->
                            <X v-if="tab.closable && tabs.length > 1"
                                :class="{ 'opacity-100': tab.key === activeTabKey }" :size="14"
                                class="text-gray-400 hover:text-red-500 transition-colors duration-200 flex-shrink-0 opacity-0 group-hover:opacity-100"
                                @click.stop="handleTabClose(tab, $event)" />
                        </div>
                    </div>
                </div>
            </div>
        </Popover>
    </div>
</template>
