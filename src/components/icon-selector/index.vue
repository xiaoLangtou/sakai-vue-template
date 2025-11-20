<!--
 * @Author: weipc 755197142@qq.com
 * @Date: 2025-01-09 16:30:00
 * @LastEditors: weipc 755197142@qq.com
 * @LastEditTime: 2025-01-09 16:30:00
 * @Description: 图标选择器组件
-->
<script setup lang="ts">
import { computed, ref, watch } from 'vue';

// Lucide 图标导入
import {
    Home, User, Users, Settings, List, Table, BarChart, LineChart, PieChart,
    Calendar, Clock, Mail, Phone, Map, MapPin, Camera, Image, File, Folder,
    Download, Upload, Search, Filter, ArrowUpDown, RefreshCw, RotateCcw, Power,
    Lock, Unlock, Key, Shield, Star, Heart, Bookmark, Tag, Tags, Plus, Minus,
    X, Check, Eye, EyeOff, Edit, Trash2, Copy, Save, Printer, Share,
    ExternalLink, Link, Bell, Volume2, VolumeX, Play, Pause, Square,
    ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ChevronUp, ChevronDown,
    ChevronLeft, ChevronRight
} from 'lucide-vue-next';

/**
 * 图标库类型
 */
type IconLibrary = 'primevue' | 'lucide';

/**
 * 图标项接口
 */
interface IconItem {
    /** 图标类名或名称 */
    name: string;
    /** 图标标签 */
    label: string;
    /** 图标库类型 */
    library: IconLibrary;
    /** 图标分类 */
    category?: string;
}

/**
 * 图标选择器组件属性接口
 */
interface Props {
    /** 当前选中的图标 */
    modelValue?: string;
    /** 显示模式：dropdown-下拉选择框，input-输入框+按钮 */
    mode?: 'dropdown' | 'input';
    /** 占位符文本 */
    placeholder?: string;
    /** 是否启用过滤 */
    filter?: boolean;
    /** 过滤占位符 */
    filterPlaceholder?: string;
    /** 是否显示清除按钮 */
    showClear?: boolean;
    /** 是否显示图标预览 */
    showPreview?: boolean;
    /** 预览文本 */
    previewText?: string;
    /** 是否无效状态 */
    invalid?: boolean;
    /** 是否禁用 */
    disabled?: boolean;
    /** 抽屉标题 */
    drawerTitle?: string;
    /** 抽屉描述 */
    drawerDescription?: string;
    /** 是否启用搜索 */
    enableSearch?: boolean;
    /** 自定义图标列表 */
    customIcons?: IconItem[];
    /** 默认图标库 */
    defaultLibrary?: IconLibrary;
    /** 启用的图标库 */
    enabledLibraries?: IconLibrary[];
    /** 是否显示图标库切换 */
    showLibraryTabs?: boolean;
}

/**
 * 组件名称定义
 */
defineOptions({
    name: 'IconSelector',
    components: {
        // Lucide 图标组件注册
        Home, User, Users, Settings, List, Table, BarChart, LineChart, PieChart,
        Calendar, Clock, Mail, Phone, Map, MapPin, Camera, Image, File, Folder,
        Download, Upload, Search, Filter, ArrowUpDown, RefreshCw, RotateCcw, Power,
        Lock, Unlock, Key, Shield, Star, Heart, Bookmark, Tag, Tags, Plus, Minus,
        X, Check, Eye, EyeOff, Edit, Trash2, Copy, Save, Printer, Share,
        ExternalLink, Link, Bell, Volume2, VolumeX, Play, Pause, Square,
        ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ChevronUp, ChevronDown,
        ChevronLeft, ChevronRight
    }
});

/**
 * 组件属性定义
 */
const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    mode: 'dropdown',
    placeholder: '请选择图标',
    filter: true,
    filterPlaceholder: '搜索图标',
    showClear: true,
    showPreview: true,
    previewText: '图标预览',
    invalid: false,
    disabled: false,
    drawerTitle: '选择图标',
    drawerDescription: '选择一个图标作为菜单图标',
    enableSearch: true,
    customIcons: () => [],
    defaultLibrary: 'primevue',
    enabledLibraries: () => ['primevue', 'lucide'],
    showLibraryTabs: true
});

