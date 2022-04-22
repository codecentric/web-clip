import { createContext, useContext } from 'react';

export const AuthenticationContext = createContext({
  session: null,
  redirectUrl: '',
});

export const useAuthentication = () => {
  return useContext(AuthenticationContext);
};
