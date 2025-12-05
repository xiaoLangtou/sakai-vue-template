<script lang="ts" setup>
import CustomDrawer from '@/components/custom-drawer';
import { NOIR_SEMANTIC_COLORS, OTHER_SEMANTIC, PRIMARY_COLOR_MAP, PRIMARY_COLORS, SURFACE_COLORS } from '@/preferences/colors.ts';
import globalToast from '@/services/core/toast.ts';
import { useLayoutStore } from '@/stores/layout';
import { $t, updatePreset, updateSurfacePalette } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';
import Nora from '@primeuix/themes/nora';
import { useClipboard } from '@vueuse/core';
import { storeToRefs } from 'pinia';
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
const { layoutConfig, isShowTab, tabStyle, isShowIcon, isShowHeader, isShowFooter, companyName, companyHomepage, date, icp, icpLink, isEnableColorWeak, isEnableGray } = storeToRefs(layoutStore);

// 使用 VueUse 的 useClipboard
const { copy, copied } = useClipboard();

const presets = {
    Aura,
    Lara,
    Nora
};
const preset = ref(layoutConfig.value.preset);
const presetOptions = ref(Object.keys(presets));

/**
 * 布局模式类型
 */
type LayoutMode = 'sidebar' | 'topbar';

/**
 * 类型守卫：检查是否为有效的布局模式
 */
const isValidLayoutMode = (mode: unknown): mode is LayoutMode => {
    return mode === 'sidebar' || mode === 'topbar';
};

const layoutMode = ref<LayoutMode>(isValidLayoutMode(layoutConfig.value.layoutMode) ? layoutConfig.value.layoutMode : 'sidebar');
const layoutModeOptions = ref([
    { label: 'Static', value: 'sidebar' },
    { label: 'Horizontal', value: 'topbar' }
]);

// 工具函数
function capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getColorByName(colorName: string): string {
    return PRIMARY_COLOR_MAP[colorName] || '#6b7280';
}

const primaryColors = ref(PRIMARY_COLORS);

const surfaces = ref(SURFACE_COLORS);

function getPresetExt() {
    const color = primaryColors.value.find((c) => c.name === layoutConfig.value.primary);

    if (color && color.name === 'noir') {
        return NOIR_SEMANTIC_COLORS;
    } else {
        return OTHER_SEMANTIC(color);
    }
}

