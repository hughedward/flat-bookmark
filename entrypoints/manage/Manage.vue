<template>
    <div class="container">
        <!-- <header class="header">
            <h1>书签管理</h1>
            <button class="primary-btn" @click="getBookmarks">刷新书签</button>
        </header> -->

        <!-- 顶层链接 -->
        <section v-if="state.firstLevelLinks.length" class="section">
            <div class="section-header">
                <!-- <h2>首层链接</h2> -->
                <button class="icon-btn" @click="openAddModal(qybFolder.id)">
                    <span class="icon">+</span>
                </button>
            </div>
            <div class="grid-container">
                <div v-for="bookmark in state.firstLevelLinks" :key="bookmark.id" class="card">
                    <div class="card-header">
                        <div class="card-img">
                            <img v-if="getFaviconUrl(bookmark.url)" :src="getFaviconUrl(bookmark.url)"
                                :alt="bookmark.title"
                                @error="$event.target.parentElement.querySelector('.text-icon').style.display = 'flex'; $event.target.style.display = 'none'"
                                class="favicon">
                            <div class="text-icon" :style="{ display: getFaviconUrl(bookmark.url) ? 'none' : 'flex' }">
                                {{ getFirstChar(bookmark.title) }}
                            </div>
                        </div>
                        <div class="card-content">
                            <a :href="bookmark.url" target="_blank" class="card-title">
                                {{ bookmark.title }}
                            </a>
                        </div>
                    </div>
                    <div class="card-actions">
                        <button class="icon-btn small" @click="openEditModal(bookmark, qybFolder.id)">✏️</button>
                        <button class="icon-btn small" @click="deleteBookmark(bookmark)">🗑️</button>
                    </div>
                </div>
            </div>
        </section>
        <!-- 文件夹区域 -->
        <section v-if="state.firstLevelFolders.length" class="section">
            <!-- <hr class="divider_line" /> -->
            <div class="section-header">
                <!-- <h2>文件夹</h2> -->
                <button class="icon-btn" @click="showCreateFolderDialog">
                    <span class="icon">+</span>
                </button>
            </div>
            <div v-for="folder in state.firstLevelFolders" :key="folder.id" class="folder-section">
                <div class="section-header">
                    <div class="folder-title">
                        <!-- <span class="folder-icon">📁</span> -->
                        {{ folder.title }}
                    </div>
                    <div class="folder-actions">
                        <button class="icon-btn small" @click="openAddModal(folder.id)">+</button>
                    </div>
                </div>
                <div class="list-container">
                    <div v-for="item in folder.children" :key="item.id" class="list-item">
                        <div class="list-content">
                            <div class="card-img-small">
                                <img v-if="getFaviconUrl(item.url)" :src="getFaviconUrl(item.url)" :alt="item.title"
                                    @error="$event.target.parentElement.querySelector('.text-icon-small').style.display = 'flex'; $event.target.style.display = 'none'"
                                    class="favicon">
                                <div class="text-icon-small"
                                    :style="{ display: getFaviconUrl(item.url) ? 'none' : 'flex' }">
                                    {{ getFirstChar(item.title) }}
                                </div>
                            </div>
                            <a :href="item.url" target="_blank" class="list-title">
                                {{ item.title }}
                            </a>
                        </div>
                        <div class="list-actions">
                            <button class="context-menu-trigger"
                                @click.prevent="showContextMenu($event, item)">⋮</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <div v-if="showMenu" class="context-menu" :style="menuPosition">
            <div class="menu-item" @click="openEditModal(selectedItem, selectedItem.parentId)">
                <span>✏️ 编辑</span>
            </div>
            <div class="menu-item" @click="deleteBookmark(selectedItem)">
                <span>🗑️ 删除</span>
            </div>
        </div>
        <!-- 添加模态框 -->
        <div v-if="showAddModal" class="modal-overlay" @click="closeAddModal">
            <div class="modal-content" @click.stop>
                <h3>添加新书签</h3>
                <div class="form-group">
                    <label>标题：</label>
                    <input type="text" v-model="newBookmark.title" placeholder="请输入标题">
                </div>
                <div class="form-group">
                    <label>URL：</label>
                    <input type="url" v-model="newBookmark.url" placeholder="请输入URL">
                </div>
                <div class="modal-actions">
                    <button class="btn cancel" @click="closeAddModal">取消</button>
                    <button class="btn primary" @click="addNewBookmark(qybFolder)">确定</button>
                </div>
            </div>
        </div>
        <!-- 编辑模态框 -->
        <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
            <div class="modal-content" @click.stop>
                <h3>编辑书签</h3>
                <div class="form-group">
                    <label>标题：</label>
                    <input type="text" v-model="editBookmark.title" placeholder="请输入标题">
                </div>
                <div class="form-group">
                    <label>URL：</label>
                    <input type="url" v-model="editBookmark.url" placeholder="请输入URL">
                </div>
                <div class="modal-actions">
                    <button class="btn cancel" @click="closeEditModal">取消</button>
                    <button class="btn primary" @click="editEditBookmark(editBookmark)">确定</button>
                </div>
            </div>
        </div>
    </div>

    <!-- 新建文件夹对话框 -->
    <div v-if="showFolderDialog" class="dialog-overlay">
        <div class="dialog">
            <h3>新建文件夹</h3>
            <div class="form-group">
                <label>文件夹名称：</label>
                <input v-model="newFolder.title" type="text" placeholder="请输入文件夹名称" @keyup.enter="createFolder">
            </div>
            <div class="dialog-actions">
                <button @click="closeFolderDialog">取消</button>
                <button @click="createFolder" :disabled="!newFolder.title.trim()">
                    创建
                </button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
