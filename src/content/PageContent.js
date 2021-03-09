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
  return getDefaultSession();
}

export const PageContent = () => {
  useEffect(() => {
    handleRedirectAfterLogin().then(session => console.log("mounted", {session}))
  }, []);
  return "Hello, world"
}