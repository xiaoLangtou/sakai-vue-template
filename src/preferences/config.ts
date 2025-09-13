import type { LayoutConfig } from '@/types/layout.ts';


const defaultPreferences: LayoutConfig = {
    /** 主题预设 */
    preset: 'Aura',
    /** 主色调 */
    primary: 'indigo',
    /** 表面颜色 */
    surface: 'slate',
    /** 是否为暗色主题 */
    darkTheme: false,
    /** 布局模式 */
    layoutMode: 'sidebar',
    /** 是否显示标签页 */
    showTab: true,
    /** 标签页样式 */
    tabStyle: 'Fashion',
    /** 标签页是否显示图标 */
    isShowIcon: true,
    /** 标签页是否持久化*/
    isPersistTab: true,
    /** 是否显示头部 */
    isShowHeader: true,
    /** 是否启用全局搜索 */
    isEnableSearch: true,
    /** 是否启用主题切换 */
    isEnableTheme: true,
    /** 是否启用全屏 */
    isEnableFullScreen: true,
    /** 是否启用通知 */
    isEnableNotification: true,
    /** 是否启用侧边栏切换 */
    isEnableSidebarToggle: true,
    /** 是否显示底部 */
    isShowFooter: true,
    /** 是否启用版权  */
    isShowCopyright: true,
    /** 公司名 */
    companyName: 'Your Company',
    /** 公司主页 */
    companyHomepage: 'https://example.com',
    /** 日期 */
    date: '2023-09-01',
    /** ICP 备案号*/
    icp: 'ICP 1234567890',
    /** ICP 网站链接*/
    icpLink: 'https://icp.gov.moe',
    /** 是否显示水印 */
    isShowWatermark: false,
    /** 水印文字 */
    watermarkText: '',
    /** 色弱模式 */
    isEnableColorWeak: false,
    /** 灰色模式 */
    isEnableGray: false
};


export { defaultPreferences };
