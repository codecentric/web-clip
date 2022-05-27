import { Fetcher, graph, LiveStore, UpdateManager } from 'rdflib';
import { useEffect, useState } from 'react';
import { ProfileApi } from './api/ProfileApi';
import { SolidSession } from './api/SolidSession';

function initializeApi(session: SolidSession) {
  const store = graph();
  new UpdateManager(store);
  new Fetcher(store, { fetch: session.fetch });
  return new ProfileApi(session, store as LiveStore);
}

export const useSolidApis = (session: SolidSession) => {
  const [profileApi, setProfileApi] = useState(() => {
    return initializeApi(session);
  });

  useEffect(() => {
    session.onLogin(() => {
      setProfileApi(initializeApi(session));
    });
  }, []);

  return {
    profileApi,
  };
};
