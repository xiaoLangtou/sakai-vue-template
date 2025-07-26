declare module '@tanstack/vue-query' {
  import { QueryClient as OriginalQueryClient, QueryClientConfig } from '@tanstack/query-core';
  import { App, Plugin } from 'vue';

  export interface VueQueryPluginOptions {
    queryClient?: QueryClient;
  }

  export class QueryClient extends OriginalQueryClient {
    constructor(config?: QueryClientConfig);
  }

  export const VueQueryPlugin: Plugin;

  export * from '@tanstack/query-core';
}