export const useChromeExtension = () => ({
  redirectUrl: chrome.identity.getRedirectURL(),
  extensionUrl: chrome.extension.getURL('').slice(0, -1),
});
