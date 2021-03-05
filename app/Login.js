import React, {useEffect, useState} from 'react'

import * as rdf from "rdflib";
import solidNamespace from "solid-namespace";
import {getDefaultSession, handleIncomingRedirect, login, fetch} from "@inrupt/solid-client-authn-browser";

const ns = solidNamespace(rdf);
const {sym, st} = rdf;


const store = rdf.graph();
const fetcher =new rdf.Fetcher(store, { fetch });
const updater = new rdf.UpdateManager(store)


function loginToInruptDotCom() {
  return login({
    oidcIssuer: "https://angelo.veltens.org" || "https://broker.pod.inrupt.com",
    redirectUrl: window.location.href,
  });
}

async function trackPageView(webId) {

  const id = Date.now().toString();

  const trackingUrl = `https://angelo.veltens.org/tracking/${id}`;
  const trackingFile = sym(trackingUrl);
  const trackingThing = sym(`${trackingUrl}#${id}`);

  let ins = [
    st(trackingThing, ns.rdf('type'), ns.schema('ViewAction'), trackingFile),
    st(trackingThing, ns.schema('url'), sym(window.location.href), trackingFile),
    st(trackingThing, ns.schema('dateCreated'), new Date(), trackingFile)
  ];
  let del = []
  updater.update(del, ins, (uri, ok, message) => {
    if (ok) console.log('Tracked to '+ trackingThing.uri)
    else alert(message)
  })
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
      trackPageView(webId);
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