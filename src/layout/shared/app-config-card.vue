<script setup lang="ts">
defineProps({
    title: {
        type: String,
        default: '配置'
    }
});
</script>

<template>
    <div class="section">
        <slot name="title">
            <Divider align="center" type="solid">
                <b>{{ title }}</b>
            </Divider>
        </slot>
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
.section {
    @apply space-y-4;
}
</style>
