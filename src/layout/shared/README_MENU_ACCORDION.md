# 侧边栏菜单手风琴模式使用说明

## 功能说明

侧边栏菜单现在支持**手风琴模式**（Accordion Mode），可以通过参数控制是否同时只能展开一个顶级菜单项。

## 使用方法

### 1. 启用手风琴模式

在使用 `AppMenu` 组件时，传入 `accordion` 属性：

```vue
<AppMenu 
  :collapsed="false" 
  :is-mobile="false"
  :accordion="true"
  @menu-item-click="handleMenuClick"
/>
```

### 2. 禁用手风琴模式（默认）

不传 `accordion` 属性，或显式设置为 `false`：

```vue
<AppMenu 
  :collapsed="false" 
  :is-mobile="false"
  :accordion="false"
  @menu-item-click="handleMenuClick"
/>
```

## 参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `accordion` | `boolean` | `false` | 是否启用手风琴模式 |
| `collapsed` | `boolean` | `false` | 是否折叠侧边栏 |
| `isMobile` | `boolean` | `false` | 是否为移动端 |

## 行为说明

### 手风琴模式 (`accordion: true`)

- ✅ **顶级菜单**：同时只能展开一个，点击其他菜单项会自动收起已展开的
- ✅ **子菜单**：不受限制，可以同时展开多个
- ✅ **路由激活**：当前路由对应的菜单会自动展开，不受手风琴模式影响

### 非手风琴模式 (`accordion: false`)

- ✅ **所有菜单**：可以同时展开多个，互不影响
- ✅ **独立控制**：每个菜单项的展开/收起状态独立管理

## 实现原理

1. **父组件管理**：`AppMenu` 通过 `provide/inject` 向所有子组件提供手风琴控制方法
2. **顶级限制**：只有 `level === 0` 的顶级菜单受手风琴模式控制
3. **子菜单自由**：子菜单（`level > 0`）始终保持独立状态，不受手风琴模式影响
4. **状态同步**：通过 `expandedMenuId` 统一管理当前展开的菜单项 ID

## 示例场景

### 场景 1：后台管理系统（推荐手风琴模式）

```vue
<!-- 适合菜单项较多，需要保持界面整洁的场景 -->
<AppMenu :accordion="true" />
```

### 场景 2：内容管理系统（推荐非手风琴模式）

```vue
<!-- 适合需要同时查看多个菜单分类的场景 -->
<AppMenu :accordion="false" />
```

## 注意事项

1. 手风琴模式只影响**顶级菜单**，子菜单始终可以自由展开
2. 当路由激活某个子菜单时，其父菜单会自动展开，不受手风琴模式限制
3. 折叠状态（`collapsed: true`）下，手风琴模式不生效（因为使用浮动菜单）
