import React from 'react'

/**
 * Main view of the extension, that appears when clicked on the extension icon
 */
function App({tab}) {
  return <main>
    <h1>WebTrack</h1>
    <h2>{tab.title}</h2>
    <code>{tab.url}</code>
  </main>
}

export default App