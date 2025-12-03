# 收藏功能测试指南

## 🧪 测试步骤

### 1. 检查组件是否正确加载

打开浏览器开发者工具（F12），在 Console 中执行：

```javascript
// 检查 favorites store 是否存在
import { useFavoritesStore } from '@/stores/favorites'
const favoritesStore = useFavoritesStore()
console.log('Favorites Store:', favoritesStore)
console.log('Favorite Count:', favoritesStore.count)
console.log('Favorite Menus:', favoritesStore.favoriteMenus)
```

### 2. 手动添加测试数据

在浏览器 Console 中执行：

```javascript
// 手动添加一个收藏项测试
localStorage.setItem('app-favorites', JSON.stringify({
  favoriteMenus: [
    {
      id: 1,
      title: "测试菜单",
      path: "/test",
      icon: "Home",
      timestamp: Date.now()
    }
  ]
}))

// 刷新页面查看效果
location.reload()
```

### 3. 检查菜单项是否显示星标

**预期行为**：
- ✅ 鼠标悬停在顶级菜单项上时，右侧应该显示星标按钮
- ✅ 星标按钮应该是透明的（opacity: 0），悬停时变为可见
- ✅ 已收藏的菜单项星标应该是黄色填充

**检查方法**：
1. 打开侧边栏
2. 找到任意顶级菜单项
3. 鼠标悬停
4. 查看右侧是否出现星标

### 4. 测试收藏功能

**步骤**：
1. 找到一个顶级菜单项（如"系统管理"）
2. 鼠标悬停
3. 点击右侧的星标按钮
4. 观察星标是否变为黄色
5. 查看菜单顶部是否出现"常用功能"分组
6. 检查该菜单项是否出现在收藏列表中

### 5. 测试取消收藏

**步骤**：
1. 找到已收藏的菜单项（黄色星标）
2. 点击星标
3. 观察星标是否变为空心
4. 检查收藏列表中是否移除该项

### 6. 检查 localStorage

在浏览器 Console 中执行：

```javascript
// 查看存储的收藏数据
const favorites = localStorage.getItem('app-favorites')
console.log('Stored Favorites:', JSON.parse(favorites))
```

## 🐛 常见问题排查

### 问题 1：星标按钮不显示

**可能原因**：
1. 不是顶级菜单（level !== 0）
2. 菜单项没有 path
3. 是外部链接
4. CSS 样式问题

**排查方法**：
```javascript
// 在 Console 中检查菜单数据
const menuStore = useMenuStore()
console.log('Menu List:', menuStore.menuList)

// 检查第一个菜单项
const firstMenu = menuStore.menuList[0]
console.log('First Menu:', {
  id: firstMenu.id,
  title: firstMenu.meta.title,
  path: firstMenu.path,
  hasPath: !!firstMenu.path,
  isExternal: !!firstMenu.url
})
```

### 问题 2：收藏后没有显示在顶部

**可能原因**：
1. `AppFavoritesMenu` 组件没有正确渲染
2. 收藏数据没有正确保存
3. 组件导入问题

**排查方法**：
```javascript
// 检查收藏 store
const favoritesStore = useFavoritesStore()
console.log('Has Favorites:', favoritesStore.count > 0)
console.log('Favorites:', favoritesStore.favoriteMenus)
```

### 问题 3：点击星标没有反应

**可能原因**：
1. 事件处理函数没有正确绑定
2. Store 方法调用失败
3. 类型转换问题

**排查方法**：
打开 `app-menu-item.vue`，在 `handleToggleFavorite` 方法中添加 console.log：

```typescript
const handleToggleFavorite = (event: Event) => {
    event.stopPropagation();
    console.log('Toggle Favorite Clicked', props.item);
    
    const menuOption = {
        id: props.item.id,
        path: props.item.path || '',
        name: props.item.meta.title,
        meta: props.item.meta,
        params: props.item.params,
        query: props.item.query
    } as any;
    
    console.log('Menu Option:', menuOption);
    const result = favoritesStore.toggleFavorite(menuOption);
    console.log('Toggle Result:', result);
};
```

### 问题 4：刷新后收藏丢失

**可能原因**：
1. localStorage 被清理
2. 持久化配置问题
3. Store 初始化问题

**排查方法**：
```javascript
// 检查 localStorage
console.log('LocalStorage Keys:', Object.keys(localStorage))
console.log('Favorites Key Exists:', localStorage.getItem('app-favorites') !== null)
```

## ✅ 功能验证清单

- [ ] 顶级菜单项悬停时显示星标按钮
- [ ] 点击星标可以添加收藏
- [ ] 已收藏的菜单项星标为黄色
- [ ] 收藏列表显示在菜单顶部
- [ ] "常用功能"标题和数量正确显示
- [ ] 点击收藏列表中的项可以跳转
- [ ] 可以从收藏列表中取消收藏
- [ ] 可以从菜单项中取消收藏
- [ ] 刷新页面后收藏保持
- [ ] 最多只能收藏 10 个
- [ ] 折叠状态下显示收藏图标

## 🔧 手动修复建议

如果功能仍然不生效，尝试以下步骤：

### 1. 清理缓存并重新构建

```bash
# 停止开发服务器
# 删除 node_modules 和 dist
rm -rf node_modules dist

# 重新安装依赖
pnpm install

# 重新启动
pnpm dev:rsbuild
```

### 2. 检查导入路径

确保所有导入路径正确：
- `@/stores/favorites` 
- `./app-favorites-menu.vue`
- `lucide-vue-next`

### 3. 检查 Pinia 配置

确保 `pinia-plugin-persistedstate` 已正确配置。

### 4. 浏览器兼容性

确保浏览器支持：
- localStorage
- ES6+ 语法
- Vue 3 Composition API

## 📞 需要帮助？

如果以上步骤都无法解决问题，请提供：

1. 浏览器 Console 的错误信息
2. Network 面板的请求情况
3. Vue DevTools 中的组件树
4. localStorage 中的数据

这样我可以更准确地定位问题。