/**
 * 组件事件定义
 */
const emit = defineEmits<{
    /** 值更新事件 */
    (e: 'update:modelValue', value: string): void;
    /** 图标改变事件 */
    (e: 'change', value: string): void;
}>();

// PrimeVue 图标列表
const primeVueIcons: IconItem[] = [
    { name: 'pi pi-home', label: 'home', library: 'primevue', category: 'general' },
    { name: 'pi pi-user', label: 'user', library: 'primevue', category: 'general' },
    { name: 'pi pi-users', label: 'users', library: 'primevue', category: 'general' },
    { name: 'pi pi-cog', label: 'cog', library: 'primevue', category: 'general' },
    { name: 'pi pi-list', label: 'list', library: 'primevue', category: 'general' },
    { name: 'pi pi-custom-table', label: 'table', library: 'primevue', category: 'general' },
    { name: 'pi pi-chart-bar', label: 'chart-bar', library: 'primevue', category: 'charts' },
    { name: 'pi pi-chart-line', label: 'chart-line', library: 'primevue', category: 'charts' },
    { name: 'pi pi-chart-pie', label: 'chart-pie', library: 'primevue', category: 'charts' },
    { name: 'pi pi-calendar', label: 'calendar', library: 'primevue', category: 'time' },
    { name: 'pi pi-clock', label: 'clock', library: 'primevue', category: 'time' },
    { name: 'pi pi-envelope', label: 'envelope', library: 'primevue', category: 'communication' },
    { name: 'pi pi-phone', label: 'phone', library: 'primevue', category: 'communication' },
    { name: 'pi pi-map', label: 'map', library: 'primevue', category: 'location' },
    { name: 'pi pi-map-marker', label: 'map-marker', library: 'primevue', category: 'location' },
    { name: 'pi pi-camera', label: 'camera', library: 'primevue', category: 'media' },
    { name: 'pi pi-image', label: 'image', library: 'primevue', category: 'media' },
    { name: 'pi pi-file', label: 'file', library: 'primevue', category: 'files' },
    { name: 'pi pi-folder', label: 'folder', library: 'primevue', category: 'files' },
    { name: 'pi pi-download', label: 'download', library: 'primevue', category: 'actions' },
    { name: 'pi pi-upload', label: 'upload', library: 'primevue', category: 'actions' },
    { name: 'pi pi-search', label: 'search', library: 'primevue', category: 'actions' },
    { name: 'pi pi-filter', label: 'filter', library: 'primevue', category: 'actions' },
    { name: 'pi pi-sort', label: 'sort', library: 'primevue', category: 'actions' },
    { name: 'pi pi-refresh', label: 'refresh', library: 'primevue', category: 'actions' },
    { name: 'pi pi-sync', label: 'sync', library: 'primevue', category: 'actions' },
    { name: 'pi pi-power-off', label: 'power-off', library: 'primevue', category: 'actions' },
    { name: 'pi pi-lock', label: 'lock', library: 'primevue', category: 'security' },
    { name: 'pi pi-unlock', label: 'unlock', library: 'primevue', category: 'security' },
    { name: 'pi pi-key', label: 'key', library: 'primevue', category: 'security' },
    { name: 'pi pi-shield', label: 'shield', library: 'primevue', category: 'security' },
    { name: 'pi pi-star', label: 'star', library: 'primevue', category: 'general' },
    { name: 'pi pi-heart', label: 'heart', library: 'primevue', category: 'general' },
    { name: 'pi pi-bookmark', label: 'bookmark', library: 'primevue', category: 'general' },
    { name: 'pi pi-tag', label: 'tag', library: 'primevue', category: 'general' },
    { name: 'pi pi-tags', label: 'tags', library: 'primevue', category: 'general' },
    { name: 'pi pi-plus', label: 'plus', library: 'primevue', category: 'actions' },
    { name: 'pi pi-minus', label: 'minus', library: 'primevue', category: 'actions' },
    { name: 'pi pi-times', label: 'times', library: 'primevue', category: 'actions' },
    { name: 'pi pi-check', label: 'check', library: 'primevue', category: 'actions' },
    { name: 'pi pi-eye', label: 'eye', library: 'primevue', category: 'actions' },
    { name: 'pi pi-eye-slash', label: 'eye-slash', library: 'primevue', category: 'actions' },
    { name: 'pi pi-pencil', label: 'pencil', library: 'primevue', category: 'actions' },
    { name: 'pi pi-trash', label: 'trash', library: 'primevue', category: 'actions' },
    { name: 'pi pi-copy', label: 'copy', library: 'primevue', category: 'actions' },
    { name: 'pi pi-save', label: 'save', library: 'primevue', category: 'actions' },
    { name: 'pi pi-print', label: 'print', library: 'primevue', category: 'actions' },
    { name: 'pi pi-share-alt', label: 'share-alt', library: 'primevue', category: 'actions' },
    { name: 'pi pi-external-link', label: 'external-link', library: 'primevue', category: 'actions' },
    { name: 'pi pi-link', label: 'link', library: 'primevue', category: 'actions' },
    { name: 'pi pi-bell', label: 'bell', library: 'primevue', category: 'communication' },
    { name: 'pi pi-volume-up', label: 'volume-up', library: 'primevue', category: 'media' },
    { name: 'pi pi-volume-down', label: 'volume-down', library: 'primevue', category: 'media' },
    { name: 'pi pi-volume-off', label: 'volume-off', library: 'primevue', category: 'media' },
    { name: 'pi pi-play', label: 'play', library: 'primevue', category: 'media' },
    { name: 'pi pi-pause', label: 'pause', library: 'primevue', category: 'media' },
    { name: 'pi pi-stop', label: 'stop', library: 'primevue', category: 'media' },
    { name: 'pi pi-arrow-up', label: 'arrow-up', library: 'primevue', category: 'arrows' },
    { name: 'pi pi-arrow-down', label: 'arrow-down', library: 'primevue', category: 'arrows' },
    { name: 'pi pi-arrow-left', label: 'arrow-left', library: 'primevue', category: 'arrows' },
    { name: 'pi pi-arrow-right', label: 'arrow-right', library: 'primevue', category: 'arrows' },
    { name: 'pi pi-chevron-up', label: 'chevron-up', library: 'primevue', category: 'arrows' },
    { name: 'pi pi-chevron-down', label: 'chevron-down', library: 'primevue', category: 'arrows' },
    { name: 'pi pi-chevron-left', label: 'chevron-left', library: 'primevue', category: 'arrows' },
    { name: 'pi pi-chevron-right', label: 'chevron-right', library: 'primevue', category: 'arrows' }
];

