import React, {useState, useEffect} from 'react'


const useSession = () => {
  const [session, setSession] = useState();
  useEffect(() => {
    chrome.runtime.sendMessage({type: 'getSession'}, function (response) {
      setSession(response)
    });
  }, []);
  return session;
}

function login() {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "doLogin"}, function (response) {
      console.log({response});
    });
  });
}

function logout() {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "doLogout"}, function (response) {
      console.log({response});
    });
  });
}

function App({tab}) {
  const session = useSession();
  return <main>
    <h1>WebTrack</h1>
    <h2>{tab.title}</h2>
    <code>{tab.url}</code>
    <div>Hello, {session ? session.name : 'world'}.</div>
    {session ? null : <button onClick={login}>Login</button>}
    {!session ? null : <button onClick={logout}>Logout</button>}
  </main>
}

export default App