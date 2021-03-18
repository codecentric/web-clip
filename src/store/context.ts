import { createContext, useContext } from 'react';
import { Store } from './Store';

export const StoreContext = createContext<Store>(undefined);

export const useStore = () => {
  return useContext(StoreContext);
};
