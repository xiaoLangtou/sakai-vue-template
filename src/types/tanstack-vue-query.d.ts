declare module '@tanstack/vue-query' {
    import { QueryClient as OriginalQueryClient, QueryClientConfig } from '@tanstack/query-core';
    import { App, Plugin } from 'vue';
    import { Ref } from 'vue';

    export interface VueQueryPluginOptions {
        queryClient?: QueryClient;
    }

    export class QueryClient extends OriginalQueryClient {
        constructor(config?: QueryClientConfig);
    }

    export const VueQueryPlugin: Plugin;

    // Vue Query specific exports
    export interface UseQueryOptions<TData = unknown, TError = unknown> {
        queryKey: any[];
        queryFn: () => Promise<TData>;
        enabled?: boolean | Ref<boolean> | (() => boolean);
        staleTime?: number;
        cacheTime?: number;
        refetchOnWindowFocus?: boolean;
        retry?: boolean | number;
    }

    export interface UseQueryResult<TData = unknown, TError = unknown> {
        data: Ref<TData | undefined>;
        isLoading: Ref<boolean>;
        isError: Ref<boolean>;
        error: Ref<TError | null>;
        refetch: () => Promise<any>;
    }

    export function useQuery<TData = unknown, TError = unknown>(options: UseQueryOptions<TData, TError>): UseQueryResult<TData, TError>;

    // Infinite Query types
    export interface UseInfiniteQueryOptions<TData = unknown, TError = unknown, TPageParam = unknown> {
        queryKey: any[];
        queryFn: (context: { pageParam: TPageParam }) => Promise<TData>;
        getNextPageParam?: (lastPage: TData, allPages: TData[]) => TPageParam | undefined;
        getPreviousPageParam?: (firstPage: TData, allPages: TData[]) => TPageParam | undefined;
        initialPageParam: TPageParam;
        enabled?: boolean | Ref<boolean> | (() => boolean);
        staleTime?: number;
        cacheTime?: number;
        refetchOnWindowFocus?: boolean;
        retry?: boolean | number;
    }

    export interface UseInfiniteQueryResult<TData = unknown, TError = unknown> {
        data: Ref<{ pages: TData[]; pageParams: unknown[] } | undefined>;
        isLoading: Ref<boolean>;
        isError: Ref<boolean>;
        error: Ref<TError | null>;
        isFetchingNextPage: Ref<boolean>;
        isFetchingPreviousPage: Ref<boolean>;
        hasNextPage: Ref<boolean>;
        hasPreviousPage: Ref<boolean>;
        fetchNextPage: () => Promise<any>;
        fetchPreviousPage: () => Promise<any>;
        refetch: () => Promise<any>;
    }

    export function useInfiniteQuery<TData = unknown, TError = unknown, TPageParam = unknown>(
        options: UseInfiniteQueryOptions<TData, TError, TPageParam>
    ): UseInfiniteQueryResult<TData, TError>;

    export * from '@tanstack/query-core';
}