// Lucide 图标列表
const lucideIcons: IconItem[] = [
    { name: 'Home', label: 'home', library: 'lucide', category: 'general' },
    { name: 'User', label: 'user', library: 'lucide', category: 'general' },
    { name: 'Users', label: 'users', library: 'lucide', category: 'general' },
    { name: 'Settings', label: 'settings', library: 'lucide', category: 'general' },
    { name: 'List', label: 'list', library: 'lucide', category: 'general' },
    { name: 'Table', label: 'table', library: 'lucide', category: 'general' },
    { name: 'BarChart', label: 'bar-chart', library: 'lucide', category: 'charts' },
    { name: 'LineChart', label: 'line-chart', library: 'lucide', category: 'charts' },
    { name: 'PieChart', label: 'pie-chart', library: 'lucide', category: 'charts' },
    { name: 'Calendar', label: 'calendar', library: 'lucide', category: 'time' },
    { name: 'Clock', label: 'clock', library: 'lucide', category: 'time' },
    { name: 'Mail', label: 'mail', library: 'lucide', category: 'communication' },
    { name: 'Phone', label: 'phone', library: 'lucide', category: 'communication' },
    { name: 'Map', label: 'map', library: 'lucide', category: 'location' },
    { name: 'MapPin', label: 'map-pin', library: 'lucide', category: 'location' },
    { name: 'Camera', label: 'camera', library: 'lucide', category: 'media' },
    { name: 'Image', label: 'image', library: 'lucide', category: 'media' },
    { name: 'File', label: 'file', library: 'lucide', category: 'files' },
    { name: 'Folder', label: 'folder', library: 'lucide', category: 'files' },
    { name: 'Download', label: 'download', library: 'lucide', category: 'actions' },
    { name: 'Upload', label: 'upload', library: 'lucide', category: 'actions' },
    { name: 'Search', label: 'search', library: 'lucide', category: 'actions' },
    { name: 'Filter', label: 'filter', library: 'lucide', category: 'actions' },
    { name: 'ArrowUpDown', label: 'sort', library: 'lucide', category: 'actions' },
    { name: 'RefreshCw', label: 'refresh', library: 'lucide', category: 'actions' },
    { name: 'RotateCcw', label: 'sync', library: 'lucide', category: 'actions' },
    { name: 'Power', label: 'power', library: 'lucide', category: 'actions' },
    { name: 'Lock', label: 'lock', library: 'lucide', category: 'security' },
    { name: 'Unlock', label: 'unlock', library: 'lucide', category: 'security' },
    { name: 'Key', label: 'key', library: 'lucide', category: 'security' },
    { name: 'Shield', label: 'shield', library: 'lucide', category: 'security' },
    { name: 'Star', label: 'star', library: 'lucide', category: 'general' },
    { name: 'Heart', label: 'heart', library: 'lucide', category: 'general' },
    { name: 'Bookmark', label: 'bookmark', library: 'lucide', category: 'general' },
    { name: 'Tag', label: 'tag', library: 'lucide', category: 'general' },
    { name: 'Tags', label: 'tags', library: 'lucide', category: 'general' },
    { name: 'Plus', label: 'plus', library: 'lucide', category: 'actions' },
    { name: 'Minus', label: 'minus', library: 'lucide', category: 'actions' },
    { name: 'X', label: 'x', library: 'lucide', category: 'actions' },
    { name: 'Check', label: 'check', library: 'lucide', category: 'actions' },
    { name: 'Eye', label: 'eye', library: 'lucide', category: 'actions' },
    { name: 'EyeOff', label: 'eye-off', library: 'lucide', category: 'actions' },
    { name: 'Edit', label: 'edit', library: 'lucide', category: 'actions' },
    { name: 'Trash2', label: 'trash', library: 'lucide', category: 'actions' },
    { name: 'Copy', label: 'copy', library: 'lucide', category: 'actions' },
    { name: 'Save', label: 'save', library: 'lucide', category: 'actions' },
    { name: 'Printer', label: 'printer', library: 'lucide', category: 'actions' },
    { name: 'Share', label: 'share', library: 'lucide', category: 'actions' },
    { name: 'ExternalLink', label: 'external-link', library: 'lucide', category: 'actions' },
    { name: 'Link', label: 'link', library: 'lucide', category: 'actions' },
    { name: 'Bell', label: 'bell', library: 'lucide', category: 'communication' },
    { name: 'Volume2', label: 'volume', library: 'lucide', category: 'media' },
    { name: 'VolumeX', label: 'volume-off', library: 'lucide', category: 'media' },
    { name: 'Play', label: 'play', library: 'lucide', category: 'media' },
    { name: 'Pause', label: 'pause', library: 'lucide', category: 'media' },
    { name: 'Square', label: 'stop', library: 'lucide', category: 'media' },
    { name: 'ArrowUp', label: 'arrow-up', library: 'lucide', category: 'arrows' },
    { name: 'ArrowDown', label: 'arrow-down', library: 'lucide', category: 'arrows' },
    { name: 'ArrowLeft', label: 'arrow-left', library: 'lucide', category: 'arrows' },
    { name: 'ArrowRight', label: 'arrow-right', library: 'lucide', category: 'arrows' },
    { name: 'ChevronUp', label: 'chevron-up', library: 'lucide', category: 'arrows' },
    { name: 'ChevronDown', label: 'chevron-down', library: 'lucide', category: 'arrows' },
    { name: 'ChevronLeft', label: 'chevron-left', library: 'lucide', category: 'arrows' },
    { name: 'ChevronRight', label: 'chevron-right', library: 'lucide', category: 'arrows' }
];

