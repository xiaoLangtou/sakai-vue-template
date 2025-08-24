<script lang="ts" setup>
import CustomDrawer from '@/components/custom-drawer';
import { useLayoutStore } from '@/stores/layout';
import { storeToRefs } from 'pinia';
import { $t, updatePreset, updateSurfacePalette } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';
import Nora from '@primeuix/themes/nora';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import AppConfigCard from './app-config-card.vue';

// 定义组件属性
interface Props {
    visible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    visible: false
});

// 定义组件事件
const emit = defineEmits<{
    'update:visible': [value: boolean];
}>();

const layoutStore = useLayoutStore();
const { layoutConfig, isShowTab, tabStyle, isShowIcon } = storeToRefs(layoutStore);

const presets = {
    Aura,
    Lara,
    Nora
};
const preset = ref(layoutConfig.value.preset);
const presetOptions = ref(Object.keys(presets));


const layoutMode = ref<'sidebar' | 'topbar'>((layoutConfig.value.layoutMode as 'sidebar' | 'topbar') || 'sidebar');
const layoutModeOptions = ref([
    { label: 'Static', value: 'sidebar' },
    { label: 'Horizontal', value: 'topbar' },
]);



// 工具函数
function capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getColorByName(colorName: string): string {
    const colorMap: Record<string, string> = {
        noir: '#000000',
        emerald: '#10b981',
        green: '#22c55e',
        lime: '#84cc16',
        orange: '#f97316',
        amber: '#f59e0b',
        yellow: '#eab308',
        teal: '#14b8a6',
        cyan: '#06b6d4',
        sky: '#0ea5e9',
        blue: '#3b82f6',
        indigo: '#6366f1',
        violet: '#8b5cf6',
        purple: '#a855f7',
        fuchsia: '#d946ef',
        pink: '#ec4899',
        rose: '#f43f5e'
    };
    return colorMap[colorName] || '#6b7280';
}

