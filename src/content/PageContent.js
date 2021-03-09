import React, {useEffect} from 'react'

import * as rdf from "rdflib";
import solidNamespace from "solid-namespace";
import {getDefaultSession, handleIncomingRedirect} from "@inrupt/solid-client-authn-browser";

const ns = solidNamespace(rdf);
const {sym, st} = rdf;

const store = rdf.graph();
const fetcher = new rdf.Fetcher(store, {fetch: fetch});
const updater = new rdf.UpdateManager(store)


async function handleRedirectAfterLogin() {
  await handleIncomingRedirect();
  const session = getDefaultSession();
  return session;
}

export const PageContent = ({port}) => {
  useEffect(() => {
    handleRedirectAfterLogin().then(session => {
      port.postMessage({type: "SESSION", payload: session})
    })
  }, [port]);
  return "Hello, world"
}