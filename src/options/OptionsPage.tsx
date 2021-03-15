import React from 'react';
import { useOptions } from './useOptions';

export const OptionsPage = () => {
  const { loading, providerUrl, setProviderUrl, save, saved } = useOptions();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <section>
      <h1>webclip options</h1>
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
