import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    name: 'flat-bookmark',
    permissions: [
      'tabs',
      'bookmarks'
    ],
    // 使用项目中已有的图标
    // icons: {
    //   16: '/icons/icon-16.png',
    //   32: '/icons/icon-32.png',
    //   48: '/icons/icon-48.png',
    //   128: '/icons/icon-128.png'
    // },
    // action: {
    //   default_icon: {
    //     16: '/icons/icon-16.png',
    //     32: '/icons/icon-32.png',
    //     48: '/icons/icon-48.png',
    //     128: '/icons/icon-128.png'
    //   }
    // }
  },
  entrypointsDir: './entrypoints',
});

