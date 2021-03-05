import React, {useState, useEffect} from 'react'

import * as rdf from "rdflib";
import solidNamespace from "solid-namespace";

const ns = solidNamespace(rdf);
const {sym} = rdf;


const store = rdf.graph();
const fetcher =new rdf.Fetcher(store);
import {
  login,
  handleIncomingRedirect,
  getDefaultSession,
  fetch
} from "@inrupt/solid-client-authn-browser";
import {
  addDatetime,
  addStringNoLocale,
  addUrl,
  createSolidDataset,
  createThing,
  saveSolidDatasetAt,
  setThing
} from "@inrupt/solid-client";
import {SCHEMA_INRUPT_EXT, RDF} from "@inrupt/vocab-common-rdf";


function loginToInruptDotCom() {
  return login({
    oidcIssuer: "https://angelo.veltens.org" || "https://broker.pod.inrupt.com",
    redirectUrl: window.location.href,
  });
}

async function trackPageView() {
  let dataset = createSolidDataset();

  const id = Date.now().toString();
  const trackingUrl = `https://angelo.veltens.org/tracking/${id}`;
  let pageview = createThing({name: id})
  pageview = addUrl(pageview, RDF.type, SCHEMA_INRUPT_EXT.NS('ViewAction'));
  pageview = addStringNoLocale(pageview, SCHEMA_INRUPT_EXT.NS('url'), window.location.href);
  pageview = addDatetime(pageview, SCHEMA_INRUPT_EXT.NS('dateCreated'), new Date());
  dataset = setThing(dataset, pageview);
  let saved = await saveSolidDatasetAt(trackingUrl, dataset, {fetch});
  console.log({saved})
}

function useRedirectAfterLogin() {

  const [loading, setLoading] = useState(false);
  const [webId, setWebId] = useState(null);
  const [name, setName] = useState(null);

  useEffect(async () => {
    setLoading(true);
    await handleIncomingRedirect();

    const session = getDefaultSession();
    if (session.info.isLoggedIn) {
      setWebId(session.info.webId);
      setLoading(false);
    } else {
      setLoading(false);
      // auto log-in?
      // loginToInruptDotCom()
    }


  }, []);

  useEffect(() => {
    if (webId) {
      fetcher.load(webId).then(response => {
        setName(store.anyValue(sym(webId), ns.vcard('fn')));
      }, err => {
        console.log("Load failed",  err);
      });
    }
  }, [webId])

  return {
    webId,
    name,
    loading
  }
}


const authenticate = () => {
  loginToInruptDotCom()
}

export const Login = () => {
  const {name, webId, loading} = useRedirectAfterLogin();
  const greet = name || webId;
  return loading ? <div>Loading</div> : (greet ? <div>Welcome, {greet}</div> : <button onClick={authenticate}>Login</button>)
}