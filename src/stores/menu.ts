import { loginService } from '@/services/modules/login';
import type { MenuOptions } from '@/services/types/menu';
import { to } from '@/utils/result-handler';

const useMenuStore = defineStore('menu', () => {
    const menuList = ref<MenuOptions[]>([]);

    const flatMenList = ref<MenuOptions[]>([]);

    const topMenuList = ref<MenuOptions[]>([]);

    let subMenuList = new Map<string, MenuOptions[]>();

    /**
     * 扁平化菜单
     * @param menuList 菜单列表
     * @returns 扁平化后的菜单列表
     */
    const flattenMenu = (menuList: MenuOptions[]): MenuOptions[] => {
        const result: MenuOptions[] = [];
        const stack: MenuOptions[] = [...menuList];
        while (stack.length > 0) {
            const currentItem = stack.pop()!; // 弹出栈顶元素
            result.push(currentItem); // 将当前项添加到结果数组
            // 将子菜单压入栈中，保持原有顺序
            if (currentItem.children && currentItem.children.length > 0) {
                stack.push(...[...currentItem.children].reverse());
            }
        }
        return result;
    };

    /**
     * 过滤菜单
     * @param menuList 菜单列表
     */
    const filterMenu = (menuList: MenuOptions[]) => {
        const _topMenuList: MenuOptions[] = [];
        const _subMenuList = new Map();

        menuList.forEach((item) => {
            if (item.parentId !== undefined && item.parentId == '-1') {
                const topMenu = { ...item, isChildren: item.children?.length, children: [] };
                _topMenuList.push(topMenu);
                if (item.children && item.children.length > 0) {
                    _subMenuList.set(item.id, item.children);
                }
            }
        });
        subMenuList = _subMenuList;
        topMenuList.value = _topMenuList;
    };

    /**
     * 获取当前登录用户菜单
     * @returns 菜单列表
     */
    const getAuthMenuList = async () => {
        const result = await to<MenuOptions[]>(loginService.getMenuList());
        if (!result.ok) return Promise.reject(result.error);
        console.log('getAuthMenuList', result.value);
        menuList.value = result.value;
        flatMenList.value = flattenMenu(result.value);
        filterMenu(result.value);

        return result.value;
    };

    /**
     * 获取所有菜单
     * @returns 所有菜单列表
     */

    return {
        menuList,
        flatMenList,
        topMenuList,
        subMenuList,
        getAuthMenuList
    };
});

export default useMenuStore;
