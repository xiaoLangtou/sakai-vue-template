<script setup lang="ts">
import { ChevronRightIcon, FolderIcon, UserIcon, XIcon } from 'lucide-vue-next';
import { computed, onMounted, ref, watch } from 'vue';

// 类型定义
interface Staff {
    idStaff: string;
    staffName: string;
    position?: string;
    isChecked: boolean;
    type: 'staff';
    parent?: string;
}

interface Department {
    id: string;
    name: string;
    children?: Department[];
    staffs?: Staff[];
    isChecked: boolean;
    type: 'department';
    parent?: string;
    level: number;
}

interface OrgData {
    children: Department[];
    staffs?: Staff[];
}

// Props
interface Props {
    data?: OrgData;
    multiple?: boolean;
    onlySelectPerson?: boolean;
    mode?: 'panel' | 'modal';
    visible?: boolean;
    title?: string;
}

const props = withDefaults(defineProps<Props>(), {
    multiple: true,
    onlySelectPerson: false,
    mode: 'panel',
    visible: false,
    title: '选择人员'
});

// Emits
const emit = defineEmits<{
    change: [selectedItems: (Staff | Department)[]];
    'update:visible': [visible: boolean];
    confirm: [selectedItems: (Staff | Department)[]];
    cancel: [];
}>();

// 响应式数据
const orgData = ref<OrgData>({ children: [] });
const allStaffList = ref<Staff[]>([]);
const currentLevel = ref<OrgData>({ children: [] });
const breadcrumbs = ref<Department[]>([]);
const selectedItems = ref<(Staff | Department)[]>([]);

// 搜索相关
const searchKeyword = ref('');
const searchResults = ref<(Staff | Department)[]>([]);
const isSearching = computed(() => searchKeyword.value.trim().length > 0);

// 弹窗可见性
const dialogVisible = computed({
    get: () => props.visible,
    set: (value: boolean) => emit('update:visible', value)
});

// 面包屑导航数据
const breadcrumbItems = computed(() => {
    return breadcrumbs.value.map((item, index) => ({
        label: item.name,
        index: index
    }));
});

// 工具函数
const getItemId = (item: Staff | Department): string => {
    return 'id' in item ? item.id : item.idStaff;
};

const getItemName = (item: Staff | Department): string => {
    return 'name' in item ? item.name : item.staffName;
};

// 初始化数据
const initializeData = (data: OrgData) => {
    // 添加 isChecked 属性和层级信息
    const processData = (items: Department[], level = 0, parentId?: string): Department[] => {
        return items.map((item) => {
            const processed: Department = {
                ...item,
                isChecked: false,
                type: 'department',
                level,
                parent: parentId
            };

            if (processed.staffs) {
                processed.staffs = processed.staffs.map((staff) => ({
                    ...staff,
                    isChecked: false,
                    type: 'staff',
                    parent: processed.id
                }));
            }

            if (processed.children) {
                processed.children = processData(processed.children, level + 1, processed.id);
            }

            return processed;
        });
    };

    orgData.value = {
        children: processData(data.children || []),
        staffs: data.staffs?.map((staff) => ({
            ...staff,
            isChecked: false,
            type: 'staff'
        }))
    };

    currentLevel.value = orgData.value;

    // 收集所有人员用于搜索
    collectAllStaff();
};

// 收集所有人员
const collectAllStaff = () => {
    const allStaff: Staff[] = [];

    const collectFromDept = (dept: Department) => {
        if (dept.staffs) {
            allStaff.push(...dept.staffs);
        }
        if (dept.children) {
            dept.children.forEach(collectFromDept);
        }
    };

    orgData.value.children.forEach(collectFromDept);
    if (orgData.value.staffs) {
        allStaff.push(...orgData.value.staffs);
    }

    // 去重
    const staffMap = new Map();
    allStaff.forEach((staff) => {
        if (!staffMap.has(staff.idStaff)) {
            staffMap.set(staff.idStaff, staff);
        }
    });

    allStaffList.value = Array.from(staffMap.values());
};