// 默认图标列表
const defaultIconList: IconItem[] = [...primeVueIcons, ...lucideIcons];

// 响应式数据
const selectedIcon = ref(props.modelValue);
const iconSelectorVisible = ref(false);
const tempSelectedIcon = ref('');
const searchKeyword = ref('');
const currentLibrary = ref<IconLibrary>(props.defaultLibrary);
const filteredIcons = ref<IconItem[]>([]);

// 计算属性 - 图标列表
const iconList = computed(() => {
    return props.customIcons.length > 0 ? props.customIcons : defaultIconList;
});

// 计算属性 - 当前库的图标
const currentLibraryIcons = computed(() => {
    return iconList.value.filter(icon => icon.library === currentLibrary.value);
});

// 计算属性 - 图标选项（用于下拉框）
const iconOptions = computed(() => {
    return currentLibraryIcons.value.map((icon) => ({
        label: icon.label,
        value: icon.name
    }));
});

// 计算属性 - 按分类分组的图标
const iconsByCategory = computed(() => {
    const categories: Record<string, IconItem[]> = {};
    currentLibraryIcons.value.forEach(icon => {
        const category = icon.category || 'other';
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push(icon);
    });
    return categories;
});

// 计算属性 - 分类列表
const categoryList = computed(() => {
    return Object.keys(iconsByCategory.value).sort();
});

