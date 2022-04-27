import React from 'react';
import { ConnectPodButton } from './ConnectPodButton';
import { useConnectPod } from './useConnectPod';

export const ConnectPodSection = () => {
  const { setProviderUrl, providerUrl, onLogin } = useConnectPod();

  return (
    <section>
      <h2 className="text-lg font-medium my-8">2) Connect your Pod</h2>
      <p className="my-4">
        Please configure the URL for your Solid pod provider, to enable webclip
        to find your pod.
      </p>

      <label className="block text-gray-700 text-sm font-bold mb-2">
        <p>Pod Provider URL</p>
        <input
          list="providers"
          placeholder="Enter or select your Provider"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={(e) => setProviderUrl(e.target.value)}
          value={providerUrl}
          type="url"
          required
        />
        <datalist id="providers">
          <option value="https://solidcommunity.net" />
          <option value="https://inrupt.net" />
          <option value="https://solidweb.me" />
          <option value="https://solidweb.org" />
        </datalist>
      </label>
      <ConnectPodButton oidcIssuer={providerUrl} onLogin={onLogin} />
    </section>
  );
};
