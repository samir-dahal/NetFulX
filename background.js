const CONTEXT_MENU_ID = "SEARCH_NETFLIX";
function searchNetflix(info, tab) {
  if (info.menuItemId !== CONTEXT_MENU_ID) {
    return;
  }
  chrome.tabs.create({
    url: "https://www.netflix.com/search?q=" + info.selectionText,
  });
}
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: "Search NETFLIX for '%s'",
    contexts: ["selection"],
    id: CONTEXT_MENU_ID,
  });
});
chrome.contextMenus.onClicked.addListener(searchNetflix);
