export function launchWebAuthFlow(
  details: { url: string; interactive: boolean },
  callback: (redirectUrl?: string, error?: Error) => void
) {
  chrome.identity.launchWebAuthFlow(details, (redirectUrl) => {
    if (chrome.runtime.lastError) {
      callback(null, new Error(chrome.runtime.lastError.message));
    } else {
      callback(redirectUrl);
    }
  });
}
