import type { TableColumns } from "@/composables";
import { dictDataService } from "@/services/modules/dict-data";
import { dictTypeService } from "@/services/modules/dict-type";

import type { IDictData, IDictDataQuery, IDictType } from "@/services/types/dict";
import type { IPageResult } from "@/services/types/types";
import type { FilterConfig, SearchParams } from "@/types/search";
import { to } from "@/utils/result-handler";
import { useQuery } from "@tanstack/vue-query";




export const useDictItems = (dictTypeId: number) => {
    // 表格列配置
    const tableColumns = ref<TableColumns<IDictData>>([
        {
            key: 'label',
            field: 'label',
            header: '字典标签',
            frozen: true,
            alignFrozen: 'left',
            minWidth: 120
        },
        {
            key: 'value',
            field: 'value',
            header: '字典值'
        },
        {
            key: 'sort',
            field: 'sort',
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
            key: 'remark',
            field: 'remark',
            header: '备注'
        },
        {
            key: 'createTime',
            field: 'createTime',
            header: '创建时间'
        },
        {
            key: 'actions',
            header: '操作',
            style: {
                width: '300px'
            },
            headerStyle: {
                display: 'flex',
                justifyContent: 'center'
            },
            frozen: true,
            alignFrozen: 'right'
        }
    ]);


    // 搜索和过滤配置
    const filterConfigs: FilterConfig[] = [
        {
            key: 'status',
            label: '状态',
            type: 'select',
            options: [
                { label: '全部', value: '' },
                { label: '启用', value: 'active' },
                { label: '禁用', value: 'inactive' }
            ]
        },
        {
            key: 'isDefault',
            label: '默认值',
            type: 'select',
            options: [
                { label: '全部', value: '' },
                { label: '是', value: 'true' },
                { label: '否', value: 'false' }
            ]
        }
    ];

    const searchParams = ref<SearchParams<IDictDataQuery>>({
        keyword: ''
    });

    const pageInfo = ref({
        current: 1,
        size: 10,
        total: 0
    })

    const { data: tableData, isLoading, refetch } = useQuery({
        queryKey: ['dictItems', pageInfo.value.current],
        queryFn: async () => {
            const result = await to<IPageResult<IDictData>>(dictDataService.getDictDataList({
                typeId: dictTypeId,
                current: pageInfo.value.current,
                size: pageInfo.value.size,
                dictName: searchParams.value.keyword,
                ...searchParams.value.filters
            }));

            if (!result.ok) {
                pageInfo.value.total = 0;
                return []
            }

            // 更新总记录数和表格数据
            pageInfo.value.total = result.value.pager.total;
            return result.value.records ?? [];
        }
    })

    const { data: dictDetail } = useQuery({
        queryKey: [`dictDetail|${dictTypeId}`],
        queryFn: async () => {
            const result = await to<IDictType>(dictTypeService.getDictTypeDetail(dictTypeId as unknown as string))

            if (!result.ok) return {}
            console.log(result.value)
            return result.value;
        }
    })




    function handleColumnsChange(columns: TableColumns<IDictData>): void {
        tableColumns.value = columns;
    }
    const handlePageChange = (page: any) => {
        pageInfo.value.current = page.page + 1; // PrimeVue 分页从 0 开始
        pageInfo.value.size = page.rows;
        refetch();
    }

    const handleFilterChange = (params: SearchParams) => {
        searchParams.value = params;
        pageInfo.value.current = 1; // 重置到第一页
        refetch();
    };

    const handleRefresh = () => {
        pageInfo.value.current = 1; // 重置到第一页
        searchParams.value = {
            keyword: '',
            filters: {
                dictCode: '',
                dictType: '',
                status: '',
                systemFlag: ''
            }
        }
        refetch();
    }

    return {
        tableColumns,
        filterConfigs,
        searchParams,
        pageInfo,
        tableData,
        dictDetail,
        isLoading,
        handlePageChange,
        handleFilterChange,
        handleRefresh, handleColumnsChange
    }
}
