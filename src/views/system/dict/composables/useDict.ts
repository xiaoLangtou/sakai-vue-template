import type { TableColumns } from '@/composables';
import { usePrimeConfirm } from '@/composables/usePrimeConfirm';

import globalToast from '@/services/core/toast';
import { dictTypeService } from '@/services/modules/dict-type';
import type { IDictType, IDictTypeQuery } from '@/services/types/dict';
import type { IPageResult } from '@/services/types/types';
import type { FilterConfig, SearchParams } from '@/types/search';
import type { TTableConfig } from '@/types/table';
import { to } from '@/utils/result-handler';
import type DictTypeForm from '@/views/system/dict/component/dict-type-form.vue';
import { useQuery } from '@tanstack/vue-query';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import type { MenuItem } from 'primevue/menuitem';
import { computed, ref } from 'vue';

export const useDict = () => {
    const { confirmDelete } = usePrimeConfirm();
    const tableColumns = ref<TableColumns<IDictType>>([
        {
            field: 'dictName',
            header: '字典名称',
            frozen: true,
            alignFrozen: 'left'
        },
        {
            field: 'dictCode',
            header: '字典编码'
        },
        {
            field: 'systemFlag',
            header: '字典类型'
        },
        {
            field: 'status',
            header: '状态'
        },
        {
            field: 'dataCount',
            header: '字典项数量'
        },
        {
            field: 'dictDesc',
            header: '字典描述',

            width: 200,
            ellipsis: true, // 启用文本省略号
            showTooltip: true, // 显示tooltip
            tooltipOptions: {
                position: 'bottom', // tooltip位置
                showDelay: 500 // 显示延迟
            }
        },
        {
            key: 'createTime',
            field: 'createTime',
            header: '创建时间'
        },
        {
            key: 'createBy',
            field: 'createBy',
            header: '创建人'
        }
    ]);

    const dictTypeForm = useTemplateRef<InstanceType<typeof DictTypeForm>>('dictTypeForm');

    const filterConfigs = ref<FilterConfig[]>([
        {
            key: 'dictCode',
            label: '字典编码',
            type: 'input'
        },
        {
            key: 'systemFlag',
            label: '字典类型',
            type: 'select',
            options: [
                {
                    label: '业务字典',
                    value: 'BUSINESS'
                },
                {
                    label: '系统字典',
                    value: 'SYSTEM'
                }
            ]
        },
        {
            key: 'status',
            label: '状态',
            type: 'select',
            options: [
                {
                    label: '启用',
                    value: '1'
                },
                {
                    label: '禁用',
                    value: '0'
                }
            ]
        }
    ]);

    const searchParams = ref<SearchParams<IDictTypeQuery>>({
        keyword: '',
        filters: {
            dictCode: '',
            dictType: '',
            status: '',
            systemFlag: ''
        }
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
        queryKey: ['dictTypes', pageInfo.value.current],
        queryFn: async () => {
            const result = await to<IPageResult<IDictType>>(
                dictTypeService.getDictList({
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
        }
    });

    const handlePageChange = (page: any) => {
        pageInfo.value.current = page.page + 1; // PrimeVue 分页从 0 开始
        pageInfo.value.size = page.rows;
        refetch();
    };

    const handleFilterChange = (params: SearchParams) => {
        searchParams.value = params;
        pageInfo.value.current = 1; // 重置到第一页
        console.log(tableConfig.value);
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
        };
        // 清理菜单项缓存
        menuItemsCache.value.clear();
        refetch();
    };
    const deleteDictType = async (dictType: IDictType) => {
        if (!dictType.id) return globalToast.error('字典类型ID不能为空');

        // 调用删除接口
        const result = await to(dictTypeService.removeDictType(dictType.id));
        if (result.ok) {
            globalToast.success('删除成功');
            handleRefresh();
        }
    };

    // 每行菜单的 ref 对象
    const menuRef = useTemplateRef<typeof Menu>('menu');
    const activeDict = ref<IDictType>();
    /**
     * 打开对应行的菜单
     */
    const openRowMenu = async (event: Event, dictType: IDictType) => {
        activeDict.value = dictType;
        await nextTick();
        menuRef.value?.toggle(event);
    };
    /**
     * 缓存菜单项，避免重复创建
     */
    const menuItemsCache = ref<Map<string | number, MenuItem[]>>(new Map());

    /**
     * 获取更多操作菜单项
     * @param data - 字典类型数据
     */
    const getMoreActions = (): MenuItem[] => {
        if (!activeDict.value?.id) return [];

        // 检查缓存
        if (menuItemsCache.value.has(activeDict.value?.id)) {
            return menuItemsCache.value.get(activeDict.value?.id)!;
        }

        // 创建菜单项
        const menuItems: MenuItem[] = [
            {
                label: '字典项',
                icon: 'pi pi-list'
            },
            {
                label: '删除',
                icon: 'pi pi-trash',
                disabled: activeDict.value?.systemFlag === 'SYSTEM',
                command: async () => {
                    console.log('删除字典类型', activeDict.value);
                    await confirmDelete({
                        message: `确定要删除字典类型 "${activeDict.value?.dictName}(${activeDict.value?.dictCode})" 吗？`,
                        header: '确认删除',
                        accept: () => deleteDictType(activeDict.value!)
                    });
                }
            }
        ];

        // 缓存菜单项
        menuItemsCache.value.set(activeDict.value?.id!, menuItems);
        return menuItems;
    };

    const editDictType = (type: IDictType) => {
        dictTypeForm.value?.openDrawer(type);
    };
    /**
     * 表格配置对象
     * 使用 computed 确保响应式更新
     */
    const tableConfig = computed<TTableConfig<IDictType>>(() => ({
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
            frozen: true,
            alignFrozen: 'right',
            width: 180,
            render: (item: IDictType) => {
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
                            onClick: (event: Event) => openRowMenu(event, item)
                        })
                    ]
                );
            }
        },
        // 额外配置
        searchParams: searchParams.value,
        filterConfigs: filterConfigs.value,
        data: tableData.value ?? []
    }));

    return {
        dictTypeForm,
        tableConfig,
        handlePageChange,
        handleFilterChange,
        handleRefresh,
        getMoreActions
    };
};