function updateColors(type: 'primary' | 'surface', color: any) {
    if (type === 'primary') {
        layoutConfig.value.primary = color.name;
        console.log(layoutConfig.value.primary);
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

// 复制配置功能
async function handleConfirm() {
    const configString = layoutStore.generateConfigString(layoutConfig.value);
    await copy(configString);

    if (copied.value) {
        globalToast.success('复制成功，请在项目下的【src/preferences/config.ts】文件内进行覆盖', '复制成功');
        // 这里可以添加成功提示，比如使用 toast 组件
    } else {
        globalToast.error('复制失败');
    }
}

// 初始化主题
function initializeTheme() {
    const presetValue = presets[layoutConfig.value.preset as keyof typeof presets];
    console.log(layoutConfig.value.preset);
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
:show-default-footer="true" :visible="props.visible" header="系统配置" subheader="自定义偏好设置 & 实时预览"
        position="right" style="width: 420px" @update:visible="emit('update:visible', $event)">
        <div class="theme-customizer">
            <!-- Theme Style Section -->
            <AppConfigCard title="主题风格">
                <div class="flex items-center justify-center">
                    <SelectButton
v-model="preset" :allow-empty="false" :options="presetOptions"
                        @change="onPresetChange" />
                </div>
            </AppConfigCard>

            <AppConfigCard title="主题颜色">
                <div class="color-grid">
                    <div
v-for="color in primaryColors" :key="color.name"
                        :class="{ 'color-option--selected': layoutConfig.primary === color.name }"
                        class="color-option group rounded-md hvr-wobble-skew" @click="updateColors('primary', color)">
                        <div
:style="{ backgroundColor: color.palette[500] || getColorByName(color.name) }"
                            class="color-swatch">
                            <i v-if="layoutConfig.primary === color.name" class="pi pi-check check-icon"></i>
                        </div>
                        <span class="color-label">{{ capitalizeFirst(color.name) }}</span>
                    </div>
                </div>
            </AppConfigCard>

            <!-- Surface Color Section -->
            <AppConfigCard title="前景色">
                <div class="color-grid">
                    <div
v-for="surface in surfaces" :key="surface.name"
                        :class="{ 'color-option--selected': layoutConfig.surface === surface.name }"
                        class="color-option group rounded-md hvr-wobble-skew" @click="updateColors('surface', surface)">
                        <div :style="{ backgroundColor: surface.palette[500] || '#6b7280' }" class="color-swatch">
                            <i v-if="layoutConfig.surface === surface.name" class="pi pi-check check-icon"></i>
                        </div>
                        <span class="color-label">{{ capitalizeFirst(surface.name) }}</span>
                    </div>
                </div>
            </AppConfigCard>

            <!-- Layout Mode Section -->
            <AppConfigCard title="布局模式">
                <div class="layout-mode-options">
                    <div
v-for="option in layoutModeOptions" :key="option.value"
                        :class="{ 'layout-mode-option--selected': layoutMode === option.value }"
                        class="layout-mode-option group" @click="
                            layoutMode = option.value as 'sidebar' | 'topbar';
                        onLayoutModeChange();
                        ">
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
                <div class="flex flex-col gap-2">
                    <div class="flex items-center justify-between">
                        <span class="font-bold">是否显示</span>
                        <ToggleSwitch v-model="isShowTab" />
                    </div>
                    <!-- 标签页的样式 -->
                    <div class="flex items-center justify-between">
                        <span class="font-bold">标签页的样式</span>
                        <SelectButton
v-model="tabStyle" :allow-empty="false" :options="[
                            {
                                label: '卡片',
                                value: 'Card'
                            },
                            {
                                label: '方形',
                                value: 'Square'
                            }
                        ]" option-label="label" option-value="value" />
                    </div>
                    <!-- 是否显示图标 -->
                    <div class="flex items-center justify-between">
                        <span class="font-bold">是否显示图标</span>
                        <ToggleSwitch v-model="isShowIcon" />
                    </div>
                </div>
            </AppConfigCard>
            <AppConfigCard title="顶栏">
                <!-- 是否显示 -->
                <div class="flex flex-col gap-2">
                    <div class="flex items-center justify-between">
                        <span class="font-bold">是否显示</span>
                        <ToggleSwitch v-model="isShowHeader" />
                    </div>
                </div>
            </AppConfigCard>
            <AppConfigCard title="底栏">
                <!-- 是否显示 -->
                <div class="flex flex-col gap-4">
                    <div class="flex items-center justify-between">
                        <span class="font-bold">是否显示</span>
                        <ToggleSwitch v-model="isShowFooter" />
                    </div>

                    <!-- 公司名 -->
                    <div class="flex items-center justify-between gap-2 w-full">
                        <span class="font-bold">公司名</span>
                        <InputText v-model="companyName" placeholder="请输入公司名称" />
                    </div>

                    <!-- 公司主页 -->
                    <div class="flex items-center justify-between gap-2">
                        <span class="font-bold">公司主页</span>
                        <InputText v-model="companyHomepage" placeholder="请输入公司主页链接" />
                    </div>

                    <!-- 日期 -->
                    <div class="flex items-center justify-between gap-2">
                        <span class="font-bold">日期</span>
                        <InputText v-model="date" placeholder="请输入日期" />
                    </div>

                    <!-- ICP备案号 -->
                    <div class="flex items-center justify-between gap-2">
                        <span class="font-bold">ICP备案号</span>
                        <InputText v-model="icp" placeholder="请输入ICP备案号" />
                    </div>

                    <!-- ICP网站链接 -->
                    <div class="flex items-center justify-between gap-2">
                        <span class="font-bold">ICP网站链接</span>
                        <InputText v-model="icpLink" placeholder="请输入ICP网站链接" />
                    </div>
                </div>
            </AppConfigCard>
            <AppConfigCard title="其他">
                <!-- 是否显示 -->
                <div class="flex flex-col gap-4">
                    <div class="flex items-center justify-between">
                        <span class="font-bold">色弱模式</span>
                        <ToggleSwitch v-model="isEnableColorWeak" />
                    </div>

                    <div class="flex items-center justify-between">
                        <span class="font-bold">灰色模式</span>
                        <ToggleSwitch v-model="isEnableGray" />
                    </div>
                </div>
            </AppConfigCard>
        </div>

        <template #footer>
            <div class="w-full">
                <Button class="w-full" label="复制偏好配置" icon="pi pi-clone" severity="primary" @click="handleConfirm" />
            </div>
        </template>
    </CustomDrawer>
</template>

<style lang="scss" scoped>
@use '@/assets/layout/_configurator';
</style>
