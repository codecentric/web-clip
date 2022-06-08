export function chromeExtensionLogout() {
  return new Promise<void>((resolve) =>
    chrome.identity.clearAllCachedAuthTokens(() => {
      resolve();
    })
  );
}
