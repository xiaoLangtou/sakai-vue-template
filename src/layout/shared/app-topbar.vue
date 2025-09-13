<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useLayoutStore } from '@/stores/layout';
import { storeToRefs } from 'pinia';
import Drawer from 'primevue/drawer';
import OverlayPanel from 'primevue/overlaypanel';
import Badge from 'primevue/badge';
import Button from 'primevue/button';
import { UserProfile, NotificationDrawer } from '@/components';
import { useAuthStore } from '@/stores';
import { AVATAR_SIZES } from '@/global/layout-sizes';
import { Bell, CalendarDays, MoonIcon, Sun, SwatchBook, Check, Trash2, MoreHorizontal } from 'lucide-vue-next';
// ==================== Store 状态管理 ====================
const layoutStore = useLayoutStore();
const { isDarkTheme } = storeToRefs(layoutStore);
const { toggleDarkMode, openConfigDrawer } = layoutStore;
const authStore = useAuthStore();
// ==================== 本地状态管理 ====================
/** 用户资料抽屉显示状态 */
const profileDrawerVisible = ref<boolean>(false);
/** 移动端菜单面板引用 */
const mobileMenuPanel = ref<InstanceType<typeof OverlayPanel>>();
/** 消息通知抽屉显示状态 */
const notificationDrawerVisible = ref<boolean>(false);

// ==================== 消息通知数据 ====================
/** 消息通知列表 */
const notifications = ref([
  {
    id: 1,
    title: '系统更新通知',
    message: '系统将于今晚 22:00 进行维护更新，预计耗时 2 小时',
    time: '2 分钟前',
    type: 'system',
    isRead: false,
    avatar: null
  },
  {
    id: 2,
    title: '新消息',
    message: '张三给您发送了一条新消息',
    time: '5 分钟前',
    type: 'message',
    isRead: false,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  },
  {
    id: 3,
    title: '任务提醒',
    message: '您有一个任务即将到期，请及时处理',
    time: '1 小时前',
    type: 'task',
    isRead: true,
    avatar: null
  },
  {
    id: 4,
    title: '审批通知',
    message: '您的请假申请已通过审批',
    time: '2 小时前',
    type: 'approval',
    isRead: false,
    avatar: null
  },
  {
    id: 5,
    title: '会议提醒',
    message: '项目评审会议将于明天上午 10:00 开始',
    time: '3 小时前',
    type: 'meeting',
    isRead: true,
    avatar: null
  }
]);

/** 未读消息数量 */
const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.isRead).length;
});

// ==================== 事件处理方法 ====================
const avatarProps = computed(() => {
    const props: Record<string, any> = {};
    if ( authStore.userInfo?.headPic ) {
        props.image = authStore.userInfo?.headPic;
    } else {
        props.icon = 'pi pi-user';
    }
    return props;
});

/**
 * 打开用户资料抽屉
 */
const openProfileDrawer = (): void => {
    profileDrawerVisible.value = true;
};

/**
 * 切换移动端菜单面板
 */
const toggleMobileMenu = (event: Event): void => {
    mobileMenuPanel.value?.toggle(event);
};

/**
 * 打开消息通知抽屉
 */
const openNotificationDrawer = (): void => {
    notificationDrawerVisible.value = true;
};

/**
 * 标记消息为已读
 */
const markAsRead = (notificationId: number): void => {
    const notification = notifications.value.find(n => n.id === notificationId);
    if (notification) {
        notification.isRead = true;
    }
};

/**
 * 标记所有消息为已读
 */
const markAllAsRead = (): void => {
    notifications.value.forEach(n => n.isRead = true);
};

/**
 * 删除消息
 */
const deleteNotification = (notificationId: number): void => {
    const index = notifications.value.findIndex(n => n.id === notificationId);
    if (index > -1) {
        notifications.value.splice(index, 1);
    }
};

/**
 * 清空所有消息
 */
const clearAllNotifications = (): void => {
    notifications.value = [];
};

/**
 * 查看所有消息
 */
const viewAllMessages = (): void => {
    // 这里可以跳转到消息中心页面或执行其他操作
    console.log('查看所有消息');
    // 示例：关闭抽屉并跳转到消息页面
    notificationDrawerVisible.value = false;
    // router.push('/messages'); // 如果有路由的话
};

/**
 * 获取消息类型图标
 */
const getNotificationIcon = (type: string): string => {
    const iconMap: Record<string, string> = {
        system: 'pi pi-cog',
        message: 'pi pi-envelope',
        task: 'pi pi-calendar',
        approval: 'pi pi-check-circle',
        meeting: 'pi pi-users'
    };
    return iconMap[type] || 'pi pi-info-circle';
};

/**
 * 获取消息类型颜色
 */
const getNotificationColor = (type: string): string => {
    const colorMap: Record<string, string> = {
        system: 'text-blue-500',
        message: 'text-green-500',
        task: 'text-orange-500',
        approval: 'text-purple-500',
        meeting: 'text-cyan-500'
    };
    return colorMap[type] || 'text-gray-500';
};
</script>