// 计算属性 - 启用的图标库
const enabledLibraries = computed(() => {
    return props.enabledLibraries.filter(lib =>
        iconList.value.some(icon => icon.library === lib)
    );
});

// 计算属性 - 当前库索引（用于标签页）
const currentLibraryIndex = computed({
    get: () => enabledLibraries.value.indexOf(currentLibrary.value),
    set: (index: number) => {
        if (index >= 0 && index < enabledLibraries.value.length) {
            switchLibrary(enabledLibraries.value[index]);
        }
    }
});

// 监听 modelValue 变化
watch(
    () => props.modelValue,
    (newValue) => {
        selectedIcon.value = newValue || '';
    },
    { immediate: true }
);

// 监听 selectedIcon 变化
watch(selectedIcon, (newValue) => {
    emit('update:modelValue', newValue);
    emit('change', newValue);
});

// 初始化过滤图标
filteredIcons.value = currentLibraryIcons.value;

/**
 * 获取图标标签
 * @param iconValue - 图标值
 * @returns 图标标签
 */
const getIconLabel = (iconValue: string): string => {
    const icon = iconList.value.find(item => item.name === iconValue);
    return icon ? icon.label : iconValue;
};

/**
 * 获取图标对象
 * @param iconValue - 图标值
 * @returns 图标对象
 */
const getIconItem = (iconValue: string): IconItem | undefined => {
    return iconList.value.find(item => item.name === iconValue);
};

/**
 * 处理图标改变
 */
const handleIconChange = () => {
    // 在下拉模式下，change 事件会自动触发
    // 在输入模式下，需要手动触发
    if (props.mode === 'input') {
        emit('update:modelValue', selectedIcon.value);
        emit('change', selectedIcon.value);
    }
};

/**
 * 切换图标库
 * @param library - 图标库类型
 */
const switchLibrary = (library: IconLibrary) => {
    currentLibrary.value = library;
    tempSelectedIcon.value = '';
    searchKeyword.value = '';
    filterIcons();
};

/**
 * 打开图标选择器
 */
const openIconSelector = () => {
    tempSelectedIcon.value = selectedIcon.value;
    iconSelectorVisible.value = true;
    searchKeyword.value = '';

    // 如果当前选中的图标属于某个库，切换到该库
    const selectedIconItem = getIconItem(selectedIcon.value);
    if (selectedIconItem) {
        currentLibrary.value = selectedIconItem.library;
    }

    filterIcons();
};

