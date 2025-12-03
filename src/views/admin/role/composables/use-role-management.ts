import type { Role, RoleFormData, RoleQueryParams, RoleStatus, RoleType } from '@/types/role';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { reactive, ref } from 'vue';

/**
 * 角色管理组合函数
 */
export function useRoleManagement() {
    // 服务实例
    const toast = useToast();
    const confirm = useConfirm();

    // 响应式数据
    const roles = ref<Role[]>([]);
    const loading = ref(false);
    const roleDialog = ref(false);
    const submitted = ref(false);

    // 表单数据
    const roleForm = reactive<Partial<RoleFormData>>({
        id: undefined,
        name: '',
        code: '',
        type: 'business' as RoleType,
        status: 1 as RoleStatus,
        sort: 0,
        dataScope: 'all',
        remark: '',
        isDefault: false
    });

    // 查询参数
    const queryParams = reactive<RoleQueryParams>({
        name: '',
        code: '',
        type: undefined,
        status: undefined,
        page: 1,
        size: 10
    });

    // 状态选项
    const statusOptions = ref([
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
    ]);

    // 角色类型选项
    const typeOptions = ref([
        { label: '系统角色', value: 'system' as RoleType },
        { label: '业务角色', value: 'business' as RoleType },
        { label: '自定义角色', value: 'custom' as RoleType }
    ]);

    // 数据权限范围选项
    const dataScopeOptions = ref([
        { label: '全部数据权限', value: 'all', description: '可以查看所有数据' },
        { label: '本部门数据权限', value: 'dept', description: '只能查看本部门数据' },
        { label: '本部门及以下数据权限', value: 'dept_and_child', description: '可以查看本部门及下级部门数据' },
        { label: '仅本人数据权限', value: 'self', description: '只能查看自己的数据' },
        { label: '自定义数据权限', value: 'custom', description: '自定义选择部门数据权限' }
    ]);

    /**
     * 初始化模拟数据
     */
    const initMockData = (): Role[] => {
        return [
            {
                id: 1,
                name: '超级管理员',
                code: 'super_admin',
                type: 'system' as RoleType,
                status: 1 as RoleStatus,
                sort: 1,
                dataScope: 'all',
                userCount: 1,
                remark: '超级管理员，拥有系统所有权限',
                createTime: '2023-01-01 00:00:00',
                updateTime: '2023-07-15 10:30:00',
                isDefault: true
            },
            {
                id: 2,
                name: '系统管理员',
                code: 'system_admin',
                type: 'system' as RoleType,
                status: 1 as RoleStatus,
                sort: 2,
                dataScope: 'dept_and_child',
                userCount: 3,
                remark: '系统管理员，负责系统配置和用户管理',
                createTime: '2023-01-02 09:00:00',
                updateTime: '2023-07-14 14:20:00',
                isDefault: false
            },
            {
                id: 3,
                name: '部门经理',
                code: 'dept_manager',
                type: 'business' as RoleType,
                status: 1 as RoleStatus,
                sort: 3,
                dataScope: 'dept',
                userCount: 8,
                remark: '部门经理，管理本部门业务',
                createTime: '2023-01-03 10:15:00',
                updateTime: '2023-07-13 16:45:00',
                isDefault: false
            },
            {
                id: 4,
                name: '普通用户',
                code: 'normal_user',
                type: 'business' as RoleType,
                status: 1 as RoleStatus,
                sort: 4,
                dataScope: 'self',
                userCount: 25,
                remark: '普通用户，只能查看和操作自己的数据',
                createTime: '2023-01-04 11:30:00',
                updateTime: '2023-07-12 09:10:00',
                isDefault: false
            },
            {
                id: 5,
                name: '访客',
                code: 'guest',
                type: 'custom' as RoleType,
                status: 0 as RoleStatus,
                sort: 5,
                dataScope: 'self',
                userCount: 0,
                remark: '访客角色，只读权限',
                createTime: '2023-01-05 14:00:00',
                updateTime: '2023-07-11 11:25:00',
                isDefault: false
            }
        ];
    };

    /**
     * 获取角色列表
     */
    const fetchRoles = async () => {
        try {
            loading.value = true;
            // 模拟API调用
            await new Promise((resolve) => setTimeout(resolve, 500));
            roles.value = initMockData();
        } catch (error) {
            console.error('获取角色列表失败:', error);
            toast.add({
                severity: 'error',
                summary: '错误',
                detail: '获取角色列表失败',
                life: 3000
            });
        } finally {
            loading.value = false;
        }
    };

    /**
     * 打开新增角色对话框
     */
    const openCreateDialog = () => {
        resetForm();
        roleDialog.value = true;
    };

    /**
     * 打开编辑角色对话框
     */
    const openEditDialog = (role: Role) => {
        Object.assign(roleForm, {
            id: role.id,
            name: role.name,
            code: role.code,
            type: role.type,
            status: role.status,
            sort: role.sort,
            dataScope: role.dataScope,
            remark: role.remark,
            isDefault: role.isDefault
        });
        roleDialog.value = true;
    };

    /**
     * 重置表单
     */
    const resetForm = () => {
        Object.assign(roleForm, {
            id: undefined,
            name: '',
            code: '',
            type: 'business' as RoleType,
            status: 1 as RoleStatus,
            sort: 0,
            dataScope: 'all',
            remark: '',
            isDefault: false
        });
        submitted.value = false;
    };

    /**
     * 保存角色
     */
    const saveRole = async (formData = roleForm) => {
        try {
            submitted.value = true;

            // 更新本地表单数据
            Object.assign(roleForm, formData);

            const { name, code } = roleForm;

            if (!name?.trim() || !code?.trim()) {
                return;
            }

            loading.value = true;

            // 模拟API调用
            await new Promise((resolve) => setTimeout(resolve, 500));

            if (roleForm.id) {
                // 更新角色
                const index = roles.value.findIndex((r) => r.id === roleForm.id);
                if (index !== -1) {
                    roles.value[index] = {
                        ...roles.value[index],
                        ...roleForm,
                        updateTime: new Date().toLocaleString()
                    } as Role;
                    toast.add({
                        severity: 'success',
                        summary: '成功',
                        detail: '角色更新成功',
                        life: 3000
                    });
                }
            } else {
                // 新增角色
                const newId = Math.max(0, ...roles.value.map((r) => r.id)) + 1;
                const newRole: Role = {
                    id: newId,
                    name: name,
                    code: code,
                    type: (roleForm.type || 'business') as RoleType,
                    status: roleForm.status ?? 1,
                    sort: roleForm.sort || 0,
                    dataScope: roleForm.dataScope || 'all',
                    userCount: 0,
                    remark: roleForm.remark || '',
                    createTime: new Date().toLocaleString(),
                    isDefault: roleForm.isDefault || false
                };
                roles.value.push(newRole);
                toast.add({
                    severity: 'success',
                    summary: '成功',
                    detail: '角色创建成功',
                    life: 3000
                });
            }

            roleDialog.value = false;
        } catch (error) {
            console.error('保存角色失败:', error);
            toast.add({
                severity: 'error',
                summary: '错误',
                detail: '保存角色失败',
                life: 3000
            });
        } finally {
            loading.value = false;
        }
    };

    /**
     * 确认删除角色
     */
    const confirmDeleteRole = (role: Role) => {
        if (role.isDefault) {
            toast.add({
                severity: 'warn',
                summary: '警告',
                detail: '默认角色不能删除',
                life: 3000
            });
            return;
        }

        if (role.userCount > 0) {
            toast.add({
                severity: 'warn',
                summary: '警告',
                detail: '该角色下还有用户，不能删除',
                life: 3000
            });
            return;
        }

        confirm.require({
            message: `确定要删除角色 "${role.name}" 吗？`,
            header: '确认删除',
            icon: 'pi pi-exclamation-triangle',
            acceptClass: 'p-button-danger',
            accept: () => deleteRole(role),
            reject: () => {}
        });
    };

    /**
     * 删除角色
     */
    const deleteRole = async (role: Role) => {
        try {
            loading.value = true;

            // 模拟API调用
            await new Promise((resolve) => setTimeout(resolve, 300));

            roles.value = roles.value.filter((r) => r.id !== role.id);
            toast.add({
                severity: 'success',
                summary: '成功',
                detail: '角色删除成功',
                life: 3000
            });
        } catch (error) {
            console.error('删除角色失败:', error);
            toast.add({
                severity: 'error',
                summary: '错误',
                detail: '删除角色失败',
                life: 3000
            });
        } finally {
            loading.value = false;
        }
    };

    /**
     * 切换角色状态
     */
    const toggleRoleStatus = async (role: Role) => {
        try {
            loading.value = true;

            // 模拟API调用
            await new Promise((resolve) => setTimeout(resolve, 300));

            const index = roles.value.findIndex((r) => r.id === role.id);
            if (index !== -1) {
                roles.value[index].status = roles.value[index].status === 1 ? 0 : 1;
                roles.value[index].updateTime = new Date().toLocaleString();

                const statusText = roles.value[index].status === 1 ? '启用' : '禁用';
                toast.add({
                    severity: 'success',
                    summary: '成功',
                    detail: `角色已${statusText}`,
                    life: 3000
                });
            }
        } catch (error) {
            console.error('切换角色状态失败:', error);
            toast.add({
                severity: 'error',
                summary: '错误',
                detail: '操作失败',
                life: 3000
            });
        } finally {
            loading.value = false;
        }
    };

    /**
     * 分配权限
     */
    const assignPermissions = (role: Role) => {
        toast.add({
            severity: 'info',
            summary: '提示',
            detail: `正在为角色 "${role.name}" 分配权限`,
            life: 3000
        });
    };

    /**
     * 分配用户
     */
    const assignUsers = (role: Role) => {
        toast.add({
            severity: 'info',
            summary: '提示',
            detail: `正在为角色 "${role.name}" 分配用户`,
            life: 3000
        });
    };

    /**
     * 导出角色数据
     */
    const exportRoles = () => {
        toast.add({
            severity: 'info',
            summary: '提示',
            detail: '角色数据导出功能已触发',
            life: 3000
        });
    };

    /**
     * 刷新角色列表
     */
    const refreshRoles = () => {
        fetchRoles();
    };

    return {
        // 响应式数据
        roles,
        loading,
        roleDialog,
        submitted,
        roleForm,
        queryParams,

        // 选项数据
        statusOptions,
        typeOptions,
        dataScopeOptions,

        // 方法
        fetchRoles,
        openCreateDialog,
        openEditDialog,
        resetForm,
        saveRole,
        confirmDeleteRole,
        deleteRole,
        toggleRoleStatus,
        assignPermissions,
        assignUsers,
        exportRoles,
        refreshRoles
    };
}
