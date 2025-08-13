<script setup lang="ts">
import { useLucideIcon } from '@/composables';
import type { TabItem } from '@/stores/tabs';
import { useTabsStore } from '@/stores/tabs';
import { SlidersVertical, X } from "lucide-vue-next";
import ContextMenu from 'primevue/contextmenu';
import Menu from 'primevue/menu';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';


//标签页样式
export type TabStyle = 'Card' | 'Fashion' | 'Square'

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
    style: 'Square',
    enableContextMenu: true,
    class: '',
});

const router = useRouter();
const route = useRoute();
const tabsStore = useTabsStore();
const confirm = useConfirm();
const toast = useToast();

// 响应式数据
const contextMenuRef = ref<InstanceType<typeof ContextMenu>>();
const contextMenuTab = ref<TabItem | null>(null);
const tabsWrapper = ref<HTMLElement | null>(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);
const styleMenuRef = ref<InstanceType<typeof Menu>>();

// 计算属性
const tabs = computed(() => tabsStore.activeTabs);
const activeTabKey = computed(() => String(tabsStore.activeTabKey));
const { isLucideIcon, lucideIconName } = useLucideIcon();

// 右键菜单项配置
const contextMenuItems = computed(() => {
    if (!contextMenuTab.value) return [];
    const tab = contextMenuTab.value;
    const currentTabIndex = tabs.value.findIndex(t => t.key === tab.key);
    const isFirstTab = currentTabIndex === 0;
    const isLastTab = currentTabIndex === tabs.value.length - 1;

    const menuItems = [
        {
            label: '刷新',
            icon: 'pi pi-refresh',
            command: () => handleContextMenuAction('refresh')
        },
        {
            label: '关闭当前标签页',
            icon: 'pi pi-times',
            command: () => handleContextMenuAction('close'),
            disabled: !tab.closable
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
    const tab = tabs.value.find(t => t.key === value);
    if (tab) {
        router.push({
            path: tab.path,
            ...(tab.params && Object.keys(tab.params).length > 0 && { params: tab.params }),
            ...(tab.query && Object.keys(tab.query).length > 0 && { query: tab.query })
        });
    }
};

/**
 * 处理标签页关闭
 * @param tab - 标签页对象
 * @param event - 事件对象
 */
const handleTabClose = (tab: TabItem, event: Event): void => {
    event.stopPropagation();

    if (!tab.closable) {
        toast.add({
            severity: 'warn',
            summary: '提示',
            detail: '首页标签不可关闭',
            life: 3000
        });
        return;
    }

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
            confirm.require({
                message: '确定要关闭其他标签页吗？',
                header: '确认操作',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    tabsStore.closeOtherTabs(tab.key);
                    router.push({
                        path: tab.path,
                        ...(tab.params && Object.keys(tab.params).length > 0 && { params: tab.params }),
                        ...(tab.query && Object.keys(tab.query).length > 0 && { query: tab.query })
                    });
                }
            });
            break;
        case 'closeAll':
            confirm.require({
                message: '确定要关闭所有标签页吗？（首页除外）',
                header: '确认操作',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    tabsStore.closeAllTabs();
                    if (tabsStore.activeTab) {
                        const activeTab = tabsStore.activeTab;
                        router.push({
                            path: activeTab.path,
                            ...(activeTab.params && Object.keys(activeTab.params).length > 0 && { params: activeTab.params }),
                            ...(activeTab.query && Object.keys(activeTab.query).length > 0 && { query: activeTab.query })
                        });
                    }
                }
            });
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
    }

    closeContextMenu();
};

/**
 * 检查滚动状态
 */
const checkScrollStatus = (): void => {
    if (!tabsWrapper.value) return;

    const { scrollLeft, scrollWidth, clientWidth } = tabsWrapper.value;
    canScrollLeft.value = scrollLeft > 0;
    canScrollRight.value = scrollLeft < scrollWidth - clientWidth;
};