// 搜索功能
const handleSearch = () => {
    if (!searchKeyword.value.trim()) {
        searchResults.value = [];
        return;
    }

    const keyword = searchKeyword.value.toLowerCase();
    const results: (Staff | Department)[] = [];

    // 搜索人员
    allStaffList.value.forEach((staff) => {
        if (staff.staffName.toLowerCase().includes(keyword)) {
            results.push(staff);
        }
    });

    // 搜索部门
    const searchDepartments = (depts: Department[]) => {
        depts.forEach((dept) => {
            if (dept.name.toLowerCase().includes(keyword)) {
                results.push(dept);
            }
            if (dept.children) {
                searchDepartments(dept.children);
            }
        });
    };

    searchDepartments(orgData.value.children);
    searchResults.value = results;
};

const handleSearchChange = () => {
    if (!searchKeyword.value.trim()) {
        searchResults.value = [];
    } else {
        handleSearch();
    }
};

// 路径获取
const getItemPath = (item: Staff | Department) => {
    const parents = getParentPath(item);
    return parents.map((p) => p.name).join(' / ');
};

const getParentPath = (item: Staff | Department): Department[] => {
    const path: Department[] = [];

    const findParent = (id: string | undefined, depts: Department[]): Department | null => {
        for (const dept of depts) {
            if (dept.id === id) return dept;
            if (dept.children) {
                const found = findParent(id, dept.children);
                if (found) return found;
            }
        }
        return null;
    };

    let currentParentId = item.parent;
    while (currentParentId) {
        const parent = findParent(currentParentId, orgData.value.children);
        if (parent) {
            path.unshift(parent);
            currentParentId = parent.parent;
        } else {
            break;
        }
    }

    return path;
};

// 导航功能
const enterDepartment = (dept: Department) => {
    breadcrumbs.value.push(dept);
    currentLevel.value = dept as any;
};

const navigateToLevel = (index: number) => {
    if (index === -1) {
        // 返回根目录
        breadcrumbs.value = [];
        currentLevel.value = orgData.value;
    } else {
        breadcrumbs.value = breadcrumbs.value.slice(0, index + 1);
        currentLevel.value = breadcrumbs.value[index] as any;
    }
};

// 选择逻辑
const shouldDisableCheckbox = (item: Staff | Department) => {
    if (props.onlySelectPerson && item.type === 'department') {
        return true;
    }
    return false;
};

const handleCheckChange = (checked: boolean, item: Staff | Department) => {
    console.log(checked, item);
    if (checked) {
        if (!props.multiple) {
            // 单选模式：清除其他选择
            selectedItems.value.forEach((selected) => {
                if (getItemId(selected) !== getItemId(item)) {
                    selected.isChecked = false;
                }
            });
            selectedItems.value = [item];
        } else {
            // 多选模式：添加到已选列表
            const exists = selectedItems.value.find((selected) => getItemId(selected) === getItemId(item));
            if (!exists) {
                selectedItems.value.push(item);
            }
        }
    } else {
        // 取消选择：从已选列表中移除
        const index = selectedItems.value.findIndex((selected) => getItemId(selected) === getItemId(item));
        if (index > -1) {
            selectedItems.value.splice(index, 1);
        }
    }
    console.log(item.isChecked);
    emit('change', selectedItems.value);
};

const handleSearchItemClick = (item: Staff | Department) => {
    if (item.type === 'department') {
        // 导航到该部门
        const path = getParentPath(item);
        breadcrumbs.value = [...path, item as Department];
        currentLevel.value = item as any;
        searchKeyword.value = '';
        searchResults.value = [];
    }
};

const removeSelected = (item: Staff | Department) => {
    item.isChecked = false;
    const index = selectedItems.value.findIndex((selected) => getItemId(selected) === getItemId(item));
    if (index > -1) {
        selectedItems.value.splice(index, 1);
    }
    emit('change', selectedItems.value);
};

const clearAll = () => {
    selectedItems.value.forEach((item) => {
        item.isChecked = false;
    });
    selectedItems.value = [];
    emit('change', selectedItems.value);
};

// Modal handlers
const handleCancel = () => {
    emit('update:visible', false);
    emit('cancel');
};

const handleConfirm = () => {
    emit('confirm', selectedItems.value);
    emit('update:visible', false);
};

// 监听数据变化
watch(
    () => props.data,
    (newData) => {
        if (newData) {
            initializeData(newData);
        }
    },
    { immediate: true }
);

