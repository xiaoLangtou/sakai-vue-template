import type { TableColumns } from '@/composables';
import { dictDataService } from '@/services/modules/dict-data';
import { dictTypeService } from '@/services/modules/dict-type';

import { usePrimeConfirm } from '@/composables/usePrimeConfirm.ts';
import type { IDictData, IDictDataQuery, IDictType } from '@/services/types/dict';
import type { IPageResult } from '@/services/types/types';
import type { FilterConfig, SearchParams } from '@/types/search';
import type { TTableConfig } from '@/types/table.ts';
import { to } from '@/utils/result-handler';
import { useQuery } from '@tanstack/vue-query';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import type { MenuItem } from 'primevue/menuitem';
import { useToast } from 'primevue/usetoast';
import { computed, type ComputedRef, h, ref, watch } from 'vue';

export const useDictItems = (dictTypeId: ComputedRef<string | number | undefined>) => {
    const { confirmDelete } = usePrimeConfirm();
    const toast = useToast();
    const enabled = ref(false);

    watch(
        () => dictTypeId.value,
        (newVal) => {
            enabled.value = !!dictTypeId.value;
        },
        { immediate: true }
    );

    // 表格列配置
    const tableColumns = ref<TableColumns<IDictData>>([
        {
            key: 'dictLabel',
            field: 'dictLabel',
            header: '字典标签',
            frozen: true,
            alignFrozen: 'left',
            minWidth: 120
        },
        {
            key: 'dictValue',
            field: 'dictValue',
            header: '字典值'
        },
        {
            key: 'dictSort',
            field: 'dictSort',
            header: '排序'
        },
        {
            key: 'status',
            field: 'status',
            header: '状态'
        },
        {
            key: 'isDefault',
            field: 'isDefault',
            header: '默认值'
        },
        {
            key: 'dictRemark',
            field: 'dictRemark',
            header: '备注'
        },
        {
            key: 'createTime',
            field: 'createTime',
            header: '创建时间'
        }
    ]);

    const searchParams = ref<SearchParams<IDictDataQuery>>({
        keyword: '',
        filters: {}
    });

    const pageInfo = ref({
        current: 1,
        size: 10,
        total: 0
    });
    const {
        data: tableData,
        isLoading,
        refetch
    } = useQuery({
        queryKey: ['dictItems', dictTypeId.value, pageInfo.value.current, pageInfo.value.size, searchParams.value.keyword, searchParams.value.filters, pageInfo.value.total],
        queryFn: async () => {
            const result = await to<IPageResult<IDictData>>(
                dictDataService.getDictDataList({
                    typeId: dictTypeId.value as unknown as number,
                    current: pageInfo.value.current,
                    size: pageInfo.value.size,
                    dictName: searchParams.value.keyword,
                    ...searchParams.value.filters
                })
            );

            if (!result.ok) {
                pageInfo.value.total = 0;
                return [];
            }

            // 更新总记录数和表格数据
            pageInfo.value.total = result.value.pager.total;
            return result.value.records ?? [];
        },
        enabled: enabled
    });

    const { data: dictDetail } = useQuery({
        queryKey: [`dictDetail|${dictTypeId.value}`],
        queryFn: async () => {
            const result = await to<IDictType>(dictTypeService.getDictTypeDetail(dictTypeId.value as unknown as string));

            if (!result.ok) return {};
            console.log(result.value);
            return result.value;
        },
        enabled: enabled
    });

    function handleColumnsChange(columns: TableColumns<IDictData>): void {
        tableColumns.value = columns;
    }

    const handlePageChange = async (page: any) => {
        pageInfo.value.current = page.page + 1; // PrimeVue 分页从 0 开始
        pageInfo.value.size = page.rows;
        await refetch();
    };

    const handleFilterChange = async (params: SearchParams) => {
        searchParams.value = params;
        pageInfo.value.current = 1; // 重置到第一页
        await refetch();
    };

    const handleRefresh = async () => {
        pageInfo.value.current = 1; // 重置到第一页
        searchParams.value = {
            keyword: '',
            filters: {}
        };
        await refetch();
    };

    const deleteDictItem = async (data: IDictData) => {
        const res = await to(dictDataService.removeDictData(data.id as string));
        if (res.ok) {
            toast.add({ severity: 'success', summary: '成功', detail: '删除成功', life: 3000 });
            await refetch();
        }
    };

    /**
     * 获取更多操作菜单项
     * @param data - 字典类型数据
     */
    const getMoreActions = (data: IDictData): MenuItem[] => {
        return [
            {
                label: data.status ? '停用' : '启用',
                icon: data.status ? 'pi pi-times' : 'pi pi-check',
                disabled: data.systemFlag === 'SYSTEM'
                // command: () => toggleTypeStatus(data)
            },
            {
                label: '删除',
                icon: 'pi pi-trash',
                disabled: data.systemFlag === 'SYSTEM',
                command: () => {
                    confirmDelete({
                        message: `确定要删除字典项 "${data.dictLabel}" 吗？`,
                        header: '确认删除',
                        accept: () => deleteDictItem(data)
                    });
                }
            }
        ];
    };

    // 每行菜单的 ref 对象
    const menuRefs = ref<Record<number | string, any>>({});
    /**
     * 设置 Menu ref 实例
     */
    const setMenuRef = (el: any, id: number | string | undefined) => {
        if (el && id) {
            menuRefs.value[id] = el;
        }
    };
    /**
     * 打开对应行的菜单
     */
    const openRowMenu = (event: Event, id: number | string | undefined) => {
        if (!id) return;
        menuRefs.value[id]?.toggle(event);
    };

    const editDictType = (item: IDictData) => {
        // TODO: 实现编辑字典项功能
        console.log('编辑字典项:', item);
    };
    /**
     * 表格配置对象
     * 使用 computed 确保响应式更新
     */
    const tableConfig = computed<TTableConfig<IDictData>>(() => {
        return {
            dataKey: 'id',
            loading: isLoading.value,
            // 分页配置
            rows: pageInfo.value.size,
            totalRecords: pageInfo.value.total,
            current: pageInfo.value.current,
            // 列配置
            columns: tableColumns.value,
            tableSettings: {
                showGridlines: false
            },
            filterConfigs:[],
            actions: {
                frozen: true,
                alignFrozen: 'right',
                width: 200,
                render: (item: IDictData) => {
                    return h(
                        'div',
                        {
                            class: 'flex justify-center items-center'
                        },
                        [
                            h(Button, {
                                icon: 'pi pi-pen-to-square',
                                label: '编辑',
                                variant: 'text',
                                onClick: () => editDictType(item)
                            }),

                            h(Button, {
                                icon: 'pi pi-ellipsis-h',
                                variant: 'text',
                                onClick: (event: Event) => openRowMenu(event, item.id)
                            }),
                            h(Menu, {
                                ref: (el) => setMenuRef(el, item.id),
                                model: getMoreActions(item),
                                popup: true
                            })
                        ]
                    );
                }
            },
            // 额外配置
            searchParams: searchParams.value,
            data: tableData.value ?? []
        };
    });

    return {
        tableConfig,
        tableData,
        dictDetail,
        isLoading,
        searchParams,
        tableColumns,
        handleColumnsChange,
        handlePageChange,
        handleFilterChange,
        handleRefresh,
        deleteDictItem
    };
};
