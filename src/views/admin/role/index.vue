<template>
    <PageContainer>
        <template #header>
            <div class="flex justify-between items-center">
                <h5 class="m-0">{{ title }}</h5>
                <div>
                    <Button label="新增" icon="pi pi-plus" class="mr-2" @click="openCreateDialog" />
                    <Button label="导出" icon="pi pi-upload" @click="exportRoles" />
                </div>
            </div>
        </template>

        <CustomTable
            :value="roles"
            :columns="tableColumns"
            data-key="id"
            :loading="loading"
            :search-params="searchParams"
            :filter-configs="filterConfigs"
            @update:columns="handleColumnsChange"
            @column-change="handleColumnChange"
            @filter-change="handleFilterChange"
            @refresh="refreshRoles"
        >

            <!-- 角色名称列 -->
            <template #column-name="{ data }">
                <span class="font-medium">{{ data.name }}</span>
            </template>

            <!-- 角色编码列 -->
            <template #column-code="{ data }">
                <div class="flex items-center gap-1">
                    <Tag severity="secondary" :value="data.code"></Tag>
                    <i
class="pi pi-clone cursor-pointer text-gray-500 hover:text-blue-500 transition-colors"
                        title="复制角色编码" @click="copyRoleCode(data.code)"></i>
                </div>
            </template>

            <!-- 角色类型列 -->
            <template #column-type="{ data }">
                <Tag
                    :value="getTypeLabel(data.type)"
                    :severity="getTypeSeverity(data.type)"
                />
            </template>

            <!-- 状态列 -->
            <template #column-status="{ data }">
                <span :class="['status-badge', data.status === 1 ? 'status-active' : 'status-inactive']">
                    {{ data.status === 1 ? '启用' : '禁用' }}
                </span>
            </template>

            <!-- 数据权限列 -->
            <template #column-dataScope="{ data }">
                <span class="text-sm">{{ getDataScopeLabel(data.dataScope) }}</span>
            </template>

            <!-- 用户数列 -->
            <template #column-userCount="{ data }">
                <Badge
                    :value="data.userCount"
                    :severity="data.userCount > 0 ? 'info' : 'secondary'"
                />
            </template>

            <!-- 排序列 -->
            <template #column-sort="{ data }">
                <span class="text-center">{{ data.sort }}</span>
            </template>

            <!-- 创建时间列 -->
            <template #column-createTime="{ data }">
                <span class="text-sm text-500">{{ data.createTime }}</span>
            </template>

            <!-- 操作列 -->
            <template #column-actions="{ data }">
                <div class="flex items-center justify-center">
                    <Button icon="pi pi-pen-to-square" label="编辑" variant="text" @click="openEditDialog(data)" />
                    <Button icon="pi pi-users" label="用户" variant="text" @click="assignUsers(data)" />
                    <Button
icon="pi pi-ellipsis-v" label="更多" variant="text" size="small"
                        @click="(event) => openRowMenu(event, data.id)" />
                    <!-- 每行一个 Menu -->
                    <Menu :ref="(el) => setMenuRef(el, data.id)" :model="getMoreActions(data)" popup />
                </div>
            </template>
        </CustomTable>

        <!-- 角色表单对话框 -->
        <RoleForm
            v-model:visible="roleDialog"
            :form-data="roleForm"
            :submitted="submitted"
            :status-options="statusOptions"
            :type-options="typeOptions"
            :data-scope-options="dataScopeOptions"
            @submit="saveRole"
        />
    </PageContainer>
</template>

<script setup lang="ts">
import { CustomTable, PageContainer } from '@/components';
import type { TableColumns } from '@/composables/useColumns';
import { FilterConfig, SearchParams } from '@/types/search';
import type { Role, RoleType } from '@/types/role';
import { useClipboard } from '@vueuse/core';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import RoleForm from './components/role-form.vue';
import { useRoleManagement } from './composables/use-role-management';

// 页面标题
const title = ref('角色管理');

// 服务实例
const toast = useToast();
const confirm = useConfirm();
const { copy, isSupported } = useClipboard();

// 使用角色管理组合函数
const {
  // 响应式数据
  roles,
  loading,
  roleDialog,
  submitted,
  roleForm,

  // 选项数据
  statusOptions,
  typeOptions,
  dataScopeOptions,

  // 方法
  fetchRoles,
  openCreateDialog,
  openEditDialog,
  saveRole,
  confirmDeleteRole,
  toggleRoleStatus,
  assignPermissions,
  assignUsers,
  exportRoles,
  refreshRoles
} = useRoleManagement();

