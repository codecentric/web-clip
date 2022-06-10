import { Message } from '../domain/messages';

export function sendMessageToActiveTab(message: Message) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
      console.log({ response });
    });
  });
}
