import { createContext, useContext } from 'react';
import { SolidApi } from './SolidApi';

export const SolidApiContext = createContext<SolidApi>(undefined);

export const useSolidApi = () => {
  return useContext(SolidApiContext);
};
