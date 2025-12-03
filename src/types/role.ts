/**
 * 角色相关类型定义
 */

/**
 * 角色状态枚举
 */
export enum RoleStatus {
    /** 启用 */
    ACTIVE = 1,
    /** 禁用 */
    INACTIVE = 0
}

/**
 * 角色类型枚举
 */
export enum RoleType {
    /** 系统角色 */
    SYSTEM = 'system',
    /** 业务角色 */
    BUSINESS = 'business',
    /** 自定义角色 */
    CUSTOM = 'custom'
}

/**
 * 角色数据接口
 */
export interface Role {
    /** 角色ID */
    id: number;
    /** 角色名称 */
    name: string;
    /** 角色编码 */
    code: string;
    /** 角色类型 */
    type: RoleType;
    /** 角色状态 */
    status: RoleStatus;
    /** 排序 */
    sort: number;
    /** 数据权限范围 */
    dataScope: string;
    /** 用户数量 */
    userCount: number;
    /** 备注 */
    remark?: string;
    /** 创建时间 */
    createTime: string;
    /** 更新时间 */
    updateTime?: string;
    /** 是否为默认角色 */
    isDefault: boolean;
}

/**
 * 角色表单数据接口
 */
export interface RoleFormData {
    /** 角色ID */
    id?: number;
    /** 角色名称 */
    name: string;
    /** 角色编码 */
    code: string;
    /** 角色类型 */
    type: RoleType;
    /** 角色状态 */
    status: RoleStatus;
    /** 排序 */
    sort: number;
    /** 数据权限范围 */
    dataScope: string;
    /** 备注 */
    remark?: string;
    /** 是否为默认角色 */
    isDefault: boolean;
    /** 自定义部门权限 */
    customDepts?: string[];
    /** 自定义用户权限 */
    customUsers?: string[];
}

/**
 * 角色查询参数接口
 */
export interface RoleQueryParams {
    /** 角色名称 */
    name?: string;
    /** 角色编码 */
    code?: string;
    /** 角色类型 */
    type?: RoleType;
    /** 角色状态 */
    status?: RoleStatus;
    /** 页码 */
    page?: number;
    /** 每页数量 */
    size?: number;
}

/**
 * 数据权限范围选项
 */
export interface DataScopeOption {
    /** 标签 */
    label: string;
    /** 值 */
    value: string;
    /** 描述 */
    description?: string;
}

/**
 * 角色权限分配接口
 */
export interface RolePermission {
    /** 角色ID */
    roleId: number;
    /** 菜单权限ID列表 */
    menuIds: number[];
    /** 数据权限范围 */
    dataScope: string;
    /** 部门权限ID列表（当数据权限为自定义时） */
    deptIds?: number[];
}
