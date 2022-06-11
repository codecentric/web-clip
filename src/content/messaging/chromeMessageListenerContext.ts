import { createContext, useContext } from 'react';
import { ChromeMessageListener } from './ChromeMessageListener';

export const ChromeMessageListenerContext =
  createContext<ChromeMessageListener>(undefined);

export const useChromeMessageListener = () => {
  return useContext(ChromeMessageListenerContext);
};
