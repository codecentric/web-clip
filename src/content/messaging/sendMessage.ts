import { Message, Response } from '../../domain/messages';

export async function sendMessage(message: Message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, function (response?: Response) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else if (!response) {
        reject(new Error(`response to ${message.type} message was null`));
      } else if (response.errorMessage) {
        reject(new Error(response.errorMessage));
      } else {
        resolve(response.payload);
      }
    });
  });
}
