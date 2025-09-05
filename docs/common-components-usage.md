# 通用组件使用文档

本文档详细介绍了项目中常用的通用组件，包括表单组件、页面容器、抽屉组件、登录对话框等。

## 目录

- [SmartFormField 组件](#smartformfield-组件)
- [PageContainer 组件](#pagecontainer-组件)
- [CustomDrawer 组件](#customdrawer-组件)
- [LoginDialog 组件](#logindialog-组件)
- [IconSelector 组件](#iconselector-组件)
- [UserProfile 组件](#userprofile-组件)
- [最佳实践](#最佳实践)

---

## SmartFormField 组件

### 组件名称

`SmartFormField` - 智能表单字段组件

### 组件描述

基于 PrimeVue Forms 的智能表单字段组件，提供统一的表单字段布局、验证、错误显示等功能。支持行内模式和垂直模式，具有良好的可扩展性。

### 基础使用示例

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <SmartFormField name="username" label="用户名" required>
      <template #default="{ value, onInput, invalid }">
        <InputText
          :model-value="value"
          :invalid="invalid"
          placeholder="请输入用户名"
          @input="onInput"
        />
      </template>
    </SmartFormField>

    <SmartFormField name="email" label="邮箱" description="请输入有效的邮箱地址">
      <template #default="{ value, onInput, invalid }">
        <InputText
          :model-value="value"
          :invalid="invalid"
          type="email"
          placeholder="请输入邮箱"
          @input="onInput"
        />
      </template>
    </SmartFormField>

    <SmartFormField name="status" label="状态">
      <template #default="{ value, onChange }">
        <Select
          :model-value="value"
          :options="statusOptions"
          option-label="label"
          option-value="value"
          placeholder="请选择状态"
          @change="onChange"
        />
      </template>
    </SmartFormField>

    <Button type="submit" label="提交" />
  </form>
</template>

<script setup lang="ts">
const statusOptions = [
  { label: '启用', value: 'active' },
  { label: '禁用', value: 'inactive' }
];

const handleSubmit = () => {
  // 处理表单提交
};
</script>
```

### 行内模式使用示例

```vue
<template>
  <div class="form-container">
    <SmartFormField 
      name="name" 
      label="姓名" 
      inline 
      :label-width="100"
      required
    >
      <template #default="{ value, onInput, invalid }">
        <InputText
          :model-value="value"
          :invalid="invalid"
          placeholder="请输入姓名"
          @input="onInput"
        />
      </template>
    </SmartFormField>

    <SmartFormField 
      name="phone" 
      label="手机号" 
      inline 
      :label-width="100"
    >
      <template #default="{ value, onInput, invalid }">
        <InputText
          :model-value="value"
          :invalid="invalid"
          placeholder="请输入手机号"
          @input="onInput"
        />
      </template>
    </SmartFormField>

    <SmartFormField 
      name="address" 
      label="地址" 
      inline 
      label-width="100px"
      description="请填写详细地址"
    >
      <template #default="{ value, onInput }">
        <Textarea
          :model-value="value"
          placeholder="请输入地址"
          rows="3"
          @input="onInput"
        />
      </template>
    </SmartFormField>
  </div>
</template>
```

### Attributes (Props)

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| name | 表单字段名称 | `string` | - | - |
| label | 表单字段标签文本 | `string` | - | - |
| initialValue | 表单字段初始值 | `any` | - | `''` |
| resolver | 表单验证解析器 | `any` | - | - |
| required | 是否为必填字段 | `boolean` | - | `false` |
| description | 表单字段描述文本 | `string` | - | - |
| class | 自定义CSS类名 | `string \| object` | - | - |
| inline | 是否使用行内模式 | `boolean` | - | `false` |
| labelWidth | label的宽度 | `number \| string` | - | `''` |

### Slots

| 插槽名 | 说明 | 参数 |
|--------|------|------|
| default | 表单字段内容 | `FormFieldSlotProps` |

#### FormFieldSlotProps 接口

```typescript
interface FormFieldSlotProps {
  value: any;           // 当前值
  touched: boolean;     // 是否已触摸
  dirty: boolean;       // 是否已修改
  pristine: boolean;    // 是否为原始状态
  valid: boolean;       // 是否有效
  invalid: boolean;     // 是否无效
  error: any;          // 错误信息
  errors: any[];       // 错误列表
  onInput: (event: any) => void;   // 输入事件处理
  onBlur: (event: any) => void;    // 失焦事件处理
  onChange: (event: any) => void;  // 变更事件处理
  props: any;          // 其他属性
  field: any;          // 字段对象
}
```

---

## PageContainer 组件

### 组件名称

`PageContainer` - 页面容器组件

### 组件描述

标准的页面容器组件，提供统一的页面布局结构，包含头部区域和内容区域。自动集成 Toast 和 ConfirmDialog 组件。

### 使用示例

```vue
<template>
  <PageContainer>
    <template #header>
      <div class="flex justify-between items-center">
        <h5 class="m-0">页面标题</h5>
        <div class="flex gap-2">
          <Button label="新增" icon="pi pi-plus" @click="handleCreate" />
          <Button label="导出" icon="pi pi-download" @click="handleExport" />
        </div>
      </div>
    </template>

    <!-- 页面主要内容 -->
    <div class="page-content">
      <ConfigurableTable
        :data="tableData"
        :columns="columns"
        :loading="loading"
      />
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
const tableData = ref([]);
const columns = ref([]);
const loading = ref(false);

const handleCreate = () => {
  // 处理新增逻辑
};

const handleExport = () => {
  // 处理导出逻辑
};
</script>
```

### Slots

| 插槽名 | 说明 | 参数 |
|--------|------|------|
| header | 页面头部内容 | - |
| default | 页面主要内容 | - |

---

## CustomDrawer 组件

### 组件名称

`CustomDrawer` - 自定义抽屉组件

### 组件描述

基于 PrimeVue Drawer 的增强抽屉组件，提供多种尺寸预设、自定义底部操作区域、加载状态等功能。

### 基础使用示例

```vue
<template>
  <div>
    <Button label="打开抽屉" @click="drawerVisible = true" />
    
    <CustomDrawer
      v-model:visible="drawerVisible"
      header="用户详情"
      width-type="medium"
      :show-default-footer="true"
      :confirm-loading="loading"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    >
      <div class="p-4">
        <h3>用户信息</h3>
        <p>这里是用户详细信息...</p>
      </div>
    </CustomDrawer>
  </div>
</template>

<script setup lang="ts">
const drawerVisible = ref(false);
const loading = ref(false);

const handleConfirm = async () => {
  loading.value = true;
  try {
    // 执行确认操作
    await saveUserData();
    drawerVisible.value = false;
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  drawerVisible.value = false;
};
</script>
```

### 高级使用示例

```vue
<template>
  <CustomDrawer
    v-model:visible="drawerVisible"
    position="right"
    width-type="large"
    :modal="true"
    :dismissable="false"
    custom-width="600px"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <i class="pi pi-user"></i>
        <span>自定义头部</span>
      </div>
    </template>

    <div class="drawer-content">
      <!-- 抽屉内容 -->
    </div>

    <template #footer>
      <div class="flex justify-between w-full">
        <Button label="重置" severity="secondary" @click="handleReset" />
        <div class="flex gap-2">
          <Button label="取消" severity="secondary" @click="handleCancel" />
          <Button label="保存" @click="handleSave" />
        </div>
      </div>
    </template>
  </CustomDrawer>
</template>
```

### Attributes (Props)

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| visible | 抽屉是否可见 | `boolean` | - | `false` |
| position | 抽屉位置 | `string` | `left` / `right` / `top` / `bottom` / `full` | `right` |
| header | 抽屉标题 | `string` | - | `''` |
| modal | 是否为模态框 | `boolean` | - | `true` |
| dismissable | 是否可通过点击遮罩关闭 | `boolean` | - | `true` |
| showCloseIcon | 是否显示关闭图标 | `boolean` | - | `true` |
| showContent | 是否显示内容区域 | `boolean` | - | `true` |
| showDefaultFooter | 是否显示默认底部 | `boolean` | - | `false` |
| showConfirmButton | 是否显示确认按钮 | `boolean` | - | `true` |
| showCancelButton | 是否显示取消按钮 | `boolean` | - | `true` |
| confirmButtonText | 确认按钮文本 | `string` | - | `'确定'` |
| cancelButtonText | 取消按钮文本 | `string` | - | `'取消'` |
| confirmButtonIcon | 确认按钮图标 | `string` | - | `''` |
| cancelButtonIcon | 取消按钮图标 | `string` | - | `''` |
| confirmLoading | 确认按钮加载状态 | `boolean` | - | `false` |
| widthType | 抽屉宽度类型 | `string` | `small` / `medium` / `large` / `extra-large` / `full` / `auto` | `medium` |
| customWidth | 自定义宽度 | `string` | - | `''` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:visible | 可见性更新事件 | `(value: boolean)` |
| show | 显示事件 | `()` |
| after-show | 显示后事件 | `()` |
| hide | 隐藏事件 | `()` |
| after-hide | 隐藏后事件 | `()` |
| before-hide | 隐藏前事件 | `()` |
| cancel | 取消事件 | `()` |
| confirm | 确认事件 | `()` |

### Slots

| 插槽名 | 说明 | 参数 |
|--------|------|------|
| default | 抽屉主体内容 | - |
| header | 自定义头部内容 | - |
| footer | 自定义底部内容 | - |
| closebutton | 自定义关闭按钮 | `{ closeCallback: () => void }` |
| closeicon | 自定义关闭图标 | - |

---

## LoginDialog 组件

### 组件名称

`LoginDialog` - 登录对话框组件

### 组件描述

用于处理登录过期后的重新登录功能，包含账号、密码、验证码输入，支持验证码自动刷新和过期提醒。

### 使用示例

```vue
<template>
  <div>
    <Button label="模拟登录过期" @click="showLoginDialog = true" />
    
    <LoginDialog
      v-model:visible="showLoginDialog"
      @login-success="handleLoginSuccess"
    />
  </div>
</template>

<script setup lang="ts">
const showLoginDialog = ref(false);

const handleLoginSuccess = () => {
  console.log('登录成功');
  // 处理登录成功后的逻辑
};
</script>
```

### Attributes (Props)

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| visible | 是否显示弹窗 | `boolean` | - | `false` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:visible | 更新显示状态 | `(value: boolean)` |
| login-success | 登录成功事件 | `()` |

---

## IconSelector 组件

### 组件名称

`IconSelector` - 图标选择器组件

### 组件描述

提供图标选择功能的组件，支持搜索、分类浏览等功能。

### 使用示例

```vue
<template>
  <div>
    <IconSelector
      v-model="selectedIcon"
      placeholder="选择图标"
      @change="handleIconChange"
    />
    
    <div v-if="selectedIcon" class="mt-4">
      <p>已选择图标：</p>
      <i :class="selectedIcon" style="font-size: 2rem;"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
const selectedIcon = ref('');

const handleIconChange = (icon: string) => {
  console.log('选择的图标:', icon);
};
</script>
```

---

## UserProfile 组件

### 组件名称

`UserProfile` - 用户资料组件

### 组件描述

显示和编辑用户资料信息的组件，包含头像、基本信息等。

### 使用示例

```vue
<template>
  <UserProfile
    :user-data="userData"
    :editable="true"
    @update="handleUserUpdate"
  />
</template>

<script setup lang="ts">
const userData = ref({
  id: '1',
  name: '张三',
  email: 'zhangsan@example.com',
  avatar: '/avatar.jpg',
  phone: '13800138000'
});

const handleUserUpdate = (updatedData: any) => {
  console.log('用户信息更新:', updatedData);
  // 处理用户信息更新
};
</script>
```

---

## 最佳实践

### 1. SmartFormField 最佳实践

```vue
<!-- 推荐：使用统一的表单布局 -->
<template>
  <div class="form-container space-y-4">
    <SmartFormField name="username" label="用户名" required>
      <template #default="{ value, onInput, invalid }">
        <InputText
          :model-value="value"
          :invalid="invalid"
          placeholder="请输入用户名"
          @input="onInput"
        />
      </template>
    </SmartFormField>
  </div>
</template>

<!-- 推荐：行内模式统一 labelWidth -->
<template>
  <div class="form-container">
    <SmartFormField 
      v-for="field in formFields" 
      :key="field.name"
      :name="field.name"
      :label="field.label"
      inline
      :label-width="120"
    >
      <!-- 字段内容 -->
    </SmartFormField>
  </div>
</template>
```

### 2. PageContainer 最佳实践

```vue
<!-- 推荐：标准页面结构 -->
<template>
  <PageContainer>
    <template #header>
      <div class="flex justify-between items-center">
        <h5 class="m-0">{{ pageTitle }}</h5>
        <div class="flex gap-2">
          <!-- 操作按钮 -->
        </div>
      </div>
    </template>

    <!-- 搜索区域 -->
    <ListSearch
      v-model="searchParams"
      :filter-configs="filterConfigs"
      @search="handleSearch"
    />

    <!-- 表格区域 -->
    <ConfigurableTable
      :data="tableData"
      :columns="columns"
      :loading="loading"
    />
  </PageContainer>
</template>
```

### 3. CustomDrawer 最佳实践

```vue
<!-- 推荐：根据内容选择合适的尺寸 -->
<template>
  <!-- 简单表单：small -->
  <CustomDrawer width-type="small">
    <!-- 简单表单内容 -->
  </CustomDrawer>

  <!-- 复杂表单：medium -->
  <CustomDrawer width-type="medium">
    <!-- 复杂表单内容 -->
  </CustomDrawer>

  <!-- 详情页面：large -->
  <CustomDrawer width-type="large">
    <!-- 详情页面内容 -->
  </CustomDrawer>
</template>

<!-- 推荐：使用加载状态 -->
<template>
  <CustomDrawer
    :confirm-loading="saving"
    @confirm="handleSave"
  >
    <!-- 内容 -->
  </CustomDrawer>
</template>

<script setup lang="ts">
const saving = ref(false);

const handleSave = async () => {
  saving.value = true;
  try {
    await saveData();
    // 保存成功后关闭抽屉
  } finally {
    saving.value = false;
  }
};
</script>
```

### 4. 组件组合使用

```vue
<template>
  <PageContainer>
    <template #header>
      <div class="flex justify-between items-center">
        <h5 class="m-0">用户管理</h5>
        <Button label="新增用户" @click="openCreateDrawer" />
      </div>
    </template>

    <!-- 搜索组件 -->
    <ListSearch
      v-model="searchParams"
      :filter-configs="filterConfigs"
      @search="handleSearch"
    />

    <!-- 表格组件 -->
    <ConfigurableTable
      :data="users"
      :columns="columns"
      :loading="loading"
      @row-edit="openEditDrawer"
    />

    <!-- 用户表单抽屉 -->
    <CustomDrawer
      v-model:visible="drawerVisible"
      :header="drawerTitle"
      width-type="medium"
      :show-default-footer="true"
      :confirm-loading="saving"
      @confirm="handleSaveUser"
    >
      <form class="space-y-4">
        <SmartFormField name="name" label="姓名" required>
          <template #default="{ value, onInput, invalid }">
            <InputText
              :model-value="value"
              :invalid="invalid"
              @input="onInput"
            />
          </template>
        </SmartFormField>
        
        <SmartFormField name="email" label="邮箱" required>
          <template #default="{ value, onInput, invalid }">
            <InputText
              :model-value="value"
              :invalid="invalid"
              type="email"
              @input="onInput"
            />
          </template>
        </SmartFormField>
      </form>
    </CustomDrawer>
  </PageContainer>
</template>
```

### 5. 错误处理和用户体验

```typescript
// 推荐：统一错误处理
const handleSave = async () => {
  try {
    saving.value = true;
    await saveUserData();
    toast.success('保存成功');
    drawerVisible.value = false;
  } catch (error) {
    console.error('保存失败:', error);
    toast.error('保存失败，请重试');
  } finally {
    saving.value = false;
  }
};

// 推荐：表单验证
const validateForm = () => {
  // 表单验证逻辑
  return isValid;
};

const handleConfirm = () => {
  if (!validateForm()) {
    toast.warn('请检查表单输入');
    return;
  }
  handleSave();
};
```

通过遵循这些最佳实践，可以构建出一致性强、用户体验好的应用界面。