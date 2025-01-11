<script setup lang="ts">
import { ref } from 'vue'
import { mockBookmarks } from './mock'

const firstLevelLinks = ref([]);
const firstLevelFolders = ref([]);
// 主要逻辑 核心入口
async function getBookmarks() {
    firstLevelLinks.value = []
    firstLevelFolders.value = []
    try {
        // 获取 qyb 文件夹
        const findQybFolder = await chrome.bookmarks.search({ title: 'qyb' });
        const qybFolder = findQybFolder?.find(item => !item.url);

        if (qybFolder) {
            await loadQybBookmarks(qybFolder);
        }
        if (mockBookmarks) {
            await loadMockBookmarks(mockBookmarks);
        }
        console.log('firstLevelLinks: ===>', firstLevelLinks.value);
        console.log('firstLevelFolders: ===>', firstLevelFolders.value);
        return [firstLevelLinks.value, firstLevelFolders.value];
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
    }
}

// loadBookmarks
async function loadQybBookmarks(qybFolder: chrome.bookmarks.BookmarkTreeNode) {
    // 获取顶层项目
    // 处理每个子项
    const children = await chrome.bookmarks.getChildren(qybFolder.id);
    for (const child of children) {
        if (child.url) {
            firstLevelLinks.value.push(child);
        } else {
            firstLevelFolders.value.push(child);
            // 如果是文件夹, 获取其子项，添加到 children 中
            const grandchildren = await chrome.bookmarks.getChildren(child.id);
            child.children = grandchildren;
        }
    }

}

async function loadMockBookmarks(mockBookmarks: chrome.bookmarks.BookmarkTreeNode[]) {
    for (const item of mockBookmarks) {
        if (item.url) {
            firstLevelLinks.value.push(item);
        } else {
            firstLevelFolders.value.push(item);
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
function handleImageError(event: Event, bookmark: any) {
    event.target.style.display = 'none';
    bookmark.showFallback = true;
}

</script>

<template>
    <div class="container">
        <header class="header">
            <h1>书签管理</h1>
            <button class="primary-btn" @click="getBookmarks">刷新书签</button>
        </header>

        <!-- 顶层链接 -->
        <section v-if="firstLevelLinks.length" class="section">
            <div class="section-header">
                <h2>首层链接</h2>
                <button class="icon-btn" @click="addLink">
                    <span class="icon">+</span>
                </button>
            </div>
            <div class="grid-container">
                <div v-for="bookmark in firstLevelLinks" :key="bookmark.id" class="card">
                    <div class="card-header">
                        <div class="card-img">
                            <img v-if="getFaviconUrl(bookmark.url)"
                                 :src="getFaviconUrl(bookmark.url)"
                                 :alt="bookmark.title"
                                 @error="$event.target.parentElement.querySelector('.text-icon').style.display = 'flex'; $event.target.style.display = 'none'"
                                 class="favicon">
                            <div class="text-icon"
                                 :style="{ display: getFaviconUrl(bookmark.url) ? 'none' : 'flex' }">
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
                        <button class="icon-btn small" @click="editBookmark(bookmark)">✏️</button>
                        <button class="icon-btn small" @click="deleteBookmark(bookmark.id)">🗑️</button>
                    </div>
                </div>
            </div>
        </section>

        <!-- 文件夹区域 -->
        <section v-if="firstLevelFolders.length" class="section">
            <div class="section-header">
                <h2>文件夹</h2>
                <button class="icon-btn" @click="addNewFolder">
                    <span class="icon">+</span>
                </button>
            </div>
            <div class="folders-container">
                <div v-for="folder in firstLevelFolders" :key="folder.id" class="folder-card">
                    <div class="folder-header">
                        <span class="folder-icon">📁</span>
                        <span class="folder-title">
                            <!--  -->
                            {{ folder.title }}
                        </span>
                        <div class="folder-actions">
                            <button class="icon-btn small" @click="editFolder(folder.id)">✏️</button>
                            <button class="icon-btn small" @click="addFolder(folder.id)">+</button>
                            <button class="icon-btn small" @click="deleteFolder(folder.id)">🗑️</button>
                        </div>
                    </div>
                    <div class="folder-content">
                        <div v-for="item in folder.children" :key="item.id" class="folder-item">
                            <div class="text-icon" style="flex: 1; min-width: 0;">
                                {{ getFirstChar(item.title) }}
                            </div>
                            <a :href="item.url" target="_blank">{{ item.title }}</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

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
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
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

.card-content {
    flex: 1;
    min-width: 0; /* 防止文本溢出 */
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

.folder-title {
    flex: 1;
    margin: 0 12px;
    font-weight: 500;
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
}

.icon-btn.small {
    padding: 4px;
    font-size: 12px;
}

.icon-btn:hover {
    background: #f5f5f5;
}
</style>