<template>
    <div :class="[
        'layout-topbar',
        {
            'mobile-topbar': layoutStore.isMobile,
            'desktop-topbar': !layoutStore.isMobile
        }
    ]">
        <div class="layout-topbar-actions">
            <!-- 移动端布局 -->
            <template v-if="layoutStore.isMobile">
                <!-- 主题切换按钮 -->
                <button class="layout-topbar-action" type="button" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>

                <!-- 移动端更多菜单 -->
                <button aria-label="更多选项" class="layout-topbar-action" type="button" @click="toggleMobileMenu">
                    <i class="pi pi-ellipsis-v"></i>
                </button>

                <!-- 移动端菜单面板 -->
                <OverlayPanel ref="mobileMenuPanel" class="mobile-menu-panel">
                    <div class="mobile-menu-content">
                        <button class="mobile-menu-item" type="button" @click="openProfileDrawer">
                            <i class="pi pi-calendar"></i>
                            <span>Calendar</span>
                        </button>
                        <button class="mobile-menu-item" type="button">
                            <i class="pi pi-inbox"></i>
                            <span>Messages</span>
                        </button>
                        <button class="mobile-menu-item" type="button" @click="openProfileDrawer">
                            <i class="pi pi-user"></i>
                            <span>Profile</span>
                        </button>
                        <div class="mobile-menu-divider"></div>
                        <button class="mobile-menu-item" type="button" @click="openConfigDrawer">
                            <i class="pi pi-palette"></i>
                            <span>主题配置</span>
                        </button>
                    </div>
                </OverlayPanel>
            </template>

            <!-- 桌面端布局 -->
            <template v-else>
                <div class="layout-config-menu">
                    <div class="layout-topbar-action" @click="toggleDarkMode">
                        <Sun v-if="!isDarkTheme" :size="18" />
                        <MoonIcon v-else :size="18" />
                    </div>
                    <div class="layout-topbar-action"
                         @click="openConfigDrawer">
                        <SwatchBook :size="18"></SwatchBook>
                    </div>

                    <div
                        class="layout-topbar-action  hidden lg:block"
                        @click="openProfileDrawer">
                        <OverlayBadge>
                            <CalendarDays :size="18" />
                        </OverlayBadge>
                    </div>

                    <div class="layout-topbar-action hidden lg:block" @click="openNotificationDrawer">
                        <OverlayBadge>
                            <Bell :size="18" class="bell-animation" />
                        </OverlayBadge>

                    </div>

                    <div
                        class=" hidden lg:block ml-1"
                        @click="openProfileDrawer">
                        <Avatar :style="{ width: AVATAR_SIZES.MEDIUM + 'px', height: AVATAR_SIZES.MEDIUM + 'px' }"
                                class="overflow-hidden rounded-sm"
                                v-bind="avatarProps" />
                    </div>
                </div>
            </template>
        </div>
    </div>

    <!-- 极简消息通知抽屉 -->
    <NotificationDrawer
        v-model:visible="notificationDrawerVisible"
        :notifications="notifications"
        @mark-read="markAsRead"
        @delete="deleteNotification"
        @mark-all-read="markAllAsRead"
        @clear-all="clearAllNotifications"
        @view-all="viewAllMessages" />

    <!-- 用户资料抽屉 -->
    <Drawer v-model:visible="profileDrawerVisible" :style="{ width: layoutStore.isMobile ? '100vw' : '50rem' }"
            class="profile-drawer" header="Profile"
            position="right">
        <UserProfile />
    </Drawer>

</template>


<style lang="scss" scoped>
.bell-animation {
  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.05);
  }
}

// 消息通知抽屉样式
.notification-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 40px 20px;
}

.empty-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--surface-100);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color-secondary);
  margin-bottom: 12px;
}

.empty-text {
  color: var(--text-color-secondary);
  font-size: 14px;
  margin: 0;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.message-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 20px;
  margin: 0 8px 4px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: var(--surface-hover);

    .message-actions {
      opacity: 1;
    }
  }

  &.is-unread {
    background: var(--surface-50);

    &::before {
      content: '';
      position: absolute;
      left: 8px;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--primary-color);
    }

    .message-title {
      font-weight: 600;
    }
  }
}

.message-main {
  flex: 1;
  min-width: 0;
  padding-left: 12px;
}

.message-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.message-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.message-time {
  font-size: 11px;
  color: var(--text-color-secondary);
  margin-left: 12px;
  flex-shrink: 0;
}

.message-text {
  font-size: 13px;
  color: var(--text-color-secondary);
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.message-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
  margin-left: 8px;
}

.btn-action {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &.btn-read {
    color: var(--green-500);

    &:hover {
      background: var(--green-50);
      color: var(--green-600);
    }
  }

  &.btn-delete {
    color: var(--text-color-secondary);

    &:hover {
      background: var(--red-50);
      color: var(--red-500);
    }
  }
}

// 移动端适配
@media (max-width: 640px) {
  .message-actions {
    opacity: 1;
  }

  .message-item {
    margin: 0 4px 4px;
    padding: 12px 16px;
  }
}

// 暗色主题适配
:global(.dark) {
  .empty-icon {
    background: var(--surface-800);
  }

  .message-item.is-unread {
    background: rgba(var(--primary-400), 0.1);
  }

  .btn-action.btn-read:hover {
    background: rgba(var(--green-400), 0.2);
  }

  .btn-action.btn-delete:hover {
    background: rgba(var(--red-400), 0.2);
  }
}
</style>
