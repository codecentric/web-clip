export const closeTab: (tabId: number) => void = (tabId: number) =>
  chrome.tabs.remove(tabId);
