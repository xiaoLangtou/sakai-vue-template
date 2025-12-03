# LoginDialog 登录弹窗组件

## 📝 描述

登录弹窗组件，用于在token失效时提供重新登录功能，避免用户丢失当前页面状态。

## ✨ 特性

- 🔐 支持账号密码登录
- 🖼️ 集成验证码功能
- ⏰ 验证码过期提醒
- 🎨 现代化UI设计
- 📱 响应式布局
- 🔄 自动重置表单
- ⌨️ 支持回车键登录

## 🚀 使用方式

### 基础用法

```vue
<template>
    <LoginDialog v-model:visible="isVisible" @login-success="handleLoginSuccess" />
</template>

<script setup>
import { ref } from 'vue';
import { LoginDialog } from '@/components';

const isVisible = ref(false);

const handleLoginSuccess = () => {
    console.log('登录成功');
};
</script>
```

### 全局使用

项目已在 `App.vue` 中集成全局登录弹窗，通过 `useLoginDialog` composable 控制：

```typescript
import { useLoginDialog } from '@/composables';

const { showLoginDialog, hideLoginDialog, isLoginDialogVisible } = useLoginDialog();

// 显示登录弹窗
showLoginDialog();

// 隐藏登录弹窗
hideLoginDialog();
```

## 📋 Props

| 属性名  | 类型    | 默认值 | 说明         |
| ------- | ------- | ------ | ------------ |
| visible | boolean | false  | 是否显示弹窗 |

## 🎯 Events

| 事件名         | 参数           | 说明         |
| -------------- | -------------- | ------------ |
| update:visible | value: boolean | 更新显示状态 |
| login-success  | -              | 登录成功事件 |

## 🔧 自动触发机制

系统已配置自动触发机制：

1. **HTTP 401 错误**：当API请求返回401状态码时，自动显示登录弹窗
2. **Token失效**：检测到token失效时自动触发
3. **智能判断**：如果当前已在登录页面，则不显示弹窗，避免重复

## 🎨 样式定制

组件使用 PrimeVue 的 Dialog 组件作为基础，支持主题定制：

```vue
<style>
.login-dialog :deep(.p-dialog-header) {
    /* 自定义头部样式 */
}

.login-dialog :deep(.p-dialog-content) {
    /* 自定义内容样式 */
}
</style>
```

## 🔄 工作流程

1. **触发条件**：API请求返回401或token失效
2. **显示弹窗**：自动显示登录弹窗
3. **用户登录**：用户输入账号密码和验证码
4. **验证成功**：登录成功后自动关闭弹窗
5. **继续操作**：用户可继续之前的操作

## 🛡️ 安全特性

- 密码MD5加密传输
- 验证码防机器人
- Token自动清理
- 表单自动重置

## 📱 响应式支持

- 移动端适配
- 触摸友好的交互
- 自适应布局
