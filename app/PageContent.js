import React, {useEffect, useState} from 'react'
import * as auth from 'solid-auth-client'

import * as rdf from "rdflib";
import solidNamespace from "solid-namespace";

const ns = solidNamespace(rdf);
const {sym, st} = rdf;


const store = rdf.graph();
const fetcher = new rdf.Fetcher(store, {fetch: auth.fetch});
const updater = new rdf.UpdateManager(store)



export const PageContent = () => {
 return "Hello, world"
}