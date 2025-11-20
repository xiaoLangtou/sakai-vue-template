## 📋 项目概览

**项目名称**: Sakai Vue Template  
**版本**: 4.3.0  
**技术栈**: Vue 3.4+ + Rsbuild + TypeScript + PrimeVue + TailwindCSS

这是一个基于 Vue 3 和 Rsbuild 构建的现代化企业级后台管理系统模板，使用 PrimeVue 作为 UI 组件库，集成了完整的权限管理、菜单管理、标签页管理等功能。

---

## 🏗️ 核心技术架构

### 构建工具
- **Rsbuild**: 替代 Vite/Webpack 的新一代构建工具，性能更优
- **TypeScript**: 严格类型检查，提升代码质量
- **Rspack**: 底层打包引擎

### 前端框架
- **Vue 3.4+**: Composition API + `<script setup>`
- **Vue Router 4**: Hash 模式路由
- **Pinia**: 状态管理，支持持久化

### UI 框架
- **PrimeVue 4.3+**: 主要 UI 组件库
- **PrimeUI Themes**: Aura 主题系统
- **TailwindCSS 3.4**: 原子化 CSS
- **Lucide Icons**: 现代图标库

### 数据管理
- **TanStack Query**: 服务端状态管理
- **Axios**: HTTP 请求库
- **Zod**: 数据验证

---

## 📁 项目结构

```
sakai-vue/
├── config/                    # 构建配置
│   ├── plugin/               # Rsbuild 插件配置
│   └── utils/                # 工具函数
├── docs/                      # 项目文档
├── public/                    # 静态资源
├── src/
│   ├── assets/               # 资源文件
│   │   ├── fonts/           # 字体
│   │   ├── images/          # 图片
│   │   ├── layout/          # 布局样式
│   │   └── styles.scss      # 全局样式
│   ├── components/           # 组件
│   │   ├── bussiness/       # 业务组件
│   │   ├── form/            # 表单组件
│   │   ├── table/           # 表格组件
│   │   └── ui/              # UI 组件
│   ├── composables/          # 组合式函数
│   ├── global/               # 全局配置
│   │   ├── constants.ts     # 常量
│   │   ├── enums.ts         # 枚举
│   │   └── layout-sizes.ts  # 布局尺寸
│   ├── layout/               # 布局组件
│   │   ├── default-layout/  # 默认布局
│   │   ├── topbar-layout/   # 顶栏布局
│   │   └── shared/          # 共享组件
│   ├── preferences/          # 偏好设置
│   ├── router/               # 路由
│   │   ├── guard/           # 路由守卫
│   │   └── static-route.ts  # 静态路由
│   ├── services/             # API 服务
│   │   ├── core/            # 核心服务
│   │   ├── modules/         # 业务模块
│   │   └── types/           # 类型定义
│   ├── stores/               # 状态管理
│   ├── types/                # 类型定义
│   ├── utils/                # 工具函数
│   ├── views/                # 页面视图
│   │   ├── admin/           # 管理页面
│   │   ├── auth/            # 认证页面
│   │   ├── dashboard/       # 仪表盘
│   │   ├── error-page/      # 错误页面
│   │   └── system/          # 系统页面
│   ├── App.vue              # 根组件
│   └── main.ts              # 入口文件
├── .eslintrc-auto-import.js  # 自动导入 ESLint 配置
├── eslint.config.ts          # ESLint 配置
├── rsbuild.config.ts         # Rsbuild 配置
├── tailwind.config.ts        # TailwindCSS 配置
├── tsconfig.app.json         # TypeScript 配置
├── Dockerfile                # Docker 配置
└── package.json              # 项目配置
```

---

## 🔑 核心功能模块

### 1. 认证系统 ([src/stores/auth.ts](cci:7://file:///Volumes/weipengcheng/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE/tva/sakai-vue/src/stores/auth.ts:0:0-0:0))
- **登录/登出**: 支持用户名密码登录，MD5 加密
- **Token 管理**: 自动存储和刷新 Token
- **用户信息**: 存储用户基本信息
- **登录确认**: 退出时二次确认