// import { mockBookmarks } from './mock' 
const qybFolder = ref(null);

// 核心变量，就这俩
// 使用 reactive 定义状态
const state = reactive({
    firstLevelLinks: [],
    firstLevelFolders: []
});

// 主要逻辑 核心入口
async function getBookmarks() {
    state.firstLevelLinks = []
    state.firstLevelFolders = []
    try {
        // 获取 qyb 文件夹
        const findQybFolder = await chrome.bookmarks.search({ title: 'qyb' });
        qybFolder.value = findQybFolder?.find(item => !item.url);

        if (qybFolder.value) {
            await loadQybBookmarks(qybFolder);
        } else {
            alert('can not find "qyb" folder, add one and refresh');
            return;
        }
        // if (mockBookmarks) {
        //     await loadMockBookmarks(mockBookmarks);
        // }
        console.log('firstLevelLinks: ===>', state.firstLevelLinks);
        console.log('firstLevelFolders: ===>', state.firstLevelFolders);
        return [state.firstLevelLinks, state.firstLevelFolders];
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
    }
}

onMounted(() => {
    getBookmarks();
});


// loadBookmarks
async function loadQybBookmarks(qybFolder: chrome.bookmarks.BookmarkTreeNode) {
    // 获取顶层项目
    // 处理每个子项
    const children = await chrome.bookmarks.getChildren(qybFolder.value.id);
    for (const child of children) {
        if (child.url) {
            state.firstLevelLinks.push(child);
        } else {
            const grandchildren = await chrome.bookmarks.getChildren(child.id);
            state.firstLevelFolders.push({
                ...child,
                children: grandchildren
            });
        }
    }
}
// 加载 mock 数据
async function loadMockBookmarks(mockBookmarks: chrome.bookmarks.BookmarkTreeNode[]) {
    for (const item of mockBookmarks) {
        if (item.url) {
            state.firstLevelLinks.push(item);
        } else {
            state.firstLevelFolders.push(item);
        }
    }
}

// 修改获取网站图标的函数
function getFaviconUrl(url: string) {
    try {
        const urlObj = new URL(url);
        return `${urlObj.origin}/favicon.ico`;
    } catch {
        return null;
    }
}

// 获取首字母的函数
function getFirstChar(title: string) {
    return title.charAt(0).toUpperCase();
}

// 添加处理图片加载错误的函数
// function handleImageError(event: Event, bookmark: any) {
//     event.target.style.display = 'none';
//     bookmark.showFallback = true;
// }

// 添加菜单相关的响应式变量
const showMenu = ref(false);
const menuPosition = ref({ top: '0px', left: '0px' });
const selectedItem = ref(null);

