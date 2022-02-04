export function launchWebAuthFlow(
  details: { url: string; interactive: boolean },
  callback: (redirectUrl?: string) => void
) {
  chrome.identity.launchWebAuthFlow(details, callback);
}
