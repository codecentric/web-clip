import { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import { graph } from 'rdflib';
import { SolidApi } from '../api/SolidApi';
import { Store } from '../store/Store';

export const useSolid = (sessionInfo: ISessionInfo) => {
  const store = new Store(graph());
  const solidApi = new SolidApi(sessionInfo, store);
  return {
    store,
    solidApi,
  };
};
