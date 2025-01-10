// import type { BookmarkTreeNode } from 'chrome-types'  // 可选：引入类型定义

export const mockBookmarks: chrome.bookmarks.BookmarkTreeNode[] = [
    // 顶层链接 如 wxt / cursor / Perplexity搜
    // Flux AI 生成图片
    // Runway图生动画
    // Codia AI: 截图生成网站
    // Predis AI Ad Generator
    {
        id: '0',
        title: 'wxt',
        url: 'https://www.wxt.com',
        dateAdded: Date.now()
    },
    {
        id: '1',
        title: 'cursor',
        url: 'https://www.cursor.com',
        dateAdded: Date.now()
    },
    {
        id: '2',
        title: 'Perplexity搜',
        url: 'https://www.perplexity.com',
        dateAdded: Date.now()
    },
    {
        id: '3',
        title: 'Flux AI 生成图片',
        url: 'https://www.flux.com',
        dateAdded: Date.now()
    },

    {
        id: '1',
        title: 'AI 工具',
        children: [
            {
                id: '11',
                parentId: '1',
                title: 'ChatGPT',
                url: 'https://chat.openai.com',
                dateAdded: Date.now()
            },
            {
                id: '12',
                parentId: '1',
                title: 'Claude',
                url: 'https://claude.ai',
                dateAdded: Date.now()
            }
        ]
    },
    {
        id: '2',
        title: 'AI 新闻',
        children: [
            {
                id: '21',
                parentId: '2',
                title: '机器之心',
                url: 'https://www.jiqizhixin.com',
                dateAdded: Date.now()
            }
        ]
    },
    {
        id: '3',
        parentId: '0',
        title: 'Stable Diffusion',
        url: 'https://stabilityai.com',
        dateAdded: Date.now()
    }
]