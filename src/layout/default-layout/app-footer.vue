<script setup>
import { useLayoutStore } from '@/stores/layout';
import { storeToRefs } from 'pinia';

defineProps({
    isMobile: {
        type: Boolean,
        default: false
    }
});

const layoutStore = useLayoutStore();
const { companyName, companyHomepage, date, icp, icpLink } = storeToRefs(layoutStore);
</script>

<template>
    <footer
        class="layout-footer"
        :class="{
            'mobile-footer': isMobile,
            'desktop-footer': !isMobile
        }"
    >
        <div class="footer-content">
            <!-- 桌面端布局 -->
            <div v-if="!isMobile" class="desktop-layout">
                <div class="footer-center">
                    <span v-if="companyName" class="footer-text">
                        © {{ date || new Date().getFullYear() }}
                        <a v-if="companyHomepage" :href="companyHomepage" target="_blank" rel="noopener noreferrer" class="footer-link">
                            {{ companyName }}
                        </a>
                        <span v-else>{{ companyName }}</span>
                        版权所有
                    </span>
                    <span v-else class="footer-text"> © {{ date || new Date().getFullYear() }} 版权所有 </span>

                    <span v-if="icp" class="footer-separator">|</span>

                    <span v-if="icp" class="footer-text">
                        <a v-if="icpLink" :href="icpLink" target="_blank" rel="noopener noreferrer" class="footer-link">
                            {{ icp }}
                        </a>
                        <span v-else>{{ icp }}</span>
                    </span>
                </div>
            </div>

            <!-- 移动端布局 -->
            <div v-else class="mobile-layout">
                <div class="footer-main">
                    <span v-if="companyName" class="footer-text">
                        © {{ date || new Date().getFullYear() }}
                        <a v-if="companyHomepage" :href="companyHomepage" target="_blank" rel="noopener noreferrer" class="footer-link">
                            {{ companyName }}
                        </a>
                        <span v-else>{{ companyName }}</span>
                    </span>
                    <span v-else class="footer-text"> © {{ date || new Date().getFullYear() }} </span>
                </div>

                <div v-if="icp" class="footer-icp">
                    <a v-if="icpLink" :href="icpLink" target="_blank" rel="noopener noreferrer" class="footer-link">
                        {{ icp }}
                    </a>
                    <span v-else>{{ icp }}</span>
                </div>
            </div>
        </div>
    </footer>
</template>

<style lang="scss" scoped>
/* 响应式适配 */
@use '@/assets/layout/breakpoints' as bp;

.layout-footer {
    @apply flex items-center justify-center px-4 py-6 bg-[var(--surface-ground)];
    border-top: 1px solid var(--surface-border);
    color: var(--text-color-secondary);
    font-size: 0.875rem;
    transition: all 0.3s ease;
}

.footer-content {
    @apply flex items-center justify-center w-full max-w-[1200px] gap-2;
}

/* 桌面端布局样式 */
.desktop-layout {
    @apply flex items-center justify-center w-full;
}

.footer-center {
    @apply flex items-center justify-center gap-3;
}

.footer-separator {
    @apply text-surface-400 dark:text-surface-500 mx-1;
}

/* 移动端布局样式 */
.mobile-layout {
    @apply flex flex-col items-center gap-2 w-full;
}

.footer-main {
    @apply flex items-center justify-center;
}

.footer-icp {
    @apply flex items-center justify-center text-xs;
}

.footer-text {
    @apply flex items-center gap-1;
}

.footer-link {
    color: var(--primary-color);
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;
}

.footer-link:hover {
    text-decoration: underline;
    color: var(--primary-color-text);
}

.footer-extra {
    display: flex;
    align-items: center;
}

/* 移动端样式 */
.mobile-footer {
    padding: 0.75rem 1rem;
    font-size: 0.8rem;
}

.mobile-footer .footer-content {
    justify-content: center;
}

.mobile-footer .footer-extra {
    display: none;
}

/* 桌面端样式 */
.desktop-footer {
    padding: 1rem 1.5rem;
}

@include bp.mobile-only {
    .layout-footer {
        padding: 0.5rem 0.75rem;
        font-size: 0.75rem;
    }

    .footer-content {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
    }
}

@include bp.tablet-only {
    .layout-footer {
        padding: 0.875rem 1.25rem;
    }
}

/* 性能优化 */
.layout-footer {
    will-change: transform;
    backface-visibility: hidden;
}
</style>