// 过滤器配置
const filterConfigs: FilterConfig[] = [
    {
        key: 'type',
        label: '角色类型',
        type: 'select',
        options: [
            { label: '全部', value: '' },
            { label: '系统角色', value: 'system' },
            { label: '业务角色', value: 'business' },
            { label: '自定义角色', value: 'custom' }
        ]
    },
    {
        key: 'status',
        label: '状态',
        type: 'select',
        options: [
            { label: '全部', value: '' },
            { label: '启用', value: '1' },
            { label: '禁用', value: '0' }
        ]
    }
];

// 搜索参数
const searchParams = ref<SearchParams>({
    keyword: '',
    filters: {
        type: '',
        status: ''
    }
});

// 处理过滤器变化
const handleFilterChange = (params: SearchParams) => {
    searchParams.value = params;
    console.log(searchParams.value);
};

// 表格列配置
const tableColumns = ref<TableColumns<Role>>([
    {
        key: 'name',
        field: 'name',
        header: '角色名称',
        frozen: true,
        alignFrozen: 'left',
        minWidth: 120
    },
    {
        key: 'code',
        field: 'code',
        header: '角色编码',
         frozen: true,
        alignFrozen: 'left',
        minWidth: 120
    },
    {
        key: 'type',
        field: 'type',
        header: '角色类型',
        minWidth: 100
    },
    {
        key: 'status',
        field: 'status',
        header: '状态',
        minWidth: 80
    },
    {
        key: 'dataScope',
        field: 'dataScope',
        header: '数据权限',
        minWidth: 120
    },
    {
        key: 'userCount',
        field: 'userCount',
        header: '用户数',
        minWidth: 80
    },
    {
        key: 'sort',
        field: 'sort',
        header: '排序',
        minWidth: 80
    },
    {
        key: 'createTime',
        field: 'createTime',
        header: '创建时间',
        minWidth: 140
    },
    {
        key: 'actions',
        header: '操作',
        style: {
            width: '240px',
            overflow: 'visible'
        },
        headerStyle: {
            display: 'flex',
            justifyContent: 'center'
        },
        frozen: true,
        alignFrozen: 'right'
    }
]);

/**
 * 处理列配置变化
 */
function handleColumnsChange(columns: TableColumns<Role>): void {
    tableColumns.value = columns;
}

/**
 * 处理列变化事件
 */
function handleColumnChange(column: any, type: 'visibility' | 'frozen' | 'order'): void {
    console.log('Column changed:', column, type);
}

// 获取角色类型标签
const getTypeLabel = (type: RoleType) => {
    const option = typeOptions.value.find(opt => opt.value === type);
    return option?.label || type;
};

// 获取角色类型严重程度
const getTypeSeverity = (type: RoleType) => {
    switch (type) {
        case 'system':
            return 'danger';
        case 'business':
            return 'success';
        case 'custom':
            return 'info';
        default:
            return 'secondary';
    }
};

// 获取数据权限标签
const getDataScopeLabel = (dataScope: string) => {
    const option = dataScopeOptions.value.find(opt => opt.value === dataScope);
    return option?.label || dataScope;
};

/**
 * 获取更多操作菜单项
 * @param data - 角色数据
 */
const getMoreActions = (data: Role) => {
    return [
        {
            label: '权限配置',
            icon: 'pi pi-cog',
            command: () => assignPermissions(data)
        },
        {
            label: data.status === 1 ? '禁用' : '启用',
            icon: data.status === 1 ? 'pi pi-times' : 'pi pi-check',
            command: () => toggleRoleStatus(data)
        },
        {
            label: '删除',
            icon: 'pi pi-trash',
            command: () => confirmDeleteRole(data),
            disabled: data.isDefault
        }
    ];
};

// 每行菜单的 ref 对象
const menuRefs = ref<Record<number, any>>({});

/**
 * 设置 Menu ref 实例
 */
const setMenuRef = (el: any, id: number) => {
    if (el) {
        menuRefs.value[id] = el;
    }
};

/**
 * 打开对应行的菜单
 */
const openRowMenu = (event: Event, id: number) => {
    menuRefs.value[id]?.toggle(event);
};

/**
 * 复制角色编码
 * @param code - 角色编码
 */
const copyRoleCode = async (code: string) => {
    if (!isSupported) {
        toast.add({
            severity: 'warn',
            summary: '提示',
            detail: '当前浏览器不支持复制功能',
            life: 3000
        });
        return;
    }

    try {
        await copy(code);
        toast.add({
            severity: 'success',
            summary: '成功',
            detail: `已复制角色编码: ${code}`,
            life: 3000
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: '复制失败，请重试',
            life: 3000
        });
    }
};

// 组件挂载时获取数据
onMounted(() => {
  fetchRoles();
});
</script>

<style scoped>


.status-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
}

.status-active {
    background-color: #e3f8e5;
    color: #22c55e;
}

.status-inactive {
    background-color: #fee4e2;
    color: #ef4444;
}
</style>
