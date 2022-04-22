import { createContext, useContext } from 'react';

export const SessionContext = createContext(undefined);

export const useSession = () => {
  return useContext(SessionContext);
};
