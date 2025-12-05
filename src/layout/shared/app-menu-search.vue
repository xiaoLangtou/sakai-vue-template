<script lang="ts" setup>
import { useLucideIcon } from '@/composables';
import type { MenuOptions } from '@/services/types/menu';
import useMenuStore from '@/stores/menu';
import { Search, X } from 'lucide-vue-next';
import { pinyin } from 'pinyin-pro';
import { computed, nextTick, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

// ==================== Props & Emits ====================
interface Props {
    /** 是否显示 */
    visible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    visible: false
});

const emit = defineEmits<{
    'update:visible': [value: boolean];
    'menu-item-click': [];
}>();

// ==================== 状态管理 ====================
const router = useRouter();
const { menuList } = useMenuStore();
const { isLucideIcon, lucideIconName } = useLucideIcon();

const searchKeyword = ref('');
const searchInputRef = ref<HTMLInputElement>();
const selectedIndex = ref(0);

// ==================== 扁平化菜单 ====================
/**
 * 将树形菜单扁平化为一维数组
 */
const flattenMenu = (menus: MenuOptions[], parentPath: string[] = []): Array<MenuOptions & { fullPath: string[] }> => {
    const result: Array<MenuOptions & { fullPath: string[] }> = [];

    menus.forEach((menu) => {
        if (!menu.meta.isHide) {
            const currentPath = [...parentPath, menu.meta.title];
            result.push({
                ...menu,
                fullPath: currentPath
            });

            if (menu.children && menu.children.length > 0) {
                result.push(...flattenMenu(menu.children, currentPath));
            }
        }
    });

    return result;
};

const flatMenuList = computed(() => flattenMenu(menuList));

// ==================== 拼音搜索 ====================
/**
 * 获取文本的拼音首字母
 */
const getPinyinInitials = (text: string): string => {
    try {
        return pinyin(text, { pattern: 'first', toneType: 'none', type: 'array' }).join('').toLowerCase();
    } catch {
        return '';
    }
};

/**
 * 获取文本的完整拼音
 */
const getFullPinyin = (text: string): string => {
    try {
        return pinyin(text, { toneType: 'none', type: 'array' }).join('').toLowerCase();
    } catch {
        return '';
    }
};

/**
 * 搜索匹配
 */
const matchSearch = (menu: MenuOptions & { fullPath: string[] }, keyword: string): boolean => {
    const lowerKeyword = keyword.toLowerCase().trim();
    if (!lowerKeyword) return false;

    const title = menu.meta.title;
    const path = menu.path || '';

    // 1. 标题直接匹配
    if (title.toLowerCase().includes(lowerKeyword)) {
        return true;
    }

    // 2. 路径匹配
    if (path.toLowerCase().includes(lowerKeyword)) {
        return true;
    }

    // 3. 拼音首字母匹配
    const initials = getPinyinInitials(title);
    if (initials.includes(lowerKeyword)) {
        return true;
    }

    // 4. 完整拼音匹配
    const fullPinyin = getFullPinyin(title);
    if (fullPinyin.includes(lowerKeyword)) {
        return true;
    }

    // 5. 面包屑路径匹配
    const breadcrumb = menu.fullPath.join(' > ').toLowerCase();
    if (breadcrumb.includes(lowerKeyword)) {
        return true;
    }

    return false;
};

/**
 * 过滤后的菜单列表
 */
const filteredMenuList = computed(() => {
    if (!searchKeyword.value.trim()) {
        return [];
    }

    return flatMenuList.value.filter((menu) => matchSearch(menu, searchKeyword.value)).slice(0, 10); // 最多显示10条
});

// ==================== 事件处理 ====================
/**
 * 关闭搜索
 */
const closeSearch = () => {
    emit('update:visible', false);
    searchKeyword.value = '';
    selectedIndex.value = 0;
};

/**
 * 处理菜单项点击
 */
const handleMenuClick = (menu: MenuOptions) => {
    if (menu.path) {
        router.push({
            path: menu.path,
            ...(menu.params && Object.keys(menu.params).length > 0 && { params: menu.params }),
            ...(menu.query && Object.keys(menu.query).length > 0 && { query: menu.query })
        });
        emit('menu-item-click');
        closeSearch();
    }
};

/**
 * 键盘导航
 */
const handleKeydown = (event: KeyboardEvent) => {
    const maxIndex = filteredMenuList.value.length - 1;

    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            selectedIndex.value = Math.min(selectedIndex.value + 1, maxIndex);
            break;
        case 'ArrowUp':
            event.preventDefault();
            selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
            break;
        case 'Enter':
            event.preventDefault();
            if (filteredMenuList.value[selectedIndex.value]) {
                handleMenuClick(filteredMenuList.value[selectedIndex.value]);
            }
            break;
        case 'Escape':
            event.preventDefault();
            closeSearch();
            break;
    }
};

/**
 * 高亮匹配文本
 */
const highlightMatch = (text: string, keyword: string): string => {
    if (!keyword.trim()) return text;

    const lowerText = text.toLowerCase();
    const lowerKeyword = keyword.toLowerCase().trim();
    const index = lowerText.indexOf(lowerKeyword);

    if (index !== -1) {
        const before = text.slice(0, index);
        const match = text.slice(index, index + keyword.length);
        const after = text.slice(index + keyword.length);
        return `${before}<mark class="bg-yellow-200 dark:bg-yellow-600 text-gray-900 dark:text-white px-0.5 rounded">${match}</mark>${after}`;
    }

    // 尝试拼音匹配高亮
    const initials = getPinyinInitials(text);
    if (initials.includes(lowerKeyword)) {
        return `<mark class="bg-blue-200 dark:bg-blue-600 text-gray-900 dark:text-white px-0.5 rounded">${text}</mark>`;
    }

    return text;
};