### 2. 路由系统 ([src/router/](cci:7://file:///Volumes/weipengcheng/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE/tva/sakai-vue/src/router:0:0-0:0))
- **静态路由**: 登录页、错误页等固定路由
- **动态路由**: 根据用户权限动态加载菜单路由
- **路由守卫**:
  - [permission.ts](cci:7://file:///Volumes/weipengcheng/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE/tva/sakai-vue/src/router/guard/permission.ts:0:0-0:0): 权限验证
  - [menu.ts](cci:7://file:///Volumes/weipengcheng/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE/tva/sakai-vue/src/types/menu.ts:0:0-0:0): 动态菜单加载
  - [tabs.ts](cci:7://file:///Volumes/weipengcheng/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE/tva/sakai-vue/src/stores/tabs.ts:0:0-0:0): 标签页管理
  - [info.ts](cci:7://file:///Volumes/weipengcheng/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE/tva/sakai-vue/src/router/guard/info.ts:0:0-0:0): 用户信息获取
  - [loading.ts](cci:7://file:///Volumes/weipengcheng/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE/tva/sakai-vue/src/stores/loading.ts:0:0-0:0): 页面加载状态

### 3. 布局系统 ([src/stores/layout.ts](cci:7://file:///Volumes/weipengcheng/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE/tva/sakai-vue/src/stores/layout.ts:0:0-0:0))
- **响应式断点**: Mobile/Tablet/Desktop/Wide
- **侧边栏模式**: Relative/Fixed 两种模式
- **主题切换**: 亮色/暗色主题
- **布局配置**: 
  - 标签页显示/隐藏
  - 头部/底部显示控制
  - 色弱/灰色模式
  - 水印功能

### 4. 菜单系统 ([src/stores/menu.ts](cci:7://file:///Volumes/weipengcheng/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE/tva/sakai-vue/src/stores/menu.ts:0:0-0:0))
- **菜单获取**: 从后端获取用户菜单
- **菜单扁平化**: 树形结构转扁平列表
- **顶部菜单**: 一级菜单提取
- **子菜单映射**: Map 结构存储子菜单

### 5. 标签页系统 ([src/stores/tabs.ts](cci:7://file:///Volumes/weipengcheng/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE/tva/sakai-vue/src/stores/tabs.ts:0:0-0:0))
- **标签页管理**: 添加、删除、激活
- **批量操作**: 关闭其他、关闭所有、关闭左侧/右侧
- **持久化**: LocalStorage 存储
- **状态管理**: 加载状态、错误状态

### 6. HTTP 请求 ([src/services/core/http.ts](cci:7://file:///Volumes/weipengcheng/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE/tva/sakai-vue/src/services/core/http.ts:0:0-0:0))
- **请求拦截**: 自动添加 Token
- **响应拦截**: 统一错误处理
- **401 处理**: Token 过期自动弹出登录框
- **错误提示**: Toast 消息提示
- **超时处理**: 10 秒超时

### 7. 组件系统

#### 业务组件 ([src/components/bussiness/](cci:7://file:///Volumes/weipengcheng/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE/tva/sakai-vue/src/components/bussiness:0:0-0:0))
- **AppTabs**: 标签页组件
- **GlobalSearch**: 全局搜索
- **LoginDialog**: 登录弹窗
- **PageContainer**: 页面容器
- **PageHeader**: 页面头部
- **IconSelector**: 图标选择器
- **OrgSelector**: 组织选择器
- **SplitPane**: 分割面板

#### UI 组件 ([src/components/ui/](cci:7://file:///Volumes/weipengcheng/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE/tva/sakai-vue/src/components/ui:0:0-0:0))
- **CustomDialog**: 自定义对话框
- **CustomDrawer**: 自定义抽屉
- **Sidebar**: 侧边栏组件
- **Tooltip**: 工具提示
- **Sheet**: 表单面板

#### 表格组件 ([src/components/table/](cci:7://file:///Volumes/weipengcheng/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE/tva/sakai-vue/src/components/table:0:0-0:0))
- **ConfigurableTable**: 可配置表格
- **TableColumnSettings**: 列设置

---

## 🛠️ 工具函数

### 存储工具 ([src/utils/storage.ts](cci:7://file:///Volumes/weipengcheng/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE/tva/sakai-vue/src/utils/storage.ts:0:0-0:0))
- **前缀管理**: 全局存储前缀
- **过期时间**: 支持设置过期时间
- **监听机制**: Watch 监听变化
- **自动清理**: 过期数据自动清理

### 结果处理 ([src/utils/result-handler.ts](cci:7://file:///Volumes/weipengcheng/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE/tva/sakai-vue/src/utils/result-handler.ts:0:0-0:0))
- **统一错误处理**: `to()` 函数包装 Promise
- **类型安全**: TypeScript 类型推断

### 日志工具 ([src/utils/logger.ts](cci:7://file:///Volumes/weipengcheng/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE/tva/sakai-vue/src/utils/logger.ts:0:0-0:0))
- **分级日志**: info/warn/error/debug
- **环境区分**: 开发/生产环境

### 搜索助手 ([src/utils/search-helpers.ts](cci:7://file:///Volumes/weipengcheng/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE/tva/sakai-vue/src/utils/search-helpers.ts:0:0-0:0))
- **高亮搜索**: 关键词高亮
- **模糊搜索**: 支持拼音搜索

---

## 🎨 样式系统

### TailwindCSS 配置
- **PrimeUI 集成**: 使用 `tailwindcss-primeui` 插件
- **暗色模式**: 支持 `.app-dark` 类名切换
- **响应式断点**: sm/md/lg/xl/2xl
- **自定义颜色**: HSL 颜色变量

### 全局样式 ([src/assets/styles.scss](cci:7://file:///Volumes/weipengcheng/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE/tva/sakai-vue/src/assets/styles.scss:0:0-0:0))
- **滚动条优化**: 细滚动条样式
- **表格样式**: DataTable 自定义样式
- **抽屉层级**: z-index 管理

---

## 🔧 开发配置

### 自动导入
- **unplugin-auto-import**: 自动导入 Vue/Router/Pinia API
- **unplugin-vue-components**: 自动导入 PrimeVue 组件
- **PrimeVueResolver**: PrimeVue 组件解析器

### 代码规范
- **ESLint**: TypeScript + Vue 规则
- **Prettier**: 代码格式化
- **Oxlint**: 快速 Lint 检查
- **Husky**: Git Hooks
- **Commitlint**: Commit 规范

### 构建优化
- **代码拆分**: `split-by-module` 策略
- **Console 移除**: 生产环境移除 log/info/warn
- **Source Map**: 开发/生产不同策略
- **懒加载**: 路由懒加载

---

## 🚀 运行命令

```bash
# 开发环境
pnpm dev:rsbuild

# 生产构建
pnpm build:pro

# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 生产构建 + 分析
pnpm build:pro:rsdoctor
```

---

## 🐳 Docker 部署

```dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 📝 环境变量

项目使用 `.env` 文件管理环境变量：
- `.env`: 通用配置
- `.env.development`: 开发环境
- `.env.production`: 生产环境
- `.env.test`: 测试环境

所有环境变量以 `VITE_` 前缀开头。

---

## 🎯 项目特点

1. **现代化构建**: 使用 Rsbuild 替代 Vite，构建速度更快
2. **类型安全**: 全面使用 TypeScript，严格类型检查
3. **组件化**: 高度组件化，复用性强
4. **响应式**: 完善的响应式布局系统
5. **权限管理**: 完整的 RBAC 权限系统
6. **主题系统**: 支持亮色/暗色主题切换
7. **国际化**: 预留 i18n 支持
8. **性能优化**: 代码拆分、懒加载、Tree Shaking
9. **开发体验**: 自动导入、热更新、代码规范
10. **文档完善**: 详细的组件使用文档

---

## 📚 文档资源

项目 [docs/](cci:7://file:///Volumes/weipengcheng/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE/tva/sakai-vue/docs:0:0-0:0) 目录包含详细的使用文档：
- [table.md](cci:7://file:///Volumes/weipengcheng/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE/tva/sakai-vue/docs/table.md:0:0-0:0): 表格组件使用
- [configurable-table-usage.md](cci:7://file:///Volumes/weipengcheng/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE/tva/sakai-vue/docs/configurable-table-usage.md:0:0-0:0): 可配置表格
- [search-components-usage.md](cci:7://file:///Volumes/weipengcheng/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE/tva/sakai-vue/docs/search-components-usage.md:0:0-0:0): 搜索组件
- [common-components-usage.md](cci:7://file:///Volumes/weipengcheng/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE/tva/sakai-vue/docs/common-components-usage.md:0:0-0:0): 通用组件
- [utility-components-usage.md](cci:7://file:///Volumes/weipengcheng/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE/tva/sakai-vue/docs/utility-components-usage.md:0:0-0:0): 工具组件
- [result-handler-guide.md](cci:7://file:///Volumes/weipengcheng/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE/tva/sakai-vue/docs/result-handler-guide.md:0:0-0:0): 结果处理指南

---

## 🔗 相关链接

- **PrimeVue**: https://primevue.org/
- **Rsbuild**: https://rsbuild.dev/
- **TailwindCSS**: https://tailwindcss.com/
- **Vue 3**: https://vuejs.org/

---

## ✅ 总结

这是一个**生产级别的企业后台管理系统模板**，具有以下优势：

- ✅ 完整的权限管理系统
- ✅ 灵活的布局配置
- ✅ 丰富的业务组件
- ✅ 优秀的开发体验
- ✅ 完善的类型系统
- ✅ 现代化的技术栈
- ✅ 详细的文档支持

适合用于快速搭建企业级后台管理系统，可以直接基于此模板进行二次开发。