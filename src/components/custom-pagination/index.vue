<!--
 * @Author: weipc 755197142@qq.com
 * @Date: 2025-01-26 23:23:00
 * @LastEditors: weipc 755197142@qq.com
 * @LastEditTime: 2025-01-26 23:23:00
 * @Description: 自定义分页组件 - 基于 PrimeVue Paginator 二次封装
-->
<script setup lang="ts">
import { computed } from 'vue';
import type { PageState } from 'primevue/paginator';

/**
 * 分页组件属性接口
 */
interface Props {
    /** 总记录数 */
    totalRecords?: number;
    /** 每页显示的行数 */
    rows?: number;
    /** 第一条记录的索引 */
    first?: number;
    /** 页面链接的数量 */
    pageLinkSize?: number;
    /** 每页行数选项 */
    rowsPerPageOptions?: number[];
    /** 分页器模板 */
    template?: string;
    /** 当前页报告模板 */
    currentPageReportTemplate?: string;
    /** 是否总是显示分页器 */
    alwaysShow?: boolean;
    /** 设计令牌 */
    dt?: any;
    /** 透传属性 */
    pt?: any;
    /** 透传选项 */
    ptOptions?: any;
    /** 是否无样式 */
    unstyled?: boolean;
}

/**
 * 组件属性定义
 */
const props = withDefaults(defineProps<Props>(), {
    totalRecords: 0,
    rows: 10,
    first: 0,
    pageLinkSize: 5,
    template: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown',
    currentPageReportTemplate: '显示第 {first} 到 {last} 条记录，共 {totalRecords} 条',
    alwaysShow: false,
    unstyled: false
});

/**
 * 组件事件定义
 */
interface Emits {
    /** 页面变化事件 */
    page: [event: PageState];
}

const emit = defineEmits<Emits>();

/**
 * 组件名称定义
 */
defineOptions({
    name: 'CustomPagination'
});

/**
 * 计算属性 - 分页器属性
 */
const paginatorProps = computed(() => ({
    totalRecords: props.totalRecords,
    rows: props.rows,
    first: props.first,
    pageLinkSize: props.pageLinkSize,
    rowsPerPageOptions: props.rowsPerPageOptions,
    template: props.template,
    currentPageReportTemplate: props.currentPageReportTemplate,
    alwaysShow: props.alwaysShow,
    dt: props.dt,
    pt: props.pt,
    ptOptions: props.ptOptions,
    unstyled: props.unstyled
}));

/**
 * 处理页面变化事件
 * @param event - 页面状态事件
 */
const handlePageChange = (event: PageState) => {
    emit('page', event);
};
</script>

<template>
    <div class="custom-pagination">
        <Paginator
            v-bind="paginatorProps"
            @page="handlePageChange"
        >
            <!-- 透传所有插槽 -->
            <template #start="slotProps">
                <slot name="start" v-bind="slotProps" />
            </template>

            <template #end="slotProps">
                <slot name="end" v-bind="slotProps" />
            </template>

            <template #firstpagelinkicon="slotProps">
                <slot name="firstpagelinkicon" v-bind="slotProps" />
            </template>

            <template #firsticon="slotProps">
                <slot name="firsticon" v-bind="slotProps" />
            </template>

            <template #prevpagelinkicon="slotProps">
                <slot name="prevpagelinkicon" v-bind="slotProps" />
            </template>

            <template #previcon="slotProps">
                <slot name="previcon" v-bind="slotProps" />
            </template>

            <template #nextpagelinkicon="slotProps">
                <slot name="nextpagelinkicon" v-bind="slotProps" />
            </template>

            <template #nexticon="slotProps">
                <slot name="nexticon" v-bind="slotProps" />
            </template>

            <template #lastpagelinkicon="slotProps">
                <slot name="lastpagelinkicon" v-bind="slotProps" />
            </template>

            <template #lasticon="slotProps">
                <slot name="lasticon" v-bind="slotProps" />
            </template>

            <template #rowsperpagedropdownicon="slotProps">
                <slot name="rowsperpagedropdownicon" v-bind="slotProps" />
            </template>

            <template #jumptopagedropdownicon="slotProps">
                <slot name="jumptopagedropdownicon" v-bind="slotProps" />
            </template>

            <template #container="slotProps">
                <slot name="container" v-bind="slotProps" />
            </template>
        </Paginator>
    </div>
</template>

<style lang="scss" scoped>
.custom-pagination {
    // 可以在这里添加自定义样式
    // 保持与 PrimeVue 原生组件的兼容性

    :deep(.p-paginator) {
        // 自定义分页器样式
        border-radius: var(--p-border-radius);

        .p-paginator-pages {
            .p-paginator-page {
                // 自定义页码按钮样式
                transition: all 0.2s ease;

                &:hover {
                    transform: translateY(-1px);
                }
            }
        }

        .p-dropdown {
            // 自定义下拉框样式
            min-width: 80px;
        }
    }
}
</style>