/**
 * 显示样式选择菜单
 * @param event - 鼠标事件
 */
const showStyleMenu = (event: Event): void => {
    styleMenuRef.value?.toggle(event);
};



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
});


const setTabStyle = (name: string, key: string) => {
    return {
        "Card": `app-tab-item overflow-hidden ${key !== activeTabKey.value ? 'hvr-bounce-to-top' : ''}`,
        "Square": `app-tab-item overflow-hidden ${key !== activeTabKey.value ? 'hvr-bounce-to-top' : ''}`,
        "Fashion": `tab-frame`

    }[name]
}


/**
 * 监听标签页变化，更新滚动状态
 */
watch(
    () => tabs.value.length,
    () => {
        setTimeout(() => {
            checkScrollStatus();
        }, 100);
    }
);
</script>

<template>
    <div :class="['app-tabs', props.class, 'app-tabs__' + tabStyle]">
        <div class="flex items-center justify-between pr-4 gap-4">
            <div class="flex-[calc(100%_-_46px)] w-[calc(100%_-_46px)]">
                <Tabs :value="activeTabKey" :scrollable="true" :show-navigators="true" class="custom-tabs"
                    @update:value="handleTabChange">
                    <TabList class="custom-tab-list">
                        <Tab v-for="tab in tabs" :key="tab.key" :value="tab.key" as="div"
                            :class="setTabStyle(tabStyle, tab.key)"
                            @contextmenu.prevent="handleContextMenu(tab, $event)">
                            <template v-if="tabStyle == 'Fashion'">
                                <div :class="['tab-container', { 'active': tab.key === activeTabKey }]"
                                    :title="tab.title" tab-id="0">
                                    <div class="tab">
                                        <div class="title flex items-center gap-1">
                                            <div v-if="props.showIcon && tab.icon" class="app-tab__icon">
                                                <component :is="lucideIconName(tab.icon)" v-if="isLucideIcon(tab.icon)"
                                                    :size="16" />
                                                <i v-else-if="tab.icon" :class="tab.icon" />
                                            </div>

                                            {{ tab.title }}
                                        </div>
                                        <button v-if="props.showClose && tab.closable && tabs.length > 1"
                                            :aria-label="`关闭 ${tab.title}`" @click.stop="handleTabClose(tab, $event)">
                                            <X :size="12" />
                                        </button>
                                    </div>
                                    <div class="round round-left"></div>
                                    <div class="round round-right"></div>
                                </div>
                            </template>

                            <div v-else class="flex justify-between items-center w-[100px] app-tab-content">
                                <div class="flex items-center gap-1">
                                    <div v-if="props.showIcon && tab.icon" class="app-tab__icon">
                                        <component :is="lucideIconName(tab.icon)" v-if="isLucideIcon(tab.icon)"
                                            :size="16" />
                                        <i v-else-if="tab.icon" :class="tab.icon" />
                                    </div>
                                    <span
                                        class="app-tab__title text-ellipsis overflow-hidden whitespace-nowrap inline-block w-20 text-left">{{
                                            tab.title }}</span>
                                </div>
                                <button v-if="props.showClose && tab.closable && tabs.length > 1"
                                    :aria-label="`关闭 ${tab.title}`" @click.stop="handleTabClose(tab, $event)">
                                    <X :size="12" />
                                </button>
                            </div>
                        </Tab>
                    </TabList>
                </Tabs>
            </div>
            <div class="w-[30px] h-[30px] flex items-center justify-center  bg-white dark:bg-transparent cursor-pointer rounded-[8px]"
                @click="showStyleMenu">
                <SlidersVertical :size="16" />
            </div>
        </div>

        <!-- 右键菜单 -->
        <ContextMenu v-if="props.enableContextMenu" ref="contextMenuRef" :model="contextMenuItems" />

        <!-- 样式选择菜单 -->
        <!-- <Menu ref="styleMenuRef" :model="styleMenuItems" :popup="true" /> -->
    </div>
</template>
