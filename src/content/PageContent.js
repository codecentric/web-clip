import React, {useEffect} from 'react'

import * as rdf from "rdflib";
import solidNamespace from "solid-namespace";
import {getDefaultSession, handleIncomingRedirect} from "@inrupt/solid-client-authn-browser";

const ns = solidNamespace(rdf);
const {sym, st} = rdf;

const store = rdf.graph();
const fetcher = new rdf.Fetcher(store, {fetch: fetch});
const updater = new rdf.UpdateManager(store)




export const PageContent = ({port}) => {
  return "Hello, world"
}