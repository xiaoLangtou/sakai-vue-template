/// <reference types="@rsbuild/core/types" />

export {};


declare module 'vue/types/vue' {
    interface Vue {
        $echarts: any;
    }
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $t: (key: string) => string;
        $tm: (key: string) => [] | { [p: string]: any };
    }
}
