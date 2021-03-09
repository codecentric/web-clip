import React from 'react'

import {login, logout} from "./messages";

/**
 * Main view of the extension, that appears when clicked on the extension icon
 */
function App({tab}) {
  return <main>
    <h1>WebTrack</h1>
    <h2>{tab.title}</h2>
    <code>{tab.url}</code>
    <button onClick={login}>Login</button>
  </main>
}

export default App