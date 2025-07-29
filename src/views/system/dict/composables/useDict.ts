import type { TableColumns } from "@/composables";
import { dictTypeService } from "@/services/modules/dict-type";
import type { IDictType, IDictTypeQuery } from "@/services/types/dict";
import type { IPageResult } from "@/services/types/types";
import type { FilterConfig, SearchParams } from "@/types/search";
import { to } from "@/utils/result-handler";
import { useQuery } from "@tanstack/vue-query";



export const useDict = () => {
    const tableColumns = ref<TableColumns<IDictType>>([
        {
            key: 'dictName',
            field: 'dictName',
            header: '字典名称',
            frozen: true,
            alignFrozen: 'left',
            minWidth: 80
        },
        {
            key: 'dictCode',
            field: 'dictCode',
            header: '字典编码',
            frozen: true,
            alignFrozen: 'left',
            minWidth: 80
        },
        {
            key: 'systemFlag',
            field: 'systemFlag',
            header: '字典类型',
            minWidth: 120,
        },
        {
            key: 'status',
            field: 'status',
            header: '状态',
            minWidth: 80
        },
        {
            key: 'dataCount',
            field: 'dataCount',
            header: '字典项数量',
            minWidth: 80
        },
        {
            key: 'dictDesc',
            field: 'dictDesc',
            header: '字典描述',
            minWidth: 140,
            width: 200,
            ellipsis: true,           // 启用文本省略号
            showTooltip: true,        // 显示tooltip
            tooltipOptions: {
                position: 'bottom',     // tooltip位置
                showDelay: 500         // 显示延迟
            }
        },
        {
            key: 'createTime',
            field: 'createTime',
            header: '创建时间',
            minWidth: 100
        },
        {
            key: 'createBy',
            field: 'createBy',
            header: '创建人',
            minWidth: 100
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

    const filterConfigs = ref<FilterConfig[]>([
        {
            key: "dictCode",
            label: "字典编码",
            type: "input"
        },
        {
            key: "systemFlag",
            label: "字典类型",
            type: "select",
            options: [
                {
                    label: "业务字典",
                    value: "BUSINESS"
                },
                {
                    label: "系统字典",
                    value: "SYSTEM"
                }
            ]
        },
        {
            key: "status",
            label: "状态",
            type: "select",
            options: [
                {
                    label: "启用",
                    value: "1"
                },
                {
                    label: "禁用",
                    value: "0"
                }
            ]
        }
    ])


    const searchParams = ref<SearchParams<IDictTypeQuery>>({
        keyword: '',
        filters: {
            dictCode: '',
            dictType: '',
            status: '',
            systemFlag: ''
        }
    })

    const pageInfo = ref({
        current: 1,
        size: 10,
        total: 0
    })

    const { data: tableData, isLoading, refetch } = useQuery({
        queryKey: ['dictTypes', pageInfo.value.current],
        queryFn: async () => {
            const result = await to<IPageResult<IDictType>>(dictTypeService.getDictList({
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
        isLoading,
        handlePageChange,
        handleFilterChange,
        handleRefresh
    }
}