// 显示上下文菜单
function showContextMenu(event: MouseEvent, item: any) {
    event.preventDefault();
    selectedItem.value = item;
    showMenu.value = true;
    menuPosition.value = {
        top: `${event.clientY}px`,
        left: `${event.clientX}px`
    };

    // 点击其他地方关闭菜单
    const closeMenu = () => {
        showMenu.value = false;
        document.removeEventListener('click', closeMenu);
    };
    setTimeout(() => {
        document.addEventListener('click', closeMenu);
    }, 0);
}

// 添加模态框相关的响应式变量
const showAddModal = ref(false);
const newBookmark = ref({
    title: '',
    url: ''
});
// 编辑模态框相关的响应式变量
const showEditModal = ref(false);
// 编辑模态框相关的响应式变量
const editBookmark = ref({
    id: '',
    title: '',
    url: '',
    parentId: '' // 添加 parentId 字段
});

// 打开模态框
function openAddModal(folderId?: string) {
    showAddModal.value = true;
    newBookmark.value = {
        title: '',
        url: '',
        parentId: folderId || qybFolder.value.id // 如果有传入folderId就用它，否则用根目录id
    };
}
// 打开编辑模态框
// 打开编辑模态框时保存完整的书签信息
// 打开编辑模态框
function openEditModal(bookmark: any, parentId: string) {
    if (!bookmark.url) {
        alert('不能编辑文件夹');
        return;
    }

    showEditModal.value = true;
    editBookmark.value = {
        id: bookmark.id,
        title: bookmark.title,
        url: bookmark.url,
        parentId: parentId  // 使用传入的parentId
    };
}
// 关闭模态框
function closeAddModal() {
    showAddModal.value = false;
}
// 关闭编辑模态框
function closeEditModal() {
    showEditModal.value = false;
}



// 添加新书签
async function addNewBookmark() {
    try {
        if (!newBookmark.value.title || !newBookmark.value.url) {
            alert('请填写完整信息');
            return;
        }

        // 直接使用 newBookmark 中保存的 parentId
        await chrome.bookmarks.create({
            parentId: newBookmark.value.parentId,
            title: newBookmark.value.title,
            url: newBookmark.value.url
        });

        // 关闭模态框
        closeAddModal();
        // 刷新书签列表
        await getBookmarks();
    } catch (error) {
        console.error('Error adding bookmark:', error);
        alert('格式有误，添加失败');
    }
}

// editBookmark
// 修改编辑书签函数
// 修改编辑书签函数
async function editEditBookmark(bookmark: chrome.bookmarks.BookmarkTreeNode) {
    try {
        if (!editBookmark.value.title || !editBookmark.value.url) {
            alert('请填写完整信息');
            return;
        }

        // 确保有正确的 id
        if (!editBookmark.value.id) {
            throw new Error('书签ID不存在');
        }

        // 更新书签内容
        await chrome.bookmarks.update(editBookmark.value.id, {  // 使用 editBookmark.value.id 而不是 bookmark.id
            title: editBookmark.value.title,
            url: editBookmark.value.url
        });

        closeEditModal();
        await getBookmarks();
    } catch (error) {
        console.error('Error editing bookmark:', error);
        alert('编辑失败：' + error.message);
    }
}


// 删除书签
async function deleteBookmark(bookmark: chrome.bookmarks.BookmarkTreeNode) {
    // 弹窗询问，点击是，回调删除，点击否不变
    if (confirm('确定删除吗？')) {
        await chrome.bookmarks.remove(bookmark.id);
        await getBookmarks();
    }
}

// 创建文件夹
// 新增文件夹的响应式变量
const showFolderDialog = ref(false);
const newFolder = ref({
    parentId: '', // 当前所在目录的ID
    title: ''
});


// 显示新增文件夹对话框
function showCreateFolderDialog() {
    // alert('showCreateFolderDialog: ===>' + qybFolder.value.id);
    newFolder.value = {
        parentId: qybFolder.value.id,
        title: ''
    };
    showFolderDialog.value = true;
}

// 创建文件夹
async function createFolder() {
    try {
        if (!newFolder.value.title.trim()) {
            alert('请输入文件夹名称');
            return;
        }

        await chrome.bookmarks.create({
            parentId: newFolder.value.parentId,
            title: newFolder.value.title
            // 不提供 url，这样就会创建为文件夹
        });

        // 关闭对话框
        showFolderDialog.value = false;
        // 刷新书签列表
        await getBookmarks();
        // 提示成功
        // alert('创建成功');
    } catch (error) {
        console.error('创建文件夹失败:', error);
        alert('创建失败：' + error.message);
    }
}

