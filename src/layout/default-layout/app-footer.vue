<script setup>
defineProps({
    isMobile: {
        type: Boolean,
        default: false
    }
});
</script>

<template>
    <footer
class="layout-footer" :class="{
        'mobile-footer': isMobile,
        'desktop-footer': !isMobile
    }">
        <div class="footer-content">
            <span class="footer-text">
                TVA by
                <a
                    href="https://primevue.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="footer-link"
                >
                    PrimeVue
                </a>
            </span>

            <!-- 移动端隐藏的额外信息 -->
            <div v-if="!isMobile" class="footer-extra">
                <span class="text-surface-500 dark:text-surface-400 text-sm">
                    © 2024 All rights reserved
                </span>
            </div>
        </div>
    </footer>
</template>

<style lang="scss" scoped>/* 响应式适配 */
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

.footer-text {
    @apply flex items-center gap-1
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
