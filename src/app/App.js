import React, {useEffect, useState} from 'react'

import {login, logout} from "./messages";


/**
 * Main view of the extension, that appears when clicked on the extension icon
 */
function App({tab}) {


  const [session, setSession] = useState(null)

  useEffect(() => {
    const port = chrome.tabs.connect(tab.id, {name: "communication-port"});
    port.postMessage({type: 'init'})
    port.onMessage.addListener(function(msg) {
      console.log({msg})
      if (msg.type === "SESSION") {
        setSession(msg.payload)
      } else {
        console.error("unknown message", msg)
      }
    });
  }, [])

  return <main>
    <h1>WebTrack</h1>
    <h2>{tab.title}</h2>
    <code>{tab.url}</code>
    <p>{session && session.info ? session.info.webId : "No Session!"}</p>
    <button onClick={login}>Login</button>
  </main>
}

export default App