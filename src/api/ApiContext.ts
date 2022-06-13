import { createContext, useContext } from 'react';
import { ProfileApi } from './ProfileApi';
import { StorageApi } from './StorageApi';

export const ApiContext = createContext({
  profileApi: null,
  storageApi: null,
});

export const useProfileApi = (): ProfileApi => {
  const apis = useContext(ApiContext);
  return apis.profileApi;
};

export const useStorageApi = (): StorageApi => {
  const apis = useContext(ApiContext);
  return apis.storageApi;
};
