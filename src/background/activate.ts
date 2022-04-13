import { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import { MessageType } from '../messages';
import Tab = chrome.tabs.Tab;

export function activateWebClipForTab(
  tab: Tab,
  sessionInfo: ISessionInfo,
  providerUrl: string
) {
  chrome.tabs.sendMessage(
    tab.id,
    { type: MessageType.ACTIVATE, payload: { ...sessionInfo, providerUrl } },
    function () {
      return null;
    }
  );
}
