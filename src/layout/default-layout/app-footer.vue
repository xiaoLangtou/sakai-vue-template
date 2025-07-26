<script setup>
defineProps({
    isMobile: {
        type: Boolean,
        default: false
    }
});
</script>

<template>
    <footer class="layout-footer" :class="{
        'mobile-footer': isMobile,
        'desktop-footer': !isMobile
    }">
        <div class="footer-content">
            <span class="footer-text">
                SAKAI by
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

<style scoped>
.layout-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 1.5rem;
    background-color: var(--surface-card);
    border-top: 1px solid var(--surface-border);
    color: var(--text-color-secondary);
    font-size: 0.875rem;
    transition: all 0.3s ease;
}

.footer-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 1200px;
}

.footer-text {
    display: flex;
    align-items: center;
    gap: 0.25rem;
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

/* 响应式适配 */
@media (max-width: 640px) {
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

@media (min-width: 768px) and (max-width: 1023px) {
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