// ==================== 监听 ====================
watch(
    () => props.visible,
    async (visible) => {
        if (visible) {
            await nextTick();
            searchInputRef.value?.focus();
        } else {
            searchKeyword.value = '';
            selectedIndex.value = 0;
        }
    }
);

watch(searchKeyword, () => {
    selectedIndex.value = 0;
});
</script>

<template>
    <Teleport to="body">
        <Transition
enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition-opacity duration-150"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div
v-if="visible"
                class="fixed inset-0 bg-black/50 dark:bg-black/70 z-[9999] flex items-start justify-center pt-[10vh]"
                @click.self="closeSearch">
                <Transition
enter-active-class="transition-all duration-200 ease-out"
                    enter-from-class="opacity-0 scale-95 -translate-y-4"
                    enter-to-class="opacity-100 scale-100 translate-y-0"
                    leave-active-class="transition-all duration-150 ease-in"
                    leave-from-class="opacity-100 scale-100 translate-y-0"
                    leave-to-class="opacity-0 scale-95 -translate-y-4">
                    <div
v-if="visible"
                        class="w-full max-w-2xl mx-4 bg-white dark:bg-surface-800 rounded-lg shadow-2xl overflow-hidden">
                        <!-- 搜索输入框 -->
                        <div class="flex items-center gap-3 p-4 border-b border-surface-200 dark:border-surface-700">
                            <Search :size="20" class="text-gray-400 flex-shrink-0" />
                            <input
ref="searchInputRef" v-model="searchKeyword" type="text"
                                placeholder="搜索菜单（支持拼音首字母，如：yhgl → 用户管理）"
                                class="flex-1 outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 text-base"
                                @keydown="handleKeydown" />
                            <button
                                class="flex-shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-surface-700 rounded transition-colors"
                                @click="closeSearch">
                                <X :size="18" class="text-gray-400" />
                            </button>
                        </div>

                        <!-- 搜索结果 -->
                        <div class="max-h-[60vh] overflow-y-auto">
                            <!-- 空状态 -->
                            <div v-if="!searchKeyword.trim()" class="p-8 text-center text-gray-400">
                                <Search :size="48" class="mx-auto mb-3 opacity-50" />
                                <p class="text-sm">输入关键词搜索菜单</p>
                                <p class="text-xs mt-2">支持中文、拼音、拼音首字母</p>
                            </div>

                            <!-- 无结果 -->
                            <div v-else-if="filteredMenuList.length === 0" class="p-8 text-center text-gray-400">
                                <Search :size="48" class="mx-auto mb-3 opacity-50" />
                                <p class="text-sm">未找到匹配的菜单</p>
                                <p class="text-xs mt-2">试试其他关键词</p>
                            </div>

                            <!-- 结果列表 -->
                            <div v-else class="py-2">
                                <div
v-for="(menu, index) in filteredMenuList" :key="menu.id" :class="[
                                    'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors',
                                    selectedIndex === index ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-gray-50 dark:hover:bg-surface-700'
                                ]" @click="handleMenuClick(menu)" @mouseenter="selectedIndex = index">
                                    <!-- 图标 -->
                                    <div
                                        class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-surface-700">
                                        <component
:is="lucideIconName(menu.meta.icon)"
                                            v-if="isLucideIcon(menu.meta.icon)" :size="18"
                                            class="text-gray-600 dark:text-gray-400" />
                                        <i
v-else-if="menu.meta.icon" :class="menu.meta.icon"
                                            class="text-gray-600 dark:text-gray-400" />
                                    </div>

                                    <!-- 内容 -->
                                    <div class="flex-1 min-w-0">
                                        <!-- 标题 -->
                                        <div
class="font-medium text-gray-900 dark:text-white"
                                            v-html="highlightMatch(menu.meta.title, searchKeyword)"></div>
                                        <!-- 面包屑 -->
                                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                                            {{ menu.fullPath.join(' > ') }}
                                        </div>
                                    </div>

                                    <!-- 快捷键提示 -->
                                    <div
v-if="selectedIndex === index"
                                        class="flex-shrink-0 text-xs text-gray-400 bg-gray-100 dark:bg-surface-700 px-2 py-1 rounded">
                                        Enter</div>
                                </div>
                            </div>
                        </div>

                        <!-- 底部提示 -->
                        <div
                            class="flex items-center justify-between px-4 py-2 border-t border-surface-200 dark:border-surface-700 bg-gray-50 dark:bg-surface-900 text-xs text-gray-500">
                            <div class="flex items-center gap-4">
                                <span><kbd class="kbd">↑</kbd> <kbd class="kbd">↓</kbd> 导航</span>
                                <span><kbd class="kbd">Enter</kbd> 选择</span>
                                <span><kbd class="kbd">Esc</kbd> 关闭</span>
                            </div>
                            <div>{{ filteredMenuList.length }} 条结果</div>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.kbd {
    @apply inline-block px-1.5 py-0.5 bg-white dark:bg-surface-800 border border-gray-300 dark:border-surface-600 rounded text-xs font-mono;
}
</style>
