import { usePrimeConfirm } from '@/composables/usePrimeConfirm';

import globalToast from '@/services/core/toast';
import { dictTypeService } from '@/services/modules/dict-type';
import type { IDictType, IDictTypeQuery } from '@/services/types/dict';
import type { IPageResult } from '@/services/types/types';
import type { SearchParams } from '@/types/search';
import type { TTableConfig } from '@/types/table';
import { to } from '@/utils/result-handler';
import type DictTypeForm from '@/views/system/dict/component/dict-type-form.vue';
import { useInfiniteQuery } from '@tanstack/vue-query';
import type { MenuItem } from 'primevue/menuitem';
import { computed, ref } from 'vue';

export const useDict = () => {
    const { confirmDelete } = usePrimeConfirm();


    const dictTypeForm = useTemplateRef<InstanceType<typeof DictTypeForm>>('dictTypeForm');
    /**
     * 缓存菜单项，避免重复创建
     */
    const menuItemsCache = ref<Map<string | number, MenuItem[]>>(new Map());


    const searchParams = ref<SearchParams<IDictTypeQuery>>({
        keyword: '',
    });

    const pageSize = 15;

    const {
        data,
        isLoading,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        refetch
    } = useInfiniteQuery({
        queryKey: ['dictTypes', searchParams, pageSize],
        queryFn: async ({ pageParam = 1 }) => {
            const result = await to<IPageResult<IDictType>>(
                dictTypeService.getDictList({
                    current: pageParam as number,
                    size: pageSize,
                    dictName: searchParams.value.keyword,
                    ...searchParams.value.filters
                })
            );

            if (!result.ok) {
                throw new Error(result.error.message);
            }

            return result.value;
        },
        getNextPageParam: (lastPage: IPageResult<IDictType>) => {
            const current = Number(lastPage.pager.current);
            const totalPage = Number(lastPage.pager.totalPage);
            if (current < totalPage) {
                return current + 1;
            }
            return undefined;
        },
        initialPageParam: 1
    });

    // 展平数据
    const dictList = computed(() => {
        return data.value?.pages.flatMap((page) => page.records) || [];
    });

    // 总数
    const total = computed(() => {
        return data.value?.pages[0]?.pager.total || 0;
    });

    const handlePageChange = () => {
        console.warn('handlePageChange is not fully supported in infinite scroll mode');
    };

    const loadMore = () => {
        if (hasNextPage.value && !isFetchingNextPage.value) {
            fetchNextPage();
        }
    };

    const handleFilterChange = (params: SearchParams) => {
        searchParams.value = params;
        // useInfiniteQuery 会自动根据 queryKey 变化重置并重新获取
    };

    const handleRefresh = () => {
        menuItemsCache.value.clear();
        refetch();
    };

    const deleteDictType = async (dictType: IDictType) => {
        if (!dictType.id) return globalToast.error('字典类型ID不能为空');

        const result = await to(dictTypeService.removeDictType(dictType.id));
        if (result.ok) {
            globalToast.success('删除成功');
            handleRefresh();
        }
    };

    const editDictType = (type: IDictType) => {
        dictTypeForm.value?.openDrawer(type);
    };

    /**
     * 获取更多操作菜单项
     * @param dictType - 字典类型数据
     */
    const getMoreActions = (dictType: IDictType): MenuItem[] => {
        if (!dictType?.id) return [];

        if (menuItemsCache.value.has(dictType.id)) {
            return menuItemsCache.value.get(dictType.id)!;
        }

        const menuItems: MenuItem[] = [
            {
                label: '字典项',
                icon: 'pi pi-list'
            },
            {
                label: '删除',
                icon: 'pi pi-trash',
                disabled: dictType.systemFlag === 'SYSTEM',
                command: async () => {
                    await confirmDelete({
                        message: `确定要删除字典类型 "${dictType.dictName}(${dictType.dictCode})" 吗？`,
                        header: '确认删除',
                        accept: () => deleteDictType(dictType)
                    });
                }
            }
        ];

        menuItemsCache.value.set(dictType.id, menuItems);
        return menuItems;
    };

    const tableConfig = computed<TTableConfig<IDictType>>(() => ({
        dataKey: 'id',
        loading: isLoading.value || isFetchingNextPage.value,
        rows: pageSize,
        totalRecords: total.value,
        current: 1,
        columns: [],
        searchParams: searchParams.value as any,
        data: dictList.value
    }));

    return {
        dictTypeForm,
        tableConfig,
        handlePageChange,
        handleFilterChange,
        handleRefresh,
        getMoreActions,
        deleteDictType,
        loadMore,
        editDictType
    };
};
