import React, {useState, useEffect}  from 'react'

import {
  login,
  handleIncomingRedirect,
  getDefaultSession,
  fetch
} from "@inrupt/solid-client-authn-browser";

function loginToInruptDotCom() {
  return login({
    oidcIssuer: "https://angelo.veltens.org" || "https://broker.pod.inrupt.com",
    redirectUrl: window.location.href,
  });
}

function useRedirectAfterLogin() {

  const [loading, setLoading] = useState(false);
  const [webId, setWebId] = useState(null);

  useEffect(async () => {
    setLoading(true);
    await handleIncomingRedirect();

    const session = getDefaultSession();
    if (session.info.isLoggedIn) {
      setWebId(session.info.webId);
    } else {
      // auto log-in?
      // loginToInruptDotCom()
    }
    setLoading(false);

  }, []);

  return {
    webId,
    loading
  }
}


const authenticate = () => {
  loginToInruptDotCom()
}

export const Login = () => {
  const { webId, loading } = useRedirectAfterLogin();
  return loading ? <div>Loading</div> : (webId ? <div>{webId}</div> : <button onClick={authenticate}>Login</button>)
}