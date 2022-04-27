import { createContext, useContext } from 'react';
import { Dispatch, State } from './reducer';

export const OptionsContext = createContext<
  { state: State; dispatch: Dispatch; save: () => Promise<void> } | undefined
>(undefined);

export const useOptions = () => {
  return useContext(OptionsContext);
};
