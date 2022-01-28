import React, { useState } from 'react';
import { ChromeExtensionSession } from '../authn/authn';
import { useOptions } from './useOptions';

const session = new ChromeExtensionSession();

async function testPrivateAccess() {
  const result = await session.fetch('https://solidweb.me/webclip/test.txt', {
    method: 'PUT',
    body: 'test file',
  });
  alert(result.status);
}

export const OptionsPage = () => {
  const { loading, providerUrl, setProviderUrl, save, saved } = useOptions();

  const [webId, setWebId] = useState('');

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <section>
      <h1>webclip options</h1>
      <button
        onClick={() => {
          session.login({
            redirectUrl: chrome.identity.getRedirectURL(),
            oidcIssuer: providerUrl,
            clientName: 'WebClip Options',
          });
        }}
      >
        LOGIN
      </button>
      <button onClick={() => setWebId(session.info.webId)}>Who am I</button>
      <div>{webId}</div>
      <button onClick={() => session.logout()}>LOGOUT</button>
      <button onClick={() => testPrivateAccess()}>Test private access</button>
      <p>
        Please configure the URL for your Solid pod provider, to enable webclip
        to save clips in your pod.
      </p>
      <p>
        For more information on how to create your own pod, please visit{' '}
        <a href="https://solidproject.org/users/get-a-pod">the Solid Project</a>{' '}
        or just create a pod on{' '}
        <a href="https://solidcommunity.net/register">solidcommunity.net</a>
      </p>
      <label>
        <p>Pod Provider URL</p>
        <input
          onChange={(e) => setProviderUrl(e.target.value)}
          value={providerUrl}
          type="url"
          required
        />
      </label>
      <button onClick={save}>Save</button>
      {saved && <p>URL was saved</p>}
    </section>
  );
};
