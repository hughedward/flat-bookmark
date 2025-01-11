export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });
});
// // 通过后台脚本打开：
// chrome.action.onClicked.addListener(() => {
//   chrome.tabs.create({ url: 'manage.html' });
// });

// chrome.contextMenus.create({
//   id: 'open-manage',
//   title: '打开管理页面',
//   contexts: ['action']
// });
// // 3. 通过右键菜单打开（需要添加 contextMenus 权限）：
// chrome.contextMenus.onClicked.addListener((info) => {
//   if (info.menuItemId === 'open-manage') {
//     chrome.tabs.create({ url: 'manage.html' });
//   }
// });
