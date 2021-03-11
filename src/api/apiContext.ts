import { createContext, useContext } from 'react';
import { SolidApi } from './solidApi';

export const SolidApiContext = createContext<SolidApi>(undefined);

export const useSolidApi = () => {
  return useContext(SolidApiContext);
};