// 关闭对话框
function closeFolderDialog() {
    showFolderDialog.value = false;
    newFolder.value = {
        parentId: '',
        title: ''
    };
}
</script>
<style scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.section {
    margin-bottom: 40px;
}

.section-header {
    display: flex;
    justify-content: left;
    align-items: center;
    margin-bottom: 20px;
    gap: 10px;

}

.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
}

.card {
    background: white;
    border-radius: 8px;
    box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.2s;
    padding: 12px;
}

.card:hover {
    transform: translateY(-2px);
}

.card-header {
    display: flex;
    align-items: center;
    gap: 12px;
}

.card-img {
    position: relative;
    min-width: 40px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card-img-small {
    position: relative;
    min-width: 20px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.favicon {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.text-icon {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
    border-radius: 4px;
    font-weight: bold;
    font-size: 16px;
}

.text-icon-small {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
    border-radius: 4px;
    font-weight: bold;
    font-size: 12px;
}

.card-content {
    flex: 1;
    min-width: 0;
    /* 防止文本溢出 */
}

.card-title {
    font-size: 14px;
    color: #333;
    text-decoration: none;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card-actions {
    margin-top: 8px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}

.divider_line {
    border: 1px solid #dddddd;
    margin: 20px 0;
}

.folders-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

.folder-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.folder-header {
    display: flex;
    align-items: center;
    padding: 12px;
    background: #f8f9fa;
    border-bottom: 1px solid #eee;
}


.folder-actions {
    display: flex;
    gap: 8px;
}

.folder-content {
    padding: 12px;
}

.folder-item {
    padding: 8px;
    border-bottom: 1px solid #eee;
}

.folder-item:last-child {
    border-bottom: none;
}

.primary-btn {
    padding: 8px 16px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.icon-btn {
    padding: 6px;
    background: transparent;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-btn.small {
    padding: 4px;
    font-size: 12px;
}

.icon-btn:hover {
    background: #f5f5f5;
}

.folder-section {
    margin-bottom: 30px;
}

.folder-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 100;
    text-shadow: 0 2px 4px #5a5858;
}

.folder-icon {
    font-size: 20px;
}

/* 移除不需要的样式
.folders-container,
.folder-card,
.folder-header,
.folder-content,
.folder-item {
    display: none;
} */

.list-container {
    display: flex;
    gap: 8px;
}

.list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px;
    background: white;
    border-radius: 4px;
    /* transition: background-color 0.2s; */
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
}

.list-item:hover {
    /* background-color: #f5f5f5; */
    transform: translateY(-2px);
}

.list-content {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
}

.list-title {
    color: #333;
    text-decoration: none;
    font-size: 14px;
    /*超过16个字符省略号  */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 16ch;
}

.context-menu-trigger {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 8px;
    color: #666;
}

.context-menu-trigger:hover {
    color: #333;
}

.context-menu {
    position: fixed;
    background: white;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    min-width: 120px;
}

.menu-item {
    padding: 8px 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
}

.menu-item:hover {
    background-color: #f5f5f5;
}

/* 模态框样式 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 24px;
    border-radius: 8px;
    min-width: 300px;
    max-width: 90%;
}

.form-group {
    margin-bottom: 16px;
    width: 100%;
    /* 确保form-group占满父容器宽度 */
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: #333;
    padding: 0 10px;
}

.form-group input {
    width: 100%;
    box-sizing: border-box;
    /* 确保padding和border包含在宽度内 */
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
}

.btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.btn.primary {
    background: #4CAF50;
    color: white;
}

.btn.cancel {
    background: #f5f5f5;
    color: #333;
}

.btn:hover {
    opacity: 0.9;
}

.create-folder-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.create-folder-btn:hover {
    background: #45a049;
}

.dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.dialog {
    background: white;
    padding: 24px;
    border-radius: 8px;
    min-width: 300px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
}

.form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
}

.dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}

.dialog-actions button {
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}

.dialog-actions button:first-child {
    background: #f5f5f5;
    border: 1px solid #ddd;
}

.dialog-actions button:last-child {
    background: #4CAF50;
    color: white;
    border: none;
}

.dialog-actions button:disabled {
    background: #cccccc;
    cursor: not-allowed;
}
</style>