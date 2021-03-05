import React  from 'react'

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

async function useRedirectAfterLogin() {

  await handleIncomingRedirect();

  const session = getDefaultSession();
  if (session.info.isLoggedIn) {
    console.log("hello", session.info.webId)
  }
  return {
    session,
    loading: false
  }
}


const authenticate = () => {
  loginToInruptDotCom()
}

export const Login = () => {
  const { session, loading } = useRedirectAfterLogin();

  return <button onClick={authenticate}>Login</button>
}