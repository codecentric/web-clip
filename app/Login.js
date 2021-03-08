import React, {useEffect, useState} from 'react'
import * as auth from 'solid-auth-client'

import * as rdf from "rdflib";
import solidNamespace from "solid-namespace";

const ns = solidNamespace(rdf);
const {sym, st} = rdf;


const store = rdf.graph();
const fetcher =new rdf.Fetcher(store, { fetch: auth.fetch });
const updater = new rdf.UpdateManager(store)

let session;

async function login(idp) {
  session = await auth.currentSession();
  if (!session)
    await auth.popupLogin({ popupUri: 'https://solidcommunity.net/common/popup.html' });
  else
    alert(`Logged in as ${session.webId}`);
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
    else console.error(message)
  })
}

function useRedirectAfterLogin() {

  const [loading, setLoading] = useState(false);
  const [webId, setWebId] = useState(null);
  const [name, setName] = useState(null);

  auth.trackSession(session => {
    if(session) {
      setWebId(session.webId);
      trackPageView(webId);
    } else {
      setWebId(null);
    }
  })

  useEffect(async () => {
    setLoading(true);
    if (session) {
      setWebId(session.webId);
      trackPageView(webId);
    } else {
      setLoading(false);
      // auto log-in?
      // loginToInruptDotCom()
    }


  }, []);

  useEffect(() => {
    if (webId) {
      setLoading(true);
      fetcher.load(webId).then(response => {
        setName(store.anyValue(sym(webId), ns.vcard('fn')));
        setLoading(false);
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
  login("https://angelo.veltens.org")
}

export const Login = () => {
  const {name, webId, loading} = useRedirectAfterLogin();
  const greet = name || '';
  return loading ? null : (webId ? <div className="main">Welcome, {greet} ✔</div> : <div className="main"><button onClick={authenticate}>Login</button></div>)
}