
/**
 * 菜单元数据
 */
export interface MetaProps {
    /**
     * 图标
     */
    icon: string;
    /**
     * 标题
     */
    title: string;
    /**
     * 激活菜单
     */
    activeMenu?: string;
    /**
     * 链接
     */
    isLink?: string;
    /**
     * 是否隐藏
     */
    isHide: boolean;
    /**
     * 是否全屏
     */
    isFull: boolean;
    /**
     * 是否固定
     */
    isAffix: boolean;
    /**
     * 是否缓存
     */
    isKeepAlive: boolean;
}

export interface MenuOptions {
    /**
     * 菜单ID
     */
    id: number;
    /**
     * 菜单路径
     */
    path: string;
    /**
     * 菜单名称
     */
    name: string;
    /**
     * 菜单组件
     */
    component: string;
    /**
     * 重定向
     */
    redirect?: string;
    /**
     * 元数据
     */
    meta: MetaProps;
    /**
     * 菜单类型
     */
    menuType?: string;
    /**
     * 子菜单
     */
    children?: MenuOptions[];
    /**
     * 父菜单ID
     */
    parentId?: string;
    /**
     * 父菜单ID（兼容性）
     */
    parentMenuId?: string;
    /**
     * 排序
     */
    sortOrder?: number;
    /**
     * 按钮权限
     */
    buttons?: IButtonItem[];

    [key: string]: any;
}

export interface IButtonItem {
    name: string;
    permission: string;
}

export interface IMenu {
    id?: number;
    parentId: number;
    name: string;
    path?: string;
    component?: string;
    icon?: string;
    isKeepAlive?: string;
    isHide?: string;
    isIframe?: string;
    menuType: number;
    permission?: string;
    sortOrder: number;
    enName?: string;
    buttons?: IButtonItem[];
}

export interface IMenuParams {
    name?: string;
}