/**
 * 选择图标
 * @param icon - 图标对象
 */
const selectIcon = (icon: IconItem) => {
    tempSelectedIcon.value = icon.name;
};

/**
 * 确认图标选择
 */
const confirmIconSelection = () => {
    if (tempSelectedIcon.value) {
        selectedIcon.value = tempSelectedIcon.value;
    }
    iconSelectorVisible.value = false;
};

/**
 * 取消图标选择
 */
const cancelIconSelection = () => {
    tempSelectedIcon.value = '';
    iconSelectorVisible.value = false;
};

/**
 * 过滤图标
 */
const filterIcons = () => {
    if (!searchKeyword.value.trim()) {
        filteredIcons.value = currentLibraryIcons.value;
        return;
    }

    const keyword = searchKeyword.value.toLowerCase();
    filteredIcons.value = currentLibraryIcons.value.filter((icon) =>
        icon.name.toLowerCase().includes(keyword) ||
        icon.label.toLowerCase().includes(keyword)
    );
};

/**
 * 渲染图标组件
 * @param icon - 图标对象
 * @returns 图标组件或类名
 */
const renderIcon = (icon: IconItem) => {
    if (icon.library === 'lucide') {
        // 对于 Lucide 图标，返回组件名用于动态组件
        return icon.name;
    } else {
        // 对于 PrimeVue 图标，返回类名
        return icon.name;
    }
};

/**
 * 检查是否为 Lucide 图标
 * @param icon - 图标对象
 * @returns 是否为 Lucide 图标
 */
const isLucideIcon = (icon: IconItem): boolean => {
    return icon.library === 'lucide';
};
</script>

<template>
    <div class="icon-selector">
        <!-- 下拉选择框形式 -->
        <Select
v-if="mode === 'dropdown'" v-model="selectedIcon" :options="iconOptions" option-label="label"
            option-value="value" :placeholder="placeholder" :filter="filter" :filter-placeholder="filterPlaceholder"
            :show-clear="showClear" :invalid="invalid" :disabled="disabled" class="w-full" @change="handleIconChange">
            <template #value="{ value }">
                <div v-if="value" class="flex items-center gap-2">
                    <!-- PrimeVue 图标 -->
                    <i
v-if="!getIconItem(value) || !isLucideIcon(getIconItem(value)!)" :class="value"
                        class="text-base text-surface-600"></i>
                    <!-- Lucide 图标 -->
                    <component :is="value" v-else class="w-4 h-4 text-surface-600" />
                    <span class="text-sm">{{ getIconLabel(value) }}</span>
                </div>
                <span v-else class="text-sm text-surface-400">{{ placeholder }}</span>
            </template>
            <template #option="{ option }">
                <div class="flex items-center gap-2 py-1">
                    <!-- PrimeVue 图标 -->
                    <i
v-if="!getIconItem(option.value) || !isLucideIcon(getIconItem(option.value)!)"
                        :class="option.value" class="text-base text-surface-600"></i>
                    <!-- Lucide 图标 -->
                    <component :is="option.value" v-else class="w-4 h-4 text-surface-600" />
                    <span class="text-sm">{{ option.label }}</span>
                </div>
            </template>
        </Select>

        <!-- 输入框 + 按钮形式 -->
        <div v-else-if="mode === 'input'" class="flex gap-2">
            <div class="relative flex-1">
                <InputGroup>
                    <InputGroupAddon>
                        <!-- PrimeVue 图标预览 -->
                        <i
v-if="!getIconItem(selectedIcon) || !isLucideIcon(getIconItem(selectedIcon)!)"
                            :class="selectedIcon" class="text-sm text-surface-500"></i>
                        <!-- Lucide 图标预览 -->
                        <component :is="selectedIcon" v-else :size="14" />
                    </InputGroupAddon>
                    <InputText
