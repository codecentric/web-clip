import { Fetcher, graph, LiveStore, UpdateManager } from 'rdflib';
import { useEffect, useState } from 'react';
import { Session } from '../solid-client-authn-chrome-ext/Session';
import { ProfileApi } from './api/ProfileApi';

function initializeApi(session: Session) {
  const store = graph();
  new UpdateManager(store);
  new Fetcher(store, { fetch: session.fetch });
  return new ProfileApi(session, store as LiveStore);
}

export const useSolidApis = (session: Session) => {
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
