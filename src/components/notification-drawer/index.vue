<!--
 * @Description: 极简消息通知抽屉组件
 * @Author: weipc
 * @Date: 2025-01-13
-->
<template>
    <CustomDrawer :show-default-footer="true" :visible="visible" custom-width="400px" style="--p-drawer-content-padding: 0" header="通知" position="right" @update:visible="$emit('update:visible', $event)">
        <!-- 消息内容区域 -->
        <div class="notification-container">
            <!-- 消息列表 -->
            <div class="notifications">
                <!-- 空状态 -->
                <div v-if="notifications.length === 0" class="empty">
                    <Bell :size="24" class="empty-icon" />
                    <span class="empty-text">暂无通知</span>
                </div>

                <!-- 消息列表 -->
                <div v-else class="list">
                    <div v-for="notification in notifications" :key="notification.id" class="item-container">
                        <div :class="['item', { unread: !notification.isRead }]" @click="markAsRead(notification.id)">
                            <div class="content">
                                <div class="header">
                                    <div class="title">{{ notification.title }}</div>
                                    <div class="time">{{ notification.time }}</div>
                                </div>
                                <div class="message">{{ notification.message }}</div>
                            </div>

                            <div class="item-actions">
                                <button v-if="!notification.isRead" class="btn read" title="标记已读" @click.stop="markAsRead(notification.id)">
                                    <Check :size="14" />
                                </button>
                                <button class="btn delete" title="删除" @click.stop="deleteNotification(notification.id)">
                                    <Trash2 :size="14" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 底部操作按钮 -->
        </div>
        <template #footer>
            <div class="footer-actions">
                <div class="left-actions">
                    <Button @click="viewAllMessages">
                        <MessageSquare :size="14" />
                        查看所有消息
                    </Button>
                </div>
                <div class="right-actions">
                    <Button v-if="unreadCount > 0" @click="markAllAsRead">
                        <CheckCheck :size="14" />
                        全部已读
                    </Button>
                    <Button severity="secondary" @click="clearAll">
                        <Trash2 :size="14" />
                        清空
                    </Button>
                </div>
            </div>
        </template>
    </CustomDrawer>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { CustomDrawer } from '@/components';
import { Bell, Check, CheckCheck, MessageSquare, Trash2 } from 'lucide-vue-next';
import Button from 'primevue/button';

interface Notification {
    id: number;
    title: string;
    message: string;
    time: string;
    isRead: boolean;
}

interface Props {
    visible: boolean;
    notifications: Notification[];
}

const props = withDefaults(defineProps<Props>(), {
    visible: false,
    notifications: () => []
});

const emit = defineEmits<{
    'update:visible': [value: boolean];
    'mark-read': [id: number];
    delete: [id: number];
    'mark-all-read': [];
    'clear-all': [];
    'view-all': [];
}>();

const unreadCount = computed(() => {
    return props.notifications.filter((n) => !n.isRead).length;
});

const markAsRead = (id: number) => {
    emit('mark-read', id);
};

const deleteNotification = (id: number) => {
    emit('delete', id);
};

const markAllAsRead = () => {
    emit('mark-all-read');
};

const clearAll = () => {
    emit('clear-all');
};

const viewAllMessages = () => {
    emit('view-all');
};
</script>

<style lang="scss" scoped>
// 主容器布局
.notification-container {
    height: 100%;
    display: flex;
    flex-direction: column;
}

// 通知列表区域
.notifications {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

// 空状态样式
.empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    gap: 16px;
    color: var(--text-color-secondary);
    padding: 60px 20px;

    .empty-icon {
        opacity: 0.6;
    }

    .empty-text {
        font-size: 14px;
        font-weight: 500;
    }
}

// 消息列表
.list {
    flex: 1;
    overflow-y: auto;
}

.item-container {
    @apply py-2 px-2 border-b border-dashed last:border-b-0 border-gray-100 dark:border-gray-700;
}

// 消息项样式 - 优化版
.item {
    @apply relative flex items-start px-3 py-4 rounded-lg cursor-pointer transition-all;

    &:hover {
        background: var(--surface-hover);

        .item-actions {
            opacity: 1;
        }
    }

    // 未读状态
    &.unread {
        &::before {
            content: '';
            position: absolute;
            left: 8px;
            top: 20px;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--primary-color);
        }

        .title {
            font-weight: 600;
            color: var(--text-color);
        }
    }
}

// 内容区域重新布局
.content {
    flex: 1;
    min-width: 0;
    padding-left: 16px;

    .header {
        @apply flex items-center mb-2 gap-2;
    }

    .title {
        font-size: 14px;
        font-weight: 500;
        color: var(--text-color);
        line-height: 1.4;
        min-width: 0;
    }

    .time {
        font-size: 11px;
        color: var(--text-color-secondary);
        opacity: 0.8;
        flex-shrink: 0;
        margin-top: 2px;
    }

    .message {
        font-size: 13px;
        color: var(--text-color-secondary);
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
}

// 消息项操作按钮
.item-actions {
    display: flex;
    gap: 6px;
    opacity: 0;
    transition: opacity 0.2s ease;
    margin-left: 12px;
    align-self: flex-start;
    margin-top: 2px;
}

.btn {
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
    color: var(--text-color-secondary);

    &:hover {
        background: var(--surface-100);
        color: var(--text-color);
    }

    &.read:hover {
        background: var(--green-50);
        color: var(--green-600);
    }

    &.delete:hover {
        background: var(--red-50);
        color: var(--red-500);
    }
}

// 底部操作区域
.footer-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--surface-0);
    margin-top: auto;
    flex-shrink: 0;
}

.left-actions {
    display: flex;
}

.right-actions {
    display: flex;
    gap: 8px;
}

// 移动端适配
@media (max-width: 640px) {
    .item-actions {
        opacity: 1;
    }

    .item {
        margin: 0 4px 2px;
        padding: 14px 16px;
    }

    .footer-actions {
        padding: 12px 16px;
        flex-direction: column;
        gap: 12px;
        align-items: stretch;

        .left-actions,
        .right-actions {
            justify-content: center;
        }
    }

    .action-btn {
        flex: 1;
        justify-content: center !important;
    }
}
</style>
