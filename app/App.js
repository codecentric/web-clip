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

function App() {
    const session = useSession();
    return <main>
    <h1>WebTrack</h1>
      <div>Hello, {session ? session.name : 'world'}.</div>
    </main>
}
export default App