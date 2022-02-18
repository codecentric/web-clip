import { EventEmitter } from 'events';

const chromeMessageListener = new EventEmitter();

export function useChromeMessageListener() {
  return chromeMessageListener;
}
