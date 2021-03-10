import React, {useEffect, useState, useMemo, useCallback} from 'react'
import {types} from "./messages";


/**
 * Main view of the extension, that appears when clicked on the extension icon
 */
function App({tab}) {
  const [session, setSession] = useState(null)
  const port = useMemo(() => chrome.tabs.connect(tab.id, {name: "communication-port"}), [tab.id])

  const login = useCallback(() => {
    port.postMessage({type: types.LOGIN})
  }, [port]);

  useEffect(() => {
    port.postMessage({type: 'init'})
    port.onMessage.addListener(function(msg) {
      console.log({msg})
      if (msg.type === "SESSION") {
        setSession(msg.payload)
      } else {
        console.error("unknown message", msg)
      }
    });
  }, [port])

  return <main>
    <h1>WebTrack</h1>
    <h2>{tab.title}</h2>
    <code>{tab.url}</code>
    <p>{session && session.info ? session.info.webId : "No Session!"}</p>
    <button onClick={login}>Login</button>
  </main>
}

export default App