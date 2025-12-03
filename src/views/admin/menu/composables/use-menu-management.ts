import type { MenuFormData, MenuQueryParams, MenuStatus, MenuTreeNode, MenuType } from '@/types/menu';
import { MenuAction } from '@/types/menu';
import { menuApi, type MenuCreateParams, type MenuUpdateParams } from '@/services/modules/menu';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { computed, reactive, ref } from 'vue';

/**
 * 菜单管理组合函数
 */
export function useMenuManagement() {
    const confirm = useConfirm();
    const toast = useToast();

    // 状态管理
    const loading = ref(false);
    const menuList = ref<MenuTreeNode[]>([]);
    const selectedMenus = ref<MenuTreeNode[]>([]);
    const expandedKeys = ref<Record<string, boolean>>({});

    // 弹窗状态
    const dialogVisible = ref(false);
    const dialogAction = ref<MenuAction>(MenuAction.CREATE);
    const dialogTitle = computed(() => {
        const titleMap = {
            [MenuAction.CREATE]: '新增菜单',
            [MenuAction.EDIT]: '编辑菜单',
            [MenuAction.VIEW]: '查看菜单'
        };
        return titleMap[dialogAction.value];
    });

    // 表单数据
    const formData = reactive<MenuFormData>({
        name: '',
        icon: '',
        type: 'menu' as MenuType,
        path: '',
        component: '',
        permission: '',
        isExternal: false,
        externalUrl: '',
        visible: true,
        sort: 0,
        parentId: '',
        status: 1 as MenuStatus,
        remark: '',
        buttons: []
    });

    // 查询参数
    const queryParams = reactive<MenuQueryParams>({
        name: '',
        type: undefined,
        status: undefined,
        visible: undefined
    });

    /**
     * 模拟菜单数据
     */
    const mockMenuData = (): MenuTreeNode[] => {
        return [
            {
                id: '1',
                key: '1',
                name: '系统管理',
                icon: 'pi pi-cog',
                type: 'directory' as MenuType,
                path: '/system',
                component: '',
                permission: 'system',
                isExternal: false,
                visible: true,
                sort: 1,
                status: 1 as MenuStatus,
                createTime: '2024-01-01 10:00:00',
                updateTime: '2024-01-01 10:00:00',
                children: [
                    {
                        id: '1-1',
                        key: '1-1',
                        name: '用户管理',
                        icon: 'pi pi-users',
                        type: 'menu' as MenuType,
                        path: '/system/user',
                        component: 'views/system/user/CustomTableSettings.vue',
                        permission: 'system:user:list',
                        isExternal: false,
                        visible: true,
                        sort: 1,
                        parentId: '1',
                        status: 1 as MenuStatus,
                        createTime: '2024-01-01 10:00:00',
                        updateTime: '2024-01-01 10:00:00',
                        children: [
                            {
                                id: '1-1-1',
                                key: '1-1-1',
                                name: '新增用户',
                                icon: '',
                                type: 'button' as MenuType,
                                permission: 'system:user:add',
                                isExternal: false,
                                visible: true,
                                sort: 1,
                                parentId: '1-1',
                                status: 1 as MenuStatus,
                                createTime: '2024-01-01 10:00:00',
                                updateTime: '2024-01-01 10:00:00'
                            },
                            {
                                id: '1-1-2',
                                key: '1-1-2',
                                name: '编辑用户',
                                icon: '',
                                type: 'button' as MenuType,
                                permission: 'system:user:edit',
                                isExternal: false,
                                visible: true,
                                sort: 2,
                                parentId: '1-1',
                                status: 1 as MenuStatus,
                                createTime: '2024-01-01 10:00:00',
                                updateTime: '2024-01-01 10:00:00'
                            },
                            {
                                id: '1-1-3',
                                key: '1-1-3',
                                name: '删除用户',
                                icon: '',
                                type: 'button' as MenuType,
                                permission: 'system:user:delete',
                                isExternal: false,
                                visible: true,
                                sort: 3,
                                parentId: '1-1',
                                status: 1 as MenuStatus,
                                createTime: '2024-01-01 10:00:00',
                                updateTime: '2024-01-01 10:00:00'
                            }
                        ]
                    },
                    {
                        id: '1-2',
                        key: '1-2',
                        name: '角色管理',
                        icon: 'pi pi-shield',
                        type: 'menu' as MenuType,
                        path: '/system/role',
                        component: 'views/system/role/CustomTableSettings.vue',
                        permission: 'system:role:list',
                        isExternal: false,
                        visible: true,
                        sort: 2,
                        parentId: '1',
                        status: 1 as MenuStatus,
                        createTime: '2024-01-01 10:00:00',
                        updateTime: '2024-01-01 10:00:00'
                    }
                ]
            },
            {
                id: '2',
                key: '2',
                name: '权限管理',
                icon: 'pi pi-lock',
                type: 'directory' as MenuType,
                path: '/permission',
                component: '',
                permission: 'permission',
                isExternal: false,
                visible: true,
                sort: 2,
                status: 1 as MenuStatus,
                createTime: '2024-01-01 10:00:00',
                updateTime: '2024-01-01 10:00:00',
                children: [
                    {
                        id: '2-1',
                        key: '2-1',
                        name: '菜单管理',
                        icon: 'pi pi-list',
                        type: 'menu' as MenuType,
                        path: '/permission/menus',
                        component: 'views/permission/menus/CustomTableSettings.vue',
                        permission: 'permission:menu:list',
                        isExternal: false,
                        visible: true,
                        sort: 1,
                        parentId: '2',
                        status: 1 as MenuStatus,
                        createTime: '2024-01-01 10:00:00',
                        updateTime: '2024-01-01 10:00:00'
                    }
                ]
            },
            {
                id: '3',
                key: '3',
                name: '外部链接',
                icon: 'pi pi-external-link',
                type: 'menu' as MenuType,
                path: '',
                component: '',
                permission: '',
                isExternal: true,
                externalUrl: 'https://www.baidu.com',
                visible: true,
                sort: 3,
                status: 1 as MenuStatus,
                createTime: '2024-01-01 10:00:00',
                updateTime: '2024-01-01 10:00:00'
            }
        ];
    };

    /**
     * 获取菜单列表
     */
    const fetchMenuList = async () => {
        loading.value = true;
        try {
            const response = await menuApi.getMenuTree(queryParams);
            menuList.value = response || [];

            // 默认展开第一级
            expandedKeys.value = {};
            menuList.value.forEach((menu) => {
                if (menu.children && menu.children.length > 0) {
                    expandedKeys.value[menu.id] = true;
                }
            });
        } catch (error) {
            console.error('获取菜单列表失败:', error);
            // 如果API调用失败，使用模拟数据作为后备
            menuList.value = mockMenuData();
            expandedKeys.value = {};
            menuList.value.forEach((menu) => {
                if (menu.children && menu.children.length > 0) {
                    expandedKeys.value[menu.id] = true;
                }
            });

            toast.add({
                severity: 'error',
                summary: '错误',
                detail: '获取菜单列表失败，已加载模拟数据',
                life: 3000
            });
        } finally {
            loading.value = false;
        }
    };

    /**
     * 搜索菜单
     */
    const searchMenus = async () => {
        loading.value = true;
        try {
            // 模拟搜索逻辑
            await new Promise((resolve) => setTimeout(resolve, 300));
            let filteredMenus = mockMenuData();

            // 根据查询参数过滤
            if (queryParams.name) {
                filteredMenus = filterMenusByName(filteredMenus, queryParams.name);
            }
            if (queryParams.type) {
                filteredMenus = filterMenusByType(filteredMenus, queryParams.type);
            }
            if (queryParams.status !== undefined) {
                filteredMenus = filterMenusByStatus(filteredMenus, queryParams.status);
            }
            if (queryParams.visible !== undefined) {
                filteredMenus = filterMenusByVisible(filteredMenus, queryParams.visible);
            }

            menuList.value = filteredMenus;
        } catch (error) {
            console.error('搜索菜单失败:', error);
        } finally {
            loading.value = false;
        }
    };

    /**
     * 根据名称过滤菜单
     */
    const filterMenusByName = (menus: MenuTreeNode[], name: string): MenuTreeNode[] => {
        const result: MenuTreeNode[] = [];

        for (const menu of menus) {
            if (menu.name.includes(name)) {
                result.push({ ...menu });
            } else if (menu.children) {
                const filteredChildren = filterMenusByName(menu.children, name);
                if (filteredChildren.length > 0) {
                    result.push({ ...menu, children: filteredChildren });
                }
            }
        }

        return result;
    };

    /**
     * 根据类型过滤菜单
     */
    const filterMenusByType = (menus: MenuTreeNode[], type: MenuType): MenuTreeNode[] => {
        const result: MenuTreeNode[] = [];

        for (const menu of menus) {
            if (menu.type === type) {
                result.push({ ...menu });
            } else if (menu.children) {
                const filteredChildren = filterMenusByType(menu.children, type);
                if (filteredChildren.length > 0) {
                    result.push({ ...menu, children: filteredChildren });
                }
            }
        }

        return result;
    };

    /**
     * 根据状态过滤菜单
     */
    const filterMenusByStatus = (menus: MenuTreeNode[], status: MenuStatus): MenuTreeNode[] => {
        const result: MenuTreeNode[] = [];

        for (const menu of menus) {
            if (menu.status === status) {
                result.push({ ...menu });
            } else if (menu.children) {
                const filteredChildren = filterMenusByStatus(menu.children, status);
                if (filteredChildren.length > 0) {
                    result.push({ ...menu, children: filteredChildren });
                }
            }
        }

        return result;
    };

    /**
     * 根据显示状态过滤菜单
     */
    const filterMenusByVisible = (menus: MenuTreeNode[], visible: boolean): MenuTreeNode[] => {
        const result: MenuTreeNode[] = [];

        for (const menu of menus) {
            if (menu.visible === visible) {
                result.push({ ...menu });
            } else if (menu.children) {
                const filteredChildren = filterMenusByVisible(menu.children, visible);
                if (filteredChildren.length > 0) {
                    result.push({ ...menu, children: filteredChildren });
                }
            }
        }

        return result;
    };

    /**
     * 重置表单
     */
    const resetForm = () => {
        Object.assign(formData, {
            id: undefined,
            name: '',
            icon: '',
            type: 'menu' as MenuType,
            path: '',
            component: '',
            permission: '',
            isExternal: false,
            externalUrl: '',
            visible: true,
            sort: 0,
            parentId: '',
            status: 1 as MenuStatus,
            remark: '',
            buttons: []
        });
    };

    /**
     * 打开新增菜单弹窗
     */
    const openCreateDialog = (parentId?: string) => {
        resetForm();
        if (parentId) {
            formData.parentId = parentId;
        }
        dialogAction.value = MenuAction.CREATE;
        dialogVisible.value = true;
    };

    /**
     * 打开编辑菜单弹窗
     */
    const openEditDialog = (menu: MenuTreeNode) => {
        Object.assign(formData, {
            id: menu.id,
            name: menu.name,
            icon: menu.icon || '',
            type: menu.type,
            path: menu.path || '',
            component: menu.component || '',
            permission: menu.permission || '',
            isExternal: menu.isExternal,
            externalUrl: menu.externalUrl || '',
            visible: menu.visible,
            sort: menu.sort,
            parentId: menu.parentId || '',
            status: menu.status,
            remark: menu.remark || '',
            buttons: (menu as any).buttons || []
        });
        dialogAction.value = MenuAction.EDIT;
        dialogVisible.value = true;
    };

    /**
     * 保存菜单
     */
    const saveMenu = async () => {
        try {
            loading.value = true;

            // 准备API请求数据
            const menuData = {
                name: formData.name,
                icon: formData.icon,
                type: formData.type,
                path: formData.path,
                component: formData.component,
                permission: formData.permission,
                isExternal: formData.isExternal,
                externalUrl: formData.externalUrl,
                visible: formData.visible,
                sort: formData.sort,
                parentId: formData.parentId,
                status: formData.status,
                remark: formData.remark,
                buttons: formData.buttons
            };

            if (dialogAction.value === MenuAction.CREATE) {
                // 创建菜单
                await menuApi.createMenu(menuData as MenuCreateParams);
                toast.add({
                    severity: 'success',
                    summary: '成功',
                    detail: '菜单创建成功',
                    life: 3000
                });
            } else {
                // 更新菜单
                await menuApi.updateMenu({ ...menuData, id: formData.id } as MenuUpdateParams);
                toast.add({
                    severity: 'success',
                    summary: '成功',
                    detail: '菜单更新成功',
                    life: 3000
                });
            }

            dialogVisible.value = false;
            await fetchMenuList();
        } catch (error) {
            console.error('保存菜单失败:', error);
            toast.add({
                severity: 'error',
                summary: '错误',
                detail: '保存菜单失败，请检查网络连接或稍后重试',
                life: 3000
            });
        } finally {
            loading.value = false;
        }
    };

    /**
     * 删除菜单
     */
    const deleteMenu = (menu: MenuTreeNode) => {
        confirm.require({
            message: `确定要删除菜单"${menu.name}"吗？`,
            header: '删除确认',
            icon: 'pi pi-exclamation-triangle',
            rejectClass: 'p-button-secondary p-button-outlined',
            rejectLabel: '取消',
            acceptLabel: '确定',
            accept: async () => {
                try {
                    // 检查是否有子菜单
                    if (menu.children && menu.children.length > 0) {
                        toast.add({
                            severity: 'warn',
                            summary: '警告',
                            detail: '该菜单下存在子菜单，请先删除子菜单',
                            life: 3000
                        });
                        return;
                    }

                    // 调用删除菜单API
                    await menuApi.deleteMenu(menu.id);

                    toast.add({
                        severity: 'success',
                        summary: '成功',
                        detail: '菜单删除成功',
                        life: 3000
                    });

                    await fetchMenuList();
                } catch (error) {
                    console.error('删除菜单失败:', error);
                    toast.add({
                        severity: 'error',
                        summary: '错误',
                        detail: '删除菜单失败',
                        life: 3000
                    });
                }
            }
        });
    };

    /**
     * 批量删除菜单
     */
    const batchDeleteMenus = () => {
        if (selectedMenus.value.length === 0) {
            toast.add({
                severity: 'warn',
                summary: '警告',
                detail: '请选择要删除的菜单',
                life: 3000
            });
            return;
        }

        confirm.require({
            message: `确定要删除选中的 ${selectedMenus.value.length} 个菜单吗？`,
            header: '批量删除确认',
            icon: 'pi pi-exclamation-triangle',
            rejectClass: 'p-button-secondary p-button-outlined',
            rejectLabel: '取消',
            acceptLabel: '确定',
            accept: async () => {
                try {
                    // 获取选中菜单的ID数组
                    const menuIds = selectedMenus.value.map((menu) => menu.id);

                    // 调用批量删除菜单API
                    await menuApi.batchDeleteMenus(menuIds);

                    toast.add({
                        severity: 'success',
                        summary: '成功',
                        detail: `成功删除 ${selectedMenus.value.length} 个菜单`,
                        life: 3000
                    });

                    selectedMenus.value = [];
                    await fetchMenuList();
                } catch (error) {
                    console.error('批量删除菜单失败:', error);
                    toast.add({
                        severity: 'error',
                        summary: '错误',
                        detail: '批量删除菜单失败',
                        life: 3000
                    });
                }
            }
        });
    };

    /**
     * 导出菜单
     */
    const exportMenus = () => {
        try {
            const exportData = {
                menus: menuList.value,
                exportTime: new Date().toISOString(),
                version: '1.0.0'
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json'
            });

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `menus_${new Date().getTime()}.json`;
            link.click();

            URL.revokeObjectURL(url);

            toast.add({
                severity: 'success',
                summary: '成功',
                detail: '菜单导出成功',
                life: 3000
            });
        } catch (error) {
            console.error('导出菜单失败:', error);
            toast.add({
                severity: 'error',
                summary: '错误',
                detail: '导出菜单失败',
                life: 3000
            });
        }
    };

    /**
     * 刷新菜单列表
     */
    const refreshMenus = () => {
        selectedMenus.value = [];
        fetchMenuList();
    };

    /**
     * 获取菜单树选项（用于父级菜单选择）
     */
    const getMenuTreeOptions = (excludeId?: string): MenuTreeNode[] => {
        // 优先使用本地数据进行过滤，避免重复API调用
        const filterMenu = (menus: MenuTreeNode[]): MenuTreeNode[] => {
            return menus
                .filter((menu) => menu.id !== excludeId && menu.type !== 'button')
                .map((menu) => ({
                    ...menu,
                    children: menu.children ? filterMenu(menu.children) : undefined
                }));
        };

        return filterMenu(menuList.value);
    };

    /**
     * 获取父级菜单选项（API版本）
     */
    const fetchParentMenuOptions = async (excludeId?: string): Promise<MenuTreeNode[]> => {
        try {
            const response = await menuApi.getParentMenuOptions(excludeId);
            return response || [];
        } catch (error) {
            console.error('获取父级菜单选项失败:', error);
            // 如果API调用失败，使用本地数据
            return getMenuTreeOptions(excludeId);
        }
    };

    return {
        // 状态
        loading,
        menuList,
        selectedMenus,
        expandedKeys,

        // 弹窗状态
        dialogVisible,
        dialogAction,
        dialogTitle,

        // 表单数据
        formData,
        queryParams,

        // 方法
        fetchMenuList,
        searchMenus,
        openCreateDialog,
        openEditDialog,
        saveMenu,
        deleteMenu,
        batchDeleteMenus,
        exportMenus,
        refreshMenus,
        getMenuTreeOptions,
        fetchParentMenuOptions,
        resetForm,
        toast
    };
}
