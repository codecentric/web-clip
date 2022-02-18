import { EventEmitter } from 'events';

export class ChromeMessageListener extends EventEmitter {
  constructor() {
    super();
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.emit(request.type, request.payload);
      sendResponse();
    });
  }
}
