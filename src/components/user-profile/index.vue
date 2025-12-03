<script setup>
import { ref, computed } from 'vue';
import Avatar from 'primevue/avatar';
import DatePicker from 'primevue/datepicker';

// Props
defineProps({
    user: {
        type: Object,
        default: () => ({
            name: 'Gene Russell',
            phone: '(406) 555-0120',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            stats: {
                progress: 23,
                overdue: 6,
                allDeals: 38
            }
        })
    },
    events: {
        type: Array,
        default: () => [
            {
                id: 1,
                time: '1:00 PM - 2:00 PM',
                title: 'Meeting with Alfredo Rhiel Madsen',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
            },
            {
                id: 2,
                time: '2:00 PM - 3:00 PM',
                title: 'Team Sync'
            },
            {
                id: 3,
                time: '5:00 PM - 6:00 PM',
                title: 'Team Sync'
            },
            {
                id: 4,
                time: '7:00 PM - 7:30 PM',
                title: 'Meeting with Engineering managers'
            }
        ]
    }
});

// 响应式数据
const selectedDate = ref(new Date());

// 计算属性
const formattedDate = computed(() => {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return selectedDate.value.toLocaleDateString('en-US', options);
});
</script>

<template>
    <div class="user-profile">
        <!-- 用户信息头部 -->
        <div class="profile-header">
            <div class="profile-avatar">
                <Avatar :image="user.avatar" size="xlarge" shape="circle" class="profile-avatar-img" />
            </div>

            <div class="profile-info">
                <h2 class="profile-name">{{ user.name }}</h2>
                <p class="profile-phone">{{ user.phone }}</p>
            </div>
        </div>

        <!-- 统计数据 -->
        <div class="profile-stats">
            <div class="stat-item progress">
                <div class="stat-number">{{ user.stats.progress }}</div>
                <div class="stat-label">Progress</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ user.stats.overdue }}</div>
                <div class="stat-label">Overdue</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ user.stats.allDeals }}</div>
                <div class="stat-label">All deals</div>
            </div>
        </div>

        <!-- 日历 -->
        <div class="profile-calendar">
            <DatePicker v-model="selectedDate" inline show-week class="profile-datepicker" />
        </div>

        <!-- 选中日期显示 -->
        <div class="selected-date">
            {{ formattedDate }}
        </div>

        <!-- 日程安排 -->
        <div class="profile-events">
            <div v-for="event in events" :key="event.id" class="event-item">
                <div class="event-time">{{ event.time }}</div>
                <div class="event-content">
                    <div class="event-title">{{ event.title }}</div>
                    <Avatar v-if="event.avatar" :image="event.avatar" size="small" shape="circle" class="event-avatar" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.user-profile {
    background: var(--surface-card);
    border-radius: 12px;
    padding: 1.5rem;
    width: 100%;
    color: var(--text-color);
}

/* 用户信息头部 */
.profile-header {
    text-align: center;
    margin-bottom: 2rem;
}

.profile-avatar {
    margin-bottom: 1rem;
}

.profile-avatar-img {
    width: 80px;
    height: 80px;
}

.profile-name {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: var(--text-color);
}

.profile-phone {
    font-size: 0.875rem;
    color: var(--text-color-secondary);
    margin: 0;
}

/* 统计数据 */
.profile-stats {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
    padding: 0 1rem;
}

.stat-item {
    text-align: center;
}

.stat-number {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-color);
    margin-bottom: 0.25rem;
}

.stat-item.progress .stat-number {
    color: #ef4444;
}

.stat-label {
    font-size: 0.75rem;
    color: var(--text-color-secondary);
    text-transform: capitalize;
}

/* 日历 */
.profile-calendar {
    margin-bottom: 1.5rem;
}

.profile-datepicker {
    width: 100%;
}

.profile-datepicker :deep(.p-datepicker) {
    width: 100%;
    border: none;
    box-shadow: none;
    background: transparent;
}

.profile-datepicker :deep(.p-datepicker-table) {
    width: 100%;
    font-size: 1rem;
}

.profile-datepicker :deep(.p-datepicker-header) {
    padding: 0.5rem;
    border-bottom: 1px solid var(--surface-border);
    margin-bottom: 0.5rem;
}

.profile-datepicker :deep(.p-datepicker-title) {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-color);
}

.profile-datepicker :deep(.p-datepicker-prev),
.profile-datepicker :deep(.p-datepicker-next) {
    width: 2rem;
    height: 2rem;
    color: var(--text-color-secondary);
}

.profile-datepicker :deep(.p-datepicker-weekday) {
    font-size: 0.875rem;
    color: var(--text-color-secondary);
    font-weight: 500;
    padding: 0.5rem;
}

.profile-datepicker :deep(.p-datepicker-day) {
    font-size: 1rem;
    border: none;
    border-radius: 6px;
    transition: all 0.2s;
}

.profile-datepicker :deep(.p-datepicker-day:hover) {
    background: var(--surface-hover);
}

.profile-datepicker :deep(.p-datepicker-day.p-datepicker-today) {
    background: #22c55e;
    color: white;
    font-weight: 600;
}

.profile-datepicker :deep(.p-datepicker-day.p-datepicker-selected) {
    background: var(--primary-color);
    color: var(--primary-color-text);
}

/* 选中日期 */
.selected-date {
    font-size: 0.875rem;
    color: var(--text-color);
    margin-bottom: 1.5rem;
    padding: 0.75rem;
    background: var(--surface-ground);
    border-radius: 8px;
    text-align: center;
}

/* 日程安排 */
.profile-events {
    space-y: 1rem;
}

.event-item {
    margin-bottom: 1rem;
}

.event-time {
    font-size: 0.75rem;
    color: var(--text-color-secondary);
    margin-bottom: 0.25rem;
}

.event-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.event-title {
    font-size: 0.875rem;
    color: var(--text-color);
    flex: 1;
}

.event-avatar {
    width: 24px;
    height: 24px;
    margin-left: 0.5rem;
}
</style>
