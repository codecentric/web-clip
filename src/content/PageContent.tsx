import React from 'react';

import * as rdf from 'rdflib';
import solidNamespace from 'solid-namespace';
import { login, Session } from '@inrupt/solid-client-authn-browser';
import { Toolbar } from './Toolbar';

const ns = solidNamespace(rdf);
const { sym, st } = rdf;

const store = rdf.graph();
const fetcher = new rdf.Fetcher(store, { fetch: fetch });
const updater = new rdf.UpdateManager(store);

async function loginWithRedirect() {
  await login({
    oidcIssuer: 'https://solidcommunity.net', // TODO: read from plugin configuration?
    redirectUrl: window.location.href,
  });
}

interface PageContentProps {
  sessionInfo: Session['info'];
}

export const PageContent = ({ sessionInfo }: PageContentProps) => {
  return sessionInfo.isLoggedIn ? (
    <Toolbar webId={sessionInfo.webId} />
  ) : (
    <button onClick={loginWithRedirect}>Login</button>
  );
};