v-model="selectedIcon" placeholder="点击选择图标" :invalid="invalid" :disabled="disabled"
                        :class="{ 'pl-8': selectedIcon && showPreview }" class="w-full text-sm" readonly
                        @click="openIconSelector" />
                </InputGroup>
            </div>
        </div>

        <!-- 图标选择器弹窗 - 极简版 -->
        <Dialog
v-model:visible="iconSelectorVisible" :modal="true" :dismissable="true" header="选择图标"
            class="icon-selector-dialog" :style="{ width: '600px', maxWidth: '90vw' }">

            <!-- 搜索框 -->
            <div v-if="enableSearch" class="mb-4">
                <InputText v-model="searchKeyword" placeholder="搜索图标..." class="w-full" @input="filterIcons" />
            </div>

            <!-- 图标库切换 -->
            <div v-if="showLibraryTabs && enabledLibraries.length > 1" class="mb-4">
                <div class="flex gap-2">
                    <Button
v-for="library in enabledLibraries" :key="library"
                        :label="library === 'primevue' ? 'PrimeVue' : 'Lucide'"
                        :severity="currentLibrary === library ? 'primary' : 'secondary'"
                        :outlined="currentLibrary !== library" size="small" @click="switchLibrary(library)" />
                </div>
            </div>

            <!-- 图标网格 -->
            <div class="icon-grid-container">
                <div class="icon-grid">
                    <button
v-for="icon in filteredIcons" :key="icon.name"
                        :class="['icon-btn', { 'selected': tempSelectedIcon === icon.name }]" :title="icon.label"
                        @click="selectIcon(icon)">
                        <i v-if="!isLucideIcon(icon)" :class="icon.name"></i>
                        <component :is="icon.name" v-else class="w-5 h-5" />
                    </button>
                </div>

                <!-- 空状态 -->
                <div v-if="filteredIcons.length === 0" class="text-center py-8 text-gray-500">
                    <i class="pi pi-search text-2xl mb-2"></i>
                    <p>未找到图标</p>
                </div>
            </div>

            <!-- 底部操作 -->
            <template #footer>
                <div class="flex justify-between items-center">
                    <div v-if="tempSelectedIcon" class="flex items-center gap-2 text-sm text-gray-600">
                        <i
v-if="getIconItem(tempSelectedIcon) && !isLucideIcon(getIconItem(tempSelectedIcon)!)"
                            :class="tempSelectedIcon"></i>
                        <component
                            :is="tempSelectedIcon"
                            v-else-if="getIconItem(tempSelectedIcon) && isLucideIcon(getIconItem(tempSelectedIcon)!)" class="w-4 h-4" />
                        <span>{{ getIconLabel(tempSelectedIcon) }}</span>
                    </div>
                    <div v-else class="text-sm text-gray-400">请选择一个图标</div>

                    <div class="flex gap-2">
                        <Button label="取消" severity="secondary" outlined @click="cancelIconSelection" />
                        <Button label="确定" :disabled="!tempSelectedIcon" @click="confirmIconSelection" />
                    </div>
                </div>
            </template>
        </Dialog>
    </div>
</template>

<style lang="scss" scoped>
.icon-selector-dialog {
    :deep(.p-dialog) {
        border-radius: 8px;
    }
}

// 图标网格容器
.icon-grid-container {
    max-height: 400px;
    overflow-y: auto;
}

// 图标网格
.icon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
    gap: 8px;
}

// 图标按钮
.icon-btn {
    width: 50px;
    height: 50px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    background: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    color: #6b7280;
    transition: all 0.15s ease;

    &:hover {
        border-color: #3b82f6;
        color: #3b82f6;
    }

    &.selected {
        border-color: #3b82f6;
        background: #eff6ff;
        color: #3b82f6;
    }
}

// 响应式
@media (max-width: 768px) {
    .icon-selector-dialog {
        :deep(.p-dialog) {
            width: 95vw !important;
        }
    }

    .icon-grid {
        grid-template-columns: repeat(auto-fill, minmax(45px, 1fr));
        gap: 6px;
    }

    .icon-btn {
        width: 45px;
        height: 45px;
        font-size: 1.1rem;
    }
}
</style>