const primaryColors = ref([
    { name: 'noir', palette: {} },
    { name: 'emerald', palette: { 50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b', 950: '#022c22' } },
    { name: 'green', palette: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d', 950: '#052e16' } },
    { name: 'lime', palette: { 50: '#f7fee7', 100: '#ecfccb', 200: '#d9f99d', 300: '#bef264', 400: '#a3e635', 500: '#84cc16', 600: '#65a30d', 700: '#4d7c0f', 800: '#3f6212', 900: '#365314', 950: '#1a2e05' } },
    { name: 'orange', palette: { 50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12', 950: '#431407' } },
    { name: 'amber', palette: { 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f', 950: '#451a03' } },
    { name: 'yellow', palette: { 50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15', 500: '#eab308', 600: '#ca8a04', 700: '#a16207', 800: '#854d0e', 900: '#713f12', 950: '#422006' } },
    { name: 'teal', palette: { 50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4', 400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 800: '#115e59', 900: '#134e4a', 950: '#042f2e' } },
    { name: 'cyan', palette: { 50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9', 400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2', 700: '#0e7490', 800: '#155e75', 900: '#164e63', 950: '#083344' } },
    { name: 'sky', palette: { 50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1', 800: '#075985', 900: '#0c4a6e', 950: '#082f49' } },
    { name: 'blue', palette: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a', 950: '#172554' } },
    { name: 'indigo', palette: { 50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81', 950: '#1e1b4b' } },
    { name: 'violet', palette: { 50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95', 950: '#2e1065' } },
    { name: 'purple', palette: { 50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe', 400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7e22ce', 800: '#6b21a8', 900: '#581c87', 950: '#3b0764' } },
    { name: 'fuchsia', palette: { 50: '#fdf4ff', 100: '#fae8ff', 200: '#f5d0fe', 300: '#f0abfc', 400: '#e879f9', 500: '#d946ef', 600: '#c026d3', 700: '#a21caf', 800: '#86198f', 900: '#701a75', 950: '#4a044e' } },
    { name: 'pink', palette: { 50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4', 400: '#f472b6', 500: '#ec4899', 600: '#db2777', 700: '#be185d', 800: '#9d174d', 900: '#831843', 950: '#500724' } },
    { name: 'rose', palette: { 50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af', 400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c', 800: '#9f1239', 900: '#881337', 950: '#4c0519' } }
]);

const surfaces = ref([
    {
        name: 'slate',
        palette: { 0: '#ffffff', 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617' }
    },
    {
        name: 'gray',
        palette: { 0: '#ffffff', 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827', 950: '#030712' }
    },
    {
        name: 'zinc',
        palette: { 0: '#ffffff', 50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7', 300: '#d4d4d8', 400: '#a1a1aa', 500: '#71717a', 600: '#52525b', 700: '#3f3f46', 800: '#27272a', 900: '#18181b', 950: '#09090b' }
    },
    {
        name: 'neutral',
        palette: { 0: '#ffffff', 50: '#fafafa', 100: '#f5f5f5', 200: '#e5e5e5', 300: '#d4d4d4', 400: '#a3a3a3', 500: '#737373', 600: '#525252', 700: '#404040', 800: '#262626', 900: '#171717', 950: '#0a0a0a' }
    },
    {
        name: 'stone',
        palette: { 0: '#ffffff', 50: '#fafaf9', 100: '#f5f5f4', 200: '#e7e5e4', 300: '#d6d3d1', 400: '#a8a29e', 500: '#78716c', 600: '#57534e', 700: '#44403c', 800: '#292524', 900: '#1c1917', 950: '#0c0a09' }
    },
    {
        name: 'soho',
        palette: { 0: '#ffffff', 50: '#f4f4f4', 100: '#e8e9e9', 200: '#d2d2d4', 300: '#bbbcbe', 400: '#a5a5a9', 500: '#8e8f93', 600: '#77787d', 700: '#616268', 800: '#4a4b52', 900: '#34343d', 950: '#1d1e27' }
    },
    {
        name: 'viva',
        palette: { 0: '#ffffff', 50: '#f3f3f3', 100: '#e7e7e8', 200: '#cfd0d0', 300: '#b7b8b9', 400: '#9fa1a1', 500: '#87898a', 600: '#6e7173', 700: '#565a5b', 800: '#3e4244', 900: '#262b2c', 950: '#0e1315' }
    },
    {
        name: 'ocean',
        palette: { 0: '#ffffff', 50: '#fbfcfc', 100: '#F7F9F8', 200: '#EFF3F2', 300: '#DADEDD', 400: '#B1B7B6', 500: '#828787', 600: '#5F7274', 700: '#415B61', 800: '#29444E', 900: '#183240', 950: '#0c1920' }
    }
]);

function getPresetExt() {
    console.log(layoutConfig)
    const color = primaryColors.value.find((c) => c.name === layoutConfig.value.primary);

    if (color && color.name === 'noir') {
        return {
            semantic: {
                primary: {
                    50: '{surface.50}',
                    100: '{surface.100}',
                    200: '{surface.200}',
                    300: '{surface.300}',
                    400: '{surface.400}',
                    500: '{surface.500}',
                    600: '{surface.600}',
                    700: '{surface.700}',
                    800: '{surface.800}',
                    900: '{surface.900}',
                    950: '{surface.950}'
                },
                colorScheme: {
                    light: {
                        primary: {
                            color: '{primary.950}',
                            contrastColor: '#ffffff',
                            hoverColor: '{primary.800}',
                            activeColor: '{primary.700}'
                        },
                        highlight: {
                            background: '{primary.950}',
                            focusBackground: '{primary.700}',
                            color: '#ffffff',
                            focusColor: '#ffffff'
                        }
                    },
                    dark: {
                        primary: {
                            color: '{primary.50}',
                            contrastColor: '{primary.950}',
                            hoverColor: '{primary.200}',
                            activeColor: '{primary.300}'
                        },
                        highlight: {
                            background: '{primary.50}',
                            focusBackground: '{primary.300}',
                            color: '{primary.950}',
                            focusColor: '{primary.950}'
                        }
                    }
                }
            }
        };
    } else {
        return {
            semantic: {
                primary: color?.palette || {},
                colorScheme: {
                    light: {
                        primary: {
                            color: '{primary.500}',
                            contrastColor: '#ffffff',
                            hoverColor: '{primary.600}',
                            activeColor: '{primary.700}'
                        },
                        highlight: {
                            background: '{primary.50}',
                            focusBackground: '{primary.100}',
                            color: '{primary.700}',
                            focusColor: '{primary.800}'
                        }
                    },
                    dark: {
                        primary: {
                            color: '{primary.400}',
                            contrastColor: '{surface.900}',
                            hoverColor: '{primary.300}',
                            activeColor: '{primary.200}'
                        },
                        highlight: {
                            background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
                            focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
                            color: 'rgba(255,255,255,.87)',
                            focusColor: 'rgba(255,255,255,.87)'
                        }
                    }
                }
            }
        };
    }
}

function updateColors(type: 'primary' | 'surface', color: any) {
    if (type === 'primary') {
        layoutConfig.value.primary = color.name;
    } else if (type === 'surface') {
        layoutConfig.value.surface = color.name;
    }

    applyTheme(type, color);
}

function applyTheme(type: 'primary' | 'surface', color: any) {
    if (type === 'primary') {
        updatePreset(getPresetExt());
    } else if (type === 'surface') {
        updateSurfacePalette(color.palette);
    }
}

function onPresetChange() {
    layoutConfig.value.preset = preset.value;
    const presetValue = presets[preset.value as keyof typeof presets];
    const surfacePalette = surfaces.value.find((s) => s.name === layoutConfig.value.surface)?.palette;

    $t().preset(presetValue).preset(getPresetExt()).surfacePalette(surfacePalette).use({ useDefaultOptions: true });
}

function onLayoutModeChange() {
    layoutConfig.value.layoutMode = layoutMode.value;
}

// 初始化主题
function initializeTheme() {
    const presetValue = presets[layoutConfig.value.preset as keyof typeof presets];
    const surfacePalette = surfaces.value.find((s) => s.name === layoutConfig.value.surface)?.palette;

    $t().preset(presetValue).preset(getPresetExt()).surfacePalette(surfacePalette).use({ useDefaultOptions: true });
}

// 事件监听器引用
let layoutConfigChangeHandler: ((event: Event) => void) | null = null;

// 组件挂载时初始化主题
onMounted(() => {
    initializeTheme();

    // 监听来自layout的主题配置变化事件
    layoutConfigChangeHandler = (event: Event) => {
        const customEvent = event as CustomEvent;
        const { primary, surface } = customEvent.detail;
        if (primary && primary !== layoutConfig.value.primary) {
            layoutConfig.value.primary = primary;
            updatePreset(getPresetExt());
        }
        if (surface && surface !== layoutConfig.value.surface) {
            layoutConfig.value.surface = surface;
            const surfacePalette = surfaces.value.find((s) => s.name === surface)?.palette;
            if (surfacePalette) {
                updateSurfacePalette(surfacePalette);
            }
        }
    };

    window.addEventListener('layout-config-changed', layoutConfigChangeHandler);
});

// 组件卸载时清理事件监听器
onUnmounted(() => {
    if (layoutConfigChangeHandler) {
        window.removeEventListener('layout-config-changed', layoutConfigChangeHandler);
        layoutConfigChangeHandler = null;
    }
});

// 监听主题色变化，确保立即应用
watch(
    () => layoutConfig.value.primary,
    () => {
        updatePreset(getPresetExt());
    },
    { immediate: false }
);

// 监听表面颜色变化
watch(
    () => layoutConfig.value.surface,
    (newSurface) => {
        if (newSurface) {
            const surfacePalette = surfaces.value.find((s) => s.name === newSurface)?.palette;
            if (surfacePalette) {
                updateSurfacePalette(surfacePalette);
            }
        }
    },
    { immediate: false }
);
</script>


<template>
    <CustomDrawer
:visible="props.visible" header="系统配置" position="right" style="width: 420px;"
        :show-default-footer="false" @update:visible="emit('update:visible', $event)">
        <div class="theme-customizer">
            <!-- Theme Style Section -->
            <AppConfigCard title="主题风格">
                <div class="flex items-center justify-center">
                    <SelectButton
v-model="preset" :options="presetOptions" :allow-empty="false"
                        @change="onPresetChange" />
                </div>
            </AppConfigCard>


            <AppConfigCard title="主题颜色">
                <div class="color-grid">
                    <div
v-for="color in primaryColors" :key="color.name" class="color-option group"
                        :class="{ 'color-option--selected': layoutConfig.value.primary === color.name }"
                        @click="updateColors('primary', color)">
                        <div
class="color-swatch"
                            :style="{ backgroundColor: color.palette[500] || getColorByName(color.name) }">
                            <i v-if="layoutConfig.value.primary === color.name" class="pi pi-check check-icon"></i>
                        </div>
                        <span class="color-label">{{ capitalizeFirst(color.name) }}</span>
                    </div>
                </div>
            </AppConfigCard>

            <!-- Surface Color Section -->
            <AppConfigCard title="前景色">
                <div class="color-grid">
                    <div
v-for="surface in surfaces" :key="surface.name" class="color-option group"
                        :class="{ 'color-option--selected': layoutConfig.value.surface === surface.name }"
                        @click="updateColors('surface', surface)">
                        <div class="color-swatch" :style="{ backgroundColor: surface.palette[500] || '#6b7280' }">
                            <i v-if="layoutConfig.value.surface === surface.name" class="pi pi-check check-icon"></i>
                        </div>
                        <span class="color-label">{{ capitalizeFirst(surface.name) }}</span>
                    </div>
                </div>
            </AppConfigCard>

            <!-- Layout Mode Section -->
            <AppConfigCard title="布局模式">
                <div class="layout-mode-options">
                    <div
v-for="option in layoutModeOptions" :key="option.value" class="layout-mode-option group"
                        :class="{ 'layout-mode-option--selected': layoutMode === option.value }"
                        @click="layoutMode = option.value as 'sidebar' | 'topbar'; onLayoutModeChange()">
                        <div class="layout-preview">
                            <div v-if="option.value === 'sidebar'" class="preview-sidebar-layout">
                                <div class="sidebar-nav">
                                    <div class="nav-item active"></div>
                                    <div class="nav-item"></div>
                                    <div class="nav-item"></div>
                                </div>
                                <div class="main-area">
                                    <div class="area-header"></div>
                                    <div class="area-content"></div>
                                </div>
                            </div>
                            <div v-else class="preview-topbar-layout">
                                <div class="topbar-nav">
                                    <div class="nav-item active"></div>
                                    <div class="nav-item"></div>
                                    <div class="nav-item"></div>
                                </div>
                                <div class="main-area">
                                    <div class="area-content full"></div>
                                </div>
                            </div>
                        </div>
                        <div class="layout-label">
                            <span class="layout-name">{{ option.label }}</span>
                        </div>
                    </div>
                </div>
            </AppConfigCard>
            <AppConfigCard title="标签栏">
                <!-- 是否显示 -->
                <div class="flex  flex-col gap-2">
                    <div class="flex items-center justify-between">
                        <span class="font-bold">是否显示</span>
                        <ToggleSwitch v-model="isShowTab" />
                    </div>
                    <!-- 标签页的样式 -->
                    <div class="flex items-center justify-between">
                        <span class="font-bold">标签页的样式</span>
                        <SelectButton
v-model="tabStyle" option-label="label" option-value="value" :options="[{
                            label: '时尚',
                            value: 'Fashion'
                        }, {
                            label: '卡片',
                            value: 'Card'
                        }, {
                            label: '方形',
                            value: 'Square'
                        }]" :allow-empty="false" />
                    </div>
                    <!-- 是否显示图标 -->
                    <div class="flex items-center justify-between">
                        <span class="font-bold">是否显示图标</span>
                        <ToggleSwitch v-model="isShowIcon" />
                    </div>
                </div>
            </AppConfigCard>
        </div>
    </CustomDrawer>
</template>



<style lang="scss" scoped>
// 主题定制器容器
.theme-customizer {
    @apply space-y-6;
}

// 定制器头部
.customizer-header {
    @apply flex items-center justify-between mb-6;
}

.customizer-subtitle {
    @apply text-sm text-gray-600 dark:text-gray-400 m-0;
}

.refresh-btn {
    @apply w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors duration-200 border-0 cursor-pointer;

    i {
        @apply text-gray-600 dark:text-gray-400 text-sm;
    }

    &:hover i {
        @apply text-gray-800 dark:text-gray-200;
    }
}

// 颜色网格
.color-grid {
    @apply grid grid-cols-4 gap-3;
}

.color-option {
    @apply flex items-center gap-2 cursor-pointer border border-gray-200 dark:border-gray-700 pt-2 pb-2 pl-2 text-center;

    &.color-option--selected {
        @apply border-primary-500;
    }
}

.color-swatch {
    @apply w-5 h-5 rounded-full flex items-center justify-center relative overflow-hidden;

    &::before {
        content: '';
        @apply absolute inset-0 bg-black bg-opacity-0;
    }

    &:hover::before {
        @apply bg-opacity-10;
    }
}

.check-icon {
    @apply text-white text-sm font-bold;
}

.color-label {
    @apply text-xs text-gray-600 dark:text-gray-400;
}

.color-option--selected .color-label {
    @apply text-primary-600 dark:text-primary-400 font-semibold;
}

// 布局模式选项
.layout-mode-options {
    @apply grid grid-cols-2 gap-4;
}

.layout-mode-option {
    @apply cursor-pointer;

    &.layout-mode-option--selected .layout-preview {
        @apply border-primary-500 bg-primary-50 dark:bg-primary-900/20;
        box-shadow: 0 0 0 2px rgba(var(--primary-500), 0.2);
    }

    &.layout-mode-option--selected .layout-name {
        @apply text-primary-600 dark:text-primary-400 font-semibold;
    }
}

.layout-preview {
    @apply w-full h-28 bg-gray-100 dark:bg-gray-800 rounded-lg p-3 border-2 border-gray-200 dark:border-gray-700 transition-all duration-200 group-hover:border-gray-300 dark:group-hover:border-gray-600 mb-2;
}

.preview-sidebar-layout {
    @apply flex h-full gap-2;
}

.sidebar-nav {
    @apply w-6 bg-gray-300 dark:bg-gray-600 rounded flex flex-col gap-1 p-1;
}

.nav-item {
    @apply h-1.5 bg-gray-400 dark:bg-gray-500 rounded-sm;

    &.active {
        @apply bg-primary-500;
    }
}

.main-area {
    @apply flex-1 flex flex-col gap-1;
}

.area-header {
    @apply h-2 bg-gray-300 dark:bg-gray-600 rounded;
}

.area-content {
    @apply flex-1 bg-gray-200 dark:bg-gray-700 rounded;

    &.full {
        @apply w-full;
    }
}

.preview-topbar-layout {
    @apply flex flex-col h-full gap-2;
}

.topbar-nav {
    @apply h-3 bg-gray-300 dark:bg-gray-600 rounded flex gap-1 p-1;

    .nav-item {
        @apply w-4 h-full bg-gray-400 dark:bg-gray-500 rounded-sm;

        &.active {
            @apply bg-primary-500;
        }
    }
}

.layout-label {
    @apply text-center;
}

.layout-name {
    @apply text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-200;
}

// 响应式设计
@media (max-width: 480px) {
    .theme-customizer {
        @apply p-4 space-y-4;
    }

    .color-grid {
        @apply grid-cols-3 gap-2;
    }

    .color-swatch {
        @apply w-10 h-10;
    }

    .color-label {
        @apply text-xs;
    }

    .layout-mode-options {
        @apply grid-cols-1 gap-3;
    }

    .layout-preview {
        @apply h-16;
    }
}
</style>
