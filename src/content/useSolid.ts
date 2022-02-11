import { Session } from '@inrupt/solid-client-authn-browser';
import { graph } from 'rdflib';
import { SolidApi } from '../api/SolidApi';
import { Store } from '../store/Store';

export const useSolid = (session: Session) => {
  const store = new Store(graph());
  const solidApi = new SolidApi(session, store);
  return {
    store,
    solidApi,
  };
};
