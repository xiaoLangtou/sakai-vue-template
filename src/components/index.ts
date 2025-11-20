// Search 组件
export { default as ListSearch } from '@/components/search/list-search/index.vue';

// Form 组件
export { default as SmartFormField } from '@/components/custom-form-field/index.vue';

// 通用组件
export { default as CustomTable } from '@/components/custom-table/index.vue';
export { default as CustomTableSettings } from '@/components/custom-table/components/CustomTableSettings.vue';
export { default as CustomDrawer } from '@/components/custom-drawer/index';
export { default as GlobalSearch } from '@/components/global-search/index.vue';

export { default as FloatingConfigurator } from '@/components/floating-configurator/index.vue';
export { default as IconSelector } from '@/components/icon-selector/index.vue';
export { default as PageContainer } from '@/components/page-container/index.vue';
export { default as PageHeader } from '@/components/page-header/index.vue';
export { default as UserProfile } from '@/components/user-profile/index.vue';
export { default as LoginDialog } from '@/components/login-dialog/index.vue';
export { default as NotificationDrawer } from '@/components/notification-drawer/index.vue';
export { default as CustomFormField } from '@/components/custom-form-field/index.vue';

// 表格类型导出
export type {
    CustomTableColumn,
    CustomTableProps,
    CustomTableEmits,
    CustomTableSettingsProps,
    CustomTableSettingsEmits,
    ActionColumnConfig,
    TableStyleConfig,
    TableSize,
    PageEvent,
    SortEvent,
    RowClickEvent
} from '@/components/custom-table/types/types.ts';

export { default as SplitPane } from '@/components/split-pane/index.vue';
