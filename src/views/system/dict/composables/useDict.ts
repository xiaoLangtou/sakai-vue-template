import type { TableColumns } from "@/composables";
import { usePrimeConfirm } from "@/composables/usePrimeConfirm";
import router from "@/router";
import globalToast from "@/services/core/toast";
import { dictTypeService } from "@/services/modules/dict-type";
import type { IDictType, IDictTypeQuery } from "@/services/types/dict";
import type { IPageResult } from "@/services/types/types";
import type { FilterConfig, SearchParams } from "@/types/search";
import type { ConfigurableTableProps } from "@/types/table";
import { to } from "@/utils/result-handler";
import type DictTypeForm from "@/views/system/dict/component/dict-type-form.vue";
import { useQuery } from "@tanstack/vue-query";
import Button from "primevue/button";
import Menu from "primevue/menu";
import type { MenuItem } from "primevue/menuitem";
import { computed, ref } from "vue";

type TableConfig = {
    columns: TableColumns<IDictType>;
    filterConfigs: FilterConfig[];
    searchParams: SearchParams<IDictTypeQuery>;
} & ConfigurableTableProps<IDictType>

export const useDict = () => {
    const { confirmDelete } = usePrimeConfirm();
    const tableColumns = ref<TableColumns<IDictType>>([
        {

            field: 'dictName',
            header: '字典名称',
            frozen: true,
            alignFrozen: 'left',

        },
        {

            field: 'dictCode',
            header: '字典编码',

        },
        {

            field: 'systemFlag',
            header: '字典类型',
        },
        {

            field: 'status',
            header: '状态',

        },
        {

            field: 'dataCount',
            header: '字典项数量',

        },
        {

            field: 'dictDesc',
            header: '字典描述',

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

        },
        {
            key: 'createBy',
            field: 'createBy',
            header: '创建人',
        },
    ]);

    const dictTypeForm = useTemplateRef<InstanceType<typeof DictTypeForm>>("dictTypeForm")

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
        console.log(tableConfig.value)
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
    const deleteDictType = async (dictType: IDictType) => {
        if (!dictType.id) return globalToast.error('字典类型ID不能为空');

        // 调用删除接口
        const result = await to(dictTypeService.removeDictType(dictType.id));
        if (result.ok) {
            globalToast.success('删除成功');
            handleRefresh();
        }
    };
    // 查看字典项
    const viewDictItems = (type: IDictType) => {
        router.push(`/system/dict-items/${type.id}`);
    };

    /**
     * 打开对应行的菜单
     */
    const openRowMenu = (event: Event, id: number | string | undefined) => {
        if (!id) return;
        menuRefs.value[id]?.toggle(event);
    };
    /**
    * 获取更多操作菜单项
    * @param data - 字典类型数据
    */
    const getMoreActions = (data: IDictType): MenuItem[] => {
        return [
            {
                label: data.status ? '停用' : '启用',
                icon: data.status ? 'pi pi-times' : 'pi pi-check',
                disabled: data.systemFlag === 'SYSTEM',
                // command: () => toggleTypeStatus(data)
            },
            {
                label: '删除',
                icon: 'pi pi-trash',
                disabled: data.systemFlag === 'SYSTEM',
                command: () => {
                    confirmDelete({
                        message: `确定要删除字典类型 "${data.dictName}(${data.dictCode})" 吗？`,
                        header: '确认删除',
                        accept: () => deleteDictType(data)
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
    const editDictType = (type: IDictType) => {
        dictTypeForm.value?.openDrawer(type)
    };
    /**
     * 表格配置对象
     * 使用 computed 确保响应式更新
     */
    const tableConfig = computed<TableConfig>(() => ({
        // 表格基本配置
        dataKey: 'id',
        loading: isLoading.value,
        // 分页配置
        rows: pageInfo.value.size,
        totalRecords: pageInfo.value.total,
        current: pageInfo.value.current,
        // 列配置
        columns: tableColumns.value,
        actions: {
            frozen: true, alignFrozen: 'right', width: 200, render: (item: IDictType) => {
                return h('div', {
                    class: 'flex justify-center items-center'
                }, [
                    h(Button, {
                        icon: 'pi pi-pen-to-square',
                        label: '编辑',
                        variant: 'text',
                        onClick: () => editDictType(item)
                    }),
                    h(Button, {
                        icon: 'pi pi-list',
                        label: '字典项',
                        variant: 'text',
                        onClick: () => viewDictItems(item)
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

                ])
            }
        },
        // 额外配置
        searchParams: searchParams.value,
        filterConfigs: filterConfigs.value,
        data: tableData.value ?? [],
    }))

    return {
        dictTypeForm,
        tableConfig,
        viewDictItems,
        handlePageChange,
        handleFilterChange,
        handleRefresh
    }
}
