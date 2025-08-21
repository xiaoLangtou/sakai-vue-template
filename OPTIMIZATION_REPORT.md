# Sakai Vue 项目优化建议报告

## 📊 代码质量分析结果

### 1. 死代码识别

#### 🔍 已识别的未使用代码

**未使用的依赖项：**
- `date-fns` - package.json中存在但代码中未使用，项目已使用dayjs
- `preline` - package.json中存在但代码中未使用
- `vue3-json-viewer` - package.json中存在但代码中未使用

**未使用的服务文件：**
- `src/views/dashboard/service/NodeService.ts` - 431行代码，仅提供静态数据，无实际调用
- `src/views/dashboard/service/CountryService.ts` - 252行代码，仅提供静态数据，无实际调用
- `src/views/dashboard/service/PhotoService.ts` - 100行代码，仅提供静态数据，无实际调用

**未使用的类型定义：**
- `src/types/table.ts` 中的复杂接口如 `ITableColumn`、`ITableSettings`、`ITableEvents` 等未被实际使用

### 2. 长期未修改模块分析

**3个月内仅有1次修改的dashboard服务模块：**
- 所有dashboard service文件都是在同一次提交中创建，之后未再修改
- 这些文件包含大量静态数据，可能是示例代码或占位符

## 🔗 依赖关系分析

### 高频依赖模块（可能存在过度耦合）

1. **@/components** (19次导入) - 组件库使用频繁，符合预期
2. **@/types/search** (10次导入) - 搜索相关类型被广泛使用
3. **@/utils/result-handler** (9次导入) - 结果处理工具使用频繁
4. **@/stores/layout** (8次导入) - 布局状态管理耦合度较高
5. **@/stores** (7次导入) - 状态管理依赖合理

### 潜在耦合问题
- `@/stores/layout` 被多个组件直接依赖，可考虑通过props传递减少耦合
- `@/utils/result-handler` 使用频繁，建议统一错误处理机制

## 🏗️ 结构优化建议

### 1. 文件结构重构

#### 当前结构问题
- dashboard服务文件混杂在views目录下
- 部分组件功能重叠（如search相关组件分散）
- 类型定义过于集中在单个文件中

#### 建议的新结构（符合Vue 3最佳实践）

```
src/
├── assets/                 # 静态资源（图片、字体、样式等）
│   ├── images/
│   ├── icons/
│   └── styles/
├── components/             # 全局通用组件
│   ├── ui/                # 基础UI组件
│   ├── business/          # 业务组件

│   └── layout/            # 布局相关组件
├── composables/           # 组合式函数（Vue 3 Hooks）
│   └── index.ts
├── layouts/               # 页面布局模板
├── views/                 # 页面视图（按功能模块组织）
├── router/                # 路由配置
│   ├── index.ts
│   ├── routes.ts
│   └── guards.ts
├── stores/                # Pinia状态管理
│   ├── auth.ts
│   ├── user.ts
│   ├── layout.ts
│   └── index.ts
├── services/              # API服务层
│   ├── api/               # API接口定义
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   └── system.ts
│   ├── http.ts            # HTTP客户端配置
│   └── types.ts           # API类型定义
├── types/                 # TypeScript类型定义
│   ├── api.ts             # API相关类型
│   ├── user.ts            # 用户相关类型
│   ├── common.ts          # 通用类型
│   └── index.ts
├── utils/                 # 工具函数
│   └── index.ts
├── constants/             # 常量定义
│   ├── api.ts
│   ├── common.ts
│   └── index.ts
├── App.vue                # 根组件
└── main.ts                # 应用入口
```


### 3. 命名规范统一

#### 当前命名问题
- 部分文件使用kebab-case，部分使用camelCase
- 组件目录结构不一致

#### 建议规范（符合Vue 3最佳实践）
- **目录名**：使用 kebab-case（如 `user-management/`）
- **Vue组件文件名**：使用 PascalCase（如 `UserProfile.vue`）
- **TypeScript文件名**：使用 camelCase（如 `userService.ts`）
- **组合式函数**：使用 `use` 前缀 + PascalCase（如 `useUserProfile.ts`）
- **变量/函数**：使用 camelCase（如 `getUserInfo`）
- **常量**：使用 UPPER_SNAKE_CASE（如 `API_BASE_URL`）
- **类型/接口**：使用 PascalCase（如 `UserProfile`、`ApiResponse`）

## 🔧 架构优化方案

### 1. 组件解耦


#### 搜索组件整合
- 将分散的搜索相关组件整合到 `components/business/search/` 下
- 创建 `useSearch.ts` 组合式函数
- 统一搜索接口和类型定义

### 2. 可复用组件提取

#### 已识别的可复用组件
- `ConfigurableTable` - 可配置表格组件
- `SmartFormField` - 智能表单字段组件
- `CustomDrawer` - 自定义抽屉组件
- `IconSelector` - 图标选择器组件

#### 建议独立为功能库（符合Vue 3最佳实践）
```
components/
├── ui/                    # 基础UI组件
│   ├── table/
│   │   ├── ConfigurableTable.vue
│   │   └── TableColumnSettings.vue
│   ├── form/
│   │   ├── SmartFormField.vue
│   │   └── FormValidators.vue
│   ├── layout/
│   │   ├── CustomDrawer.vue
│   │   └── PageContainer.vue
│   └── selector/
│       ├── IconSelector.vue
│       └── OrgSelector.vue
├── business/              # 业务组件
└── index.ts              # 统一导出

composables/               # 对应的组合式函数
├── useTable.ts
├── useForm.ts
├── useDrawer.ts
└── useSelector.ts
```

### 3. 接口设计优化


#### 类型定义优化
- 将大型类型文件拆分为功能模块
- 建立类型继承关系
- 使用泛型提高复用性
- 为组合式函数提供完整的类型支持
