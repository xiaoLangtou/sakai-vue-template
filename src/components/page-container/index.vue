<template>
    <div class="base-container">
        <div v-if="$slots.header" class="card !px-1 !py-0 !bg-transparent">
            <slot name="header"></slot>
        </div>
        <div class="card h-full flex-1">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
defineOptions({
    name: 'PageContainer'
});
</script>

<style lang="scss" scoped>
.base-container {
    @apply flex flex-col w-full box-border  min-h-full gap-2 pb-3;
}
</style>