onMounted(() => {
    if (props.data) {
        initializeData(props.data);
    }
});

defineOptions({
    name: 'OrgSelector'
});
</script>

<template>
    <!-- 面板模式 -->
    <div v-if="mode === 'panel'" class="org-selector">
        <div class="org-selector-content">
            <!-- 搜索框 -->
            <div class="search-section mb-4">
                <IconField icon-position="left">
                    <InputIcon class="pi pi-search" />
                    <InputText v-model="searchKeyword" placeholder="搜索部门或人员" class="w-full" @input="handleSearchChange" @keyup.enter="handleSearch" />
                </IconField>
            </div>

            <div class="selector-body flex gap-4">
                <!-- 左侧：组织架构树 -->
                <div class="org-tree flex-1">
                    <!-- 面包屑导航 -->
                    <div v-if="breadcrumbs.length > 0" class="breadcrumb mb-3">
                        <Breadcrumb :model="breadcrumbItems" class="!p-0">
                            <template #item="{ item, props }">
                                <a v-bind="props.action" class="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400" @click="navigateToLevel(item.index)">
                                    {{ item.label }}
                                </a>
                            </template>
                        </Breadcrumb>
                    </div>

                    <!-- 搜索结果 -->
                    <div v-if="isSearching" class="search-results">
                        <div class="search-title mb-2 text-sm text-gray-600 dark:text-gray-400">搜索结果 ({{ searchResults.length }})</div>
                        <div class="search-list max-h-96 overflow-auto">
                            <div v-for="item in searchResults" :key="getItemId(item)" class="search-item flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors" @click="handleSearchItemClick(item)">
                                <Checkbox v-model="item.isChecked" :binary="true" :disabled="shouldDisableCheckbox(item)" @change="(event) => handleCheckChange((event.target as HTMLInputElement).checked, item)" />
                                <div class="ml-2 flex-1">
                                    <div class="item-name text-gray-900 dark:text-gray-100">{{ getItemName(item) }}</div>
                                    <div class="item-path text-xs text-gray-500 dark:text-gray-400">
                                        {{ getItemPath(item) }}
                                    </div>
                                </div>
                                <div class="item-type text-xs text-blue-500 dark:text-blue-400">
                                    {{ item.type === 'department' ? '部门' : '人员' }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 正常树状结构 -->
                    <div v-else class="org-tree-structure">
                        <!-- 部门列表 -->
                        <div v-if="currentLevel.children?.length > 0" class="departments mb-4">
                            <div class="section-title text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 pb-1 border-b border-gray-100 dark:border-gray-700">部门</div>
                            <div v-for="dept in currentLevel.children" :key="dept.id" class="dept-item flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors">
                                <Checkbox v-model="dept.isChecked" :binary="true" :disabled="shouldDisableCheckbox(dept)" @change="(event) => handleCheckChange((event.target as HTMLInputElement).checked, dept)" @click.stop />
                                <div class="ml-2 flex-1" @click="enterDepartment(dept)">
                                    <div class="flex items-center">
                                        <FolderIcon class="w-4 h-4 text-blue-500 dark:text-blue-400 mr-2" />
                                        <span class="text-gray-900 dark:text-gray-100">{{ dept.name }}</span>
                                        <span class="ml-auto text-xs text-gray-500 dark:text-gray-400"> {{ dept.staffs?.length || 0 }}人 </span>
                                    </div>
                                </div>
                                <ChevronRightIcon class="w-4 h-4 text-gray-400 dark:text-gray-500" @click="enterDepartment(dept)" />
                            </div>
                        </div>

                        <!-- 人员列表 -->
                        <div v-if="currentLevel.staffs && currentLevel.staffs.length > 0" class="staff-list">
                            <div class="section-title text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 pb-1 border-b border-gray-100 dark:border-gray-700">人员 ({{ currentLevel.staffs.length }})</div>
                            <div v-for="staff in currentLevel.staffs" :key="staff.idStaff" class="staff-item flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors">
                                <Checkbox v-model="staff.isChecked" :binary="true" :disabled="shouldDisableCheckbox(staff)" @change="(event) => handleCheckChange((event.target as HTMLInputElement).checked, staff)" />
                                <div class="ml-2 flex-1">
                                    <div class="flex items-center">
                                        <UserIcon class="w-4 h-4 text-green-500 dark:text-green-400 mr-2" />
                                        <span class="text-gray-900 dark:text-gray-100">{{ staff.staffName }}</span>
                                    </div>
                                    <div class="text-xs text-gray-500 dark:text-gray-400">
                                        {{ staff.position || '暂无职位' }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 右侧：已选列表 -->
                <div class="selected-panel w-80 border-l border-gray-200 dark:border-gray-700 pl-4">
                    <div class="panel-header flex items-center justify-between mb-3">
                        <span class="font-medium text-gray-900 dark:text-gray-100">已选 ({{ selectedItems.length }})</span>
                        <Button v-if="selectedItems.length > 0" link size="small" class="dark:text-blue-400" @click="clearAll"> 清空 </Button>
                    </div>

                    <div class="selected-list max-h-96 overflow-auto">
                        <div v-for="item in selectedItems" :key="getItemId(item)" class="selected-item flex items-center p-2 bg-blue-50 dark:bg-blue-900/30 rounded mb-2 transition-colors">
                            <div class="flex-1">
                                <div class="item-name text-sm text-gray-900 dark:text-gray-100">{{ getItemName(item) }}</div>
                                <div class="item-type text-xs text-gray-500 dark:text-gray-400">
                                    {{ item.type === 'department' ? '部门' : '人员' }}
                                </div>
                            </div>
                            <XIcon class="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-pointer hover:text-red-500 dark:hover:text-red-400 transition-colors" @click="removeSelected(item)" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 弹窗模式 -->
    <Dialog v-else v-model:visible="dialogVisible" :header="title" :style="{ width: '900px' }" modal class="org-selector-modal" @hide="handleCancel">
        <div class="org-selector-modal-content">
            <!-- 搜索框 -->
            <div class="search-section mb-4">
                <IconField icon-position="left">
                    <InputIcon class="pi pi-search" />
                    <InputText v-model="searchKeyword" placeholder="搜索部门或人员" class="w-full" @input="handleSearchChange" @keyup.enter="handleSearch" />
                </IconField>
            </div>

            <div class="selector-body flex gap-4 min-h-80">
                <!-- 左侧：组织架构树 -->
                <div class="org-tree flex-1">
                    <!-- 面包屑导航 -->
                    <div v-if="breadcrumbs.length > 0" class="breadcrumb mb-3">
                        <Breadcrumb :model="breadcrumbItems" class="!p-0">
                            <template #item="{ item, props }">
                                <a v-bind="props.action" class="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400" @click="navigateToLevel(item.index)">
                                    {{ item.label }}
                                </a>
                            </template>
                        </Breadcrumb>
                    </div>

                    <!-- 搜索结果 -->
                    <div v-if="isSearching" class="search-results">
                        <div class="search-title mb-2 text-sm text-gray-600 dark:text-gray-400">搜索结果 ({{ searchResults.length }})</div>
                        <div class="search-list max-h-80 overflow-auto">
                            <div v-for="item in searchResults" :key="getItemId(item)" class="search-item flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors" @click="handleSearchItemClick(item)">
                                <Checkbox v-model="item.isChecked" :binary="true" :disabled="shouldDisableCheckbox(item)" @change="(event) => handleCheckChange((event.target as HTMLInputElement).checked, item)" />
                                <div class="ml-2 flex-1">
                                    <div class="item-name text-gray-900 dark:text-gray-100">{{ getItemName(item) }}</div>
                                    <div class="item-path text-xs text-gray-500 dark:text-gray-400">
                                        {{ getItemPath(item) }}
                                    </div>
                                </div>
                                <div class="item-type text-xs text-blue-500 dark:text-blue-400">
                                    {{ item.type === 'department' ? '部门' : '人员' }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 正常树状结构 -->
                    <div v-else class="org-tree-structure">
                        <!-- 部门列表 -->
                        <div v-if="currentLevel.children?.length > 0" class="departments mb-4">
                            <div class="section-title text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 pb-1 border-b border-gray-100 dark:border-gray-700">部门</div>
                            <div v-for="dept in currentLevel.children" :key="dept.id" class="dept-item flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors">
                                <Checkbox v-model="dept.isChecked" :binary="true" :disabled="shouldDisableCheckbox(dept)" @change="(event) => handleCheckChange((event.target as HTMLInputElement).checked, dept)" @click.stop />
                                <div class="ml-2 flex-1" @click="enterDepartment(dept)">
                                    <div class="flex items-center">
                                        <FolderIcon class="w-4 h-4 text-blue-500 dark:text-blue-400 mr-2" />
                                        <span class="text-gray-900 dark:text-gray-100">{{ dept.name }}</span>
                                        <span class="ml-auto text-xs text-gray-500 dark:text-gray-400"> {{ dept.staffs?.length || 0 }}人 </span>
                                    </div>
                                </div>
                                <ChevronRightIcon class="w-4 h-4 text-gray-400 dark:text-gray-500" @click="enterDepartment(dept)" />
                            </div>
                        </div>

                        <!-- 人员列表 -->
                        <div v-if="currentLevel.staffs && currentLevel.staffs.length > 0" class="staff-list">
                            <div class="section-title text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 pb-1 border-b border-gray-100 dark:border-gray-700">人员 ({{ currentLevel.staffs.length }})</div>
                            <div v-for="staff in currentLevel.staffs" :key="staff.idStaff" class="staff-item flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors">
                                <Checkbox v-model="staff.isChecked" :binary="true" :disabled="shouldDisableCheckbox(staff)" @change="(event) => handleCheckChange((event.target as HTMLInputElement).checked, staff)" />
                                <div class="ml-2 flex-1">
                                    <div class="flex items-center">
                                        <UserIcon class="w-4 h-4 text-green-500 dark:text-green-400 mr-2" />
                                        <span class="text-gray-900 dark:text-gray-100">{{ staff.staffName }}</span>
                                    </div>
                                    <div class="text-xs text-gray-500 dark:text-gray-400">
                                        {{ staff.position || '暂无职位' }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 右侧：已选列表 -->
                <div class="selected-panel w-80 border-l border-gray-200 dark:border-gray-700 pl-4">
                    <div class="panel-header flex items-center justify-between mb-3">
                        <span class="font-medium text-gray-900 dark:text-gray-100">已选 ({{ selectedItems.length }})</span>
                        <Button v-if="selectedItems.length > 0" link size="small" class="dark:text-blue-400" @click="clearAll"> 清空 </Button>
                    </div>

                    <div class="selected-list max-h-80 overflow-auto">
                        <div v-for="item in selectedItems" :key="getItemId(item)" class="selected-item flex items-center p-2 bg-blue-50 dark:bg-blue-900/30 rounded mb-2 transition-colors">
                            <div class="flex-1">
                                <div class="item-name text-sm text-gray-900 dark:text-gray-100">{{ getItemName(item) }}</div>
                                <div class="item-type text-xs text-gray-500 dark:text-gray-400">
                                    {{ item.type === 'department' ? '部门' : '人员' }}
                                </div>
                            </div>
                            <XIcon class="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-pointer hover:text-red-500 dark:hover:text-red-400 transition-colors" @click="removeSelected(item)" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- 弹窗底部操作栏 -->
            <div class="modal-footer flex justify-between items-center pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <div class="selected-count text-sm text-gray-600 dark:text-gray-400">已选择 {{ selectedItems.length }} 项</div>
                <div class="flex gap-2">
                    <Button @click="handleCancel">取消</Button>
                    <Button severity="primary" @click="handleConfirm">确定</Button>
                </div>
            </div>
        </div>
    </Dialog>
</template>

<style lang="scss" scoped>
.org-selector {
    @apply bg-white rounded-lg border p-4;
    height: 600px;
}

.selector-content {
    height: calc(100% - 60px);
}

.org-tree {
    @apply overflow-auto;
}

.search-results {
    @apply max-h-96 overflow-auto;
}

.search-item,
.dept-item,
.staff-item {
    @apply transition-colors duration-200;
}

.search-item:hover,
.dept-item:hover,
.staff-item:hover {
    @apply bg-blue-50;
}

.selected-panel {
    @apply overflow-auto;
}

.selected-list {
    @apply max-h-96 overflow-auto;
}

.breadcrumb {
    @apply pb-2 border-b border-gray-200;
}

.section-title {
    @apply border-b border-gray-100 pb-1;
}
</style>
