/**
 * 菜单类型枚举
 */
export enum MenuType {
  /** 目录 */
  DIRECTORY = 'directory',
  /** 菜单 */
  MENU = 'menu',
  /** 按钮 */
  BUTTON = 'button'
}

/**
 * 菜单状态枚举
 */
export enum MenuStatus {
  /** 启用 */
  ENABLED = 1,
  /** 禁用 */
  DISABLED = 0
}

/**
 * 菜单基础信息
 */
export interface MenuBase {
  /** 菜单ID */
  id: string;
  /** 菜单名称 */
  name: string;
  /** 菜单图标 */
  icon?: string;
  /** 菜单类型 */
  type: MenuType;
  /** 路由路径 */
  path?: string;
  /** 组件路径 */
  component?: string;
  /** 权限标识 */
  permission?: string;
  /** 是否外链 */
  isExternal: boolean;
  /** 外链地址 */
  externalUrl?: string;
  /** 是否显示 */
  visible: boolean;
  /** 排序 */
  sort: number;
  /** 父级菜单ID */
  parentId?: string;
  /** 状态 */
  status: MenuStatus;
  /** 备注 */
  remark?: string;
  /** 创建时间 */
  createTime: string;
  /** 更新时间 */
  updateTime: string;
}

/**
 * 菜单树节点
 */
export interface MenuTreeNode extends MenuBase {
  /** 节点唯一标识（用于TreeSelect组件） */
  key: string;
  /** 子菜单 */
  children?: MenuTreeNode[];
  /** 层级深度 */
  level?: number;
  /** 是否展开 */
  expanded?: boolean;
  /** 是否选中 */
  selected?: boolean;
}

/**
 * 按钮配置接口
 */
export interface ButtonConfig {
  /** 按钮ID */
  id: string | number;
  /** 按钮名称 */
  name: string;
  /** 权限标识 */
  permission: string;
  /** 图标类名 */
  icon: string;
  /** 排序值 */
  sort: number;
}

/**
 * 菜单表单数据
 */
export interface MenuFormData {
  /** 菜单ID（编辑时使用） */
  id?: string;
  /** 菜单名称 */
  name: string;
  /** 菜单图标 */
  icon?: string;
  /** 菜单类型 */
  type: MenuType;
  /** 路由路径 */
  path?: string;
  /** 组件路径 */
  component?: string;
  /** 权限标识 */
  permission?: string;
  /** 是否外链 */
  isExternal: boolean;
  /** 外链地址 */
  externalUrl?: string;
  /** 是否显示 */
  visible: boolean;
  /** 排序 */
  sort: number;
  /** 父级菜单ID */
  parentId?: string;
  /** 状态 */
  status: MenuStatus;
  /** 备注 */
  remark?: string;
  /** 按钮列表 */
  buttons?: ButtonConfig[];
}

/**
 * 菜单查询参数
 */
export interface MenuQueryParams {
  /** 菜单名称 */
  name?: string;
  /** 菜单类型 */
  type?: MenuType;
  /** 状态 */
  status?: MenuStatus;
  /** 是否显示 */
  visible?: boolean;
}

/**
 * 菜单操作类型
 */
export enum MenuAction {
  /** 新增 */
  CREATE = 'create',
  /** 编辑 */
  EDIT = 'edit',
  /** 查看 */
  VIEW = 'view'
}

/**
 * 菜单拖拽数据
 */
export interface MenuDragData {
  /** 拖拽的菜单ID */
  dragId: string;
  /** 目标菜单ID */
  targetId: string;
  /** 拖拽类型：before, after, inner */
  dropType: 'before' | 'after' | 'inner';
}

/**
 * 菜单导出格式
 */
export interface MenuExportData {
  /** 菜单列表 */
  menus: MenuTreeNode[];
  /** 导出时间 */
  exportTime: string;
  /** 版本 */
  version: string;
}

/**
 * 菜单导入结果
 */
export interface MenuImportResult {
  /** 成功数量 */
  successCount: number;
  /** 失败数量 */
  failureCount: number;
  /** 错误信息 */
  errors: string[];
}