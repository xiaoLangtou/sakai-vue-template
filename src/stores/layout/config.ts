import { ref } from 'vue';
import type { LayoutConfig, LayoutState } from '@/types/layout.ts';

/**
 * 布局配置状态管理
 */
export function useConfig(layoutConfig:Ref<LayoutConfig>, layoutState: Ref<LayoutState>) {
    // ==================== 标签页和布局配置变量 ====================

    /** 是否显示标签页 */
    const isShowTab = ref<boolean>(layoutConfig.value.showTab);

    /** 标签页样式 */
    const tabStyle = ref<'Fashion' | 'Card' | 'Square'>(layoutConfig.value.tabStyle);

    /** 是否显示图标 */
    const isShowIcon = ref<boolean>(layoutConfig.value.isShowIcon);

    /** 是否显示头部 */
    const isShowHeader = ref<boolean>(layoutConfig.value.isShowHeader);

    /** 是否显示底部 */
    const isShowFooter = ref<boolean>(layoutConfig.value.isShowFooter);

    /** 公司名 */
    const companyName = ref<string>(layoutConfig.value.companyName);

    /** 公司主页 */
    const companyHomepage = ref<string>(layoutConfig.value.companyHomepage);

    /** 日期 */
    const date = ref<string>(layoutConfig.value.date);

    /** ICP备案号 */
    const icp = ref<string>(layoutConfig.value.icp);

    /** ICP网站链接 */
    const icpLink = ref<string>(layoutConfig.value.icpLink);


    /**
     * 打开配置抽屉
     */
    const openConfigDrawer = () => {
        layoutState.value.configSidebarVisible = true;
    };

    /**
     * 关闭配置抽屉
     */
    const closeConfigDrawer = () => {
        layoutState.value.configSidebarVisible = false;
    };

    /**
     * 切换配置抽屉显示状态
     */
    const toggleConfigDrawer = () => {
        layoutState.value.configSidebarVisible = !layoutState.value.configSidebarVisible;
    };

    const generateConfigString = (config: LayoutConfig) => {
        return `const defaultPreferences: LayoutConfig = {
    /** 主题预设 */
    preset: '${ config.preset }',
    /** 主色调 */
    primary: '${ config.primary }',
    /** 表面颜色 */
    surface: ${ config.surface ? `'${ config.surface }'` : 'null' },
    /** 是否为暗色主题 */
    darkTheme: ${ config.darkTheme },
    /** 布局模式 */
    layoutMode: '${ config.layoutMode }',
    /** 是否显示标签页 */
    showTab: ${ isShowTab.value },
    /** 标签页样式 */
    tabStyle: '${ tabStyle.value }',
    /** 标签页是否显示图标 */
    isShowIcon: ${ isShowIcon.value },
    /** 标签页是否持久化*/
    isPersistTab: ${ config.isPersistTab },
    /** 是否显示头部 */
    isShowHeader: ${ isShowHeader.value },
    /** 是否启用全局搜索 */
    isEnableSearch: ${ config.isEnableSearch },
    /** 是否启用主题切换 */
    isEnableTheme: ${ config.isEnableTheme },
    /** 是否启用全屏 */
    isEnableFullScreen: ${ config.isEnableFullScreen },
    /** 是否启用通知 */
    isEnableNotification: ${ config.isEnableNotification },
    /** 是否启用侧边栏切换 */
    isEnableSidebarToggle: ${ config.isEnableSidebarToggle },
    /** 是否显示底部 */
    isShowFooter: ${ isShowFooter.value },
    /** 是否启用版权  */
    isShowCopyright: ${ config.isShowCopyright },
    /** 公司名 */
    companyName: '${ companyName.value }',
    /** 公司主页 */
    companyHomepage: '${ companyHomepage.value }',
    /** 日期 */
    date: '${ date.value }',
    /** ICP 备案号*/
    icp: '${ icp.value }',
    /** ICP 网站链接*/
    icpLink: '${ icpLink.value }',
    /** 是否显示水印 */
    isShowWatermark: ${ config.isShowWatermark },
    /** 水印文字 */
    watermarkText: '${ config.watermarkText }'
};`;
    };

    return {
        // 基础状态
        isShowTab,
        tabStyle,
        isShowIcon,
        isShowHeader,
        isShowFooter,
        companyName,
        companyHomepage,
        date,
        icp,
        icpLink,

        // 方法
        openConfigDrawer,
        closeConfigDrawer,
        toggleConfigDrawer,
        generateConfigString
    };
}
