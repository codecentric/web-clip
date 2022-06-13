import { Fetcher, graph, LiveStore, UpdateManager } from 'rdflib';
import { useEffect, useState } from 'react';
import { ProfileApi } from './ProfileApi';
import { SolidSession } from './SolidSession';
import { StorageApi } from './StorageApi';

function initializeApis(session: SolidSession) {
  const store = graph() as LiveStore;
  new UpdateManager(store);
  new Fetcher(store, { fetch: session.fetch });
  return {
    profileApi: new ProfileApi(session, store),
    storageApi: new StorageApi(session.info.webId, store),
  };
}

export const useSolidApis = (session: SolidSession) => {
  const [apis, setApis] = useState(() => {
    return initializeApis(session);
  });

  useEffect(() => {
    session.onLogin(() => {
      setApis(initializeApis(session));
    });
  }, []);

  return apis;
};
