import { Message, Response } from '../messages';

export async function sendMessage(message: Message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, function (response?: Response) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      }
      resolve(response?.payload);
    });
  });
}
