# CustomDrawer 自定义抽屉组件

基于 PrimeVue Drawer 封装的自定义抽屉组件，提供了更便捷的使用方式和额外的功能。

## 特性

- 基于 PrimeVue Drawer 组件封装
- 支持自定义确认和取消按钮
- 提供丰富的插槽支持
- 支持多种位置和尺寸
- TypeScript 支持
- 完整的事件处理

## 基础用法

```vue
<template>
  <div>
    <Button label="打开抽屉" @click="visible = true" />
    
    <CustomDrawer
      v-model:visible="visible"
      header="抽屉标题"
      :show-default-footer="true"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    >
      <p>这里是抽屉的内容</p>
    </CustomDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CustomDrawer } from '@/components';
import Button from 'primevue/button';

const visible = ref(false);

const handleConfirm = () => {
  console.log('确认操作');
  visible.value = false;
};

const handleCancel = () => {
  console.log('取消操作');
};
</script>
```

## 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| visible | boolean | false | 抽屉是否可见 |
| position | string | right | 抽屉位置 |
| header | string | 空字符串 | 抽屉标题 |
| modal | boolean | true | 是否为模态框 |
| dismissable | boolean | true | 是否可通过点击遮罩关闭 |
| showCloseIcon | boolean | true | 是否显示关闭图标 |
| showContent | boolean | true | 是否显示内容区域 |
| showDefaultFooter | boolean | false | 是否显示默认底部 |
| showConfirmButton | boolean | true | 是否显示确认按钮 |
| showCancelButton | boolean | true | 是否显示取消按钮 |
| confirmButtonText | string | 确定 | 确认按钮文本 |
| cancelButtonText | string | 取消 | 取消按钮文本 |
| confirmButtonIcon | string | 空字符串 | 确认按钮图标 |
| cancelButtonIcon | string | 空字符串 | 取消按钮图标 |
| confirmLoading | boolean | false | 确认按钮加载状态 |

## 事件 (Events)

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:visible | value: boolean | 可见性更新事件 |
| show | 无 | 显示事件 |
| after-show | 无 | 显示后事件 |
| hide | 无 | 隐藏事件 |
| after-hide | 无 | 隐藏后事件 |
| before-hide | 无 | 隐藏前事件 |
| cancel | 无 | 取消事件 |
| confirm | 无 | 确认事件 |

## 插槽 (Slots)

| 插槽名 | 参数 | 说明 |
|--------|------|------|
| default | 无 | 默认插槽，用于放置抽屉的主体内容 |
| header | 无 | 头部插槽，用于自定义抽屉头部内容 |
| closebutton | closeCallback | 关闭按钮插槽，用于自定义关闭按钮 |
| closeicon | 无 | 关闭图标插槽，用于自定义关闭图标 |
| footer | 无 | 底部插槽，用于自定义抽屉底部内容 |

## 高级用法

### 自定义头部

```vue
<CustomDrawer v-model:visible="visible">
  <template #header>
    <div class="flex items-center gap-2">
      <i class="pi pi-user"></i>
      <span class="font-semibold">用户信息</span>
    </div>
  </template>
  
  <!-- 内容 -->
</CustomDrawer>
```

### 自定义底部

```vue
<CustomDrawer v-model:visible="visible">
  <!-- 内容 -->
  
  <template #footer>
    <div class="flex justify-between">
      <Button label="重置" severity="secondary" />
      <div class="flex gap-2">
        <Button label="取消" severity="secondary" @click="visible = false" />
        <Button label="保存" @click="handleSave" />
      </div>
    </div>
  </template>
</CustomDrawer>
```

### 表单抽屉

```vue
<CustomDrawer
  v-model:visible="visible"
  header="编辑用户"
  :show-default-footer="true"
  :confirm-loading="loading"
  @confirm="handleSubmit"
>
  <form @submit.prevent="handleSubmit">
    <div class="field">
      <label for="name">姓名</label>
      <InputText id="name" v-model="form.name" />
    </div>
    
    <div class="field">
      <label for="email">邮箱</label>
      <InputText id="email" v-model="form.email" type="email" />
    </div>
  </form>
</CustomDrawer>
```