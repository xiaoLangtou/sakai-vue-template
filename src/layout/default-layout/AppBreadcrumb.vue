<template>
  <nav class="breadcrumb">
    <router-link
      v-for="(item, index) in breadcrumbItems"
      :key="item.path"
      :to="item.path"
      class="breadcrumb-item"
      :class="{ active: index === breadcrumbItems.length - 1 }"
    >
      {{ item.title }}
      <span v-if="index < breadcrumbItems.length - 1" class="separator">/</span>
    </router-link>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbItems = computed(() => {
  const matched = route.matched.filter(item => item.meta?.title)
  return matched.map(item => ({
    path: item.path,
    title: item.meta.title
  }))
})
</script>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumb-item {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.breadcrumb-item:hover {
  color: #1890ff;
}

.breadcrumb-item.active {
  color: #333;
  font-weight: 500;
}

.separator {
  margin: 0 8px;
  color: #999;
}
</style>
