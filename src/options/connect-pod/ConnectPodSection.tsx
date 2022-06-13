import React from 'react';
import { Input } from '../../components/Input';
import { GetAPodSection } from '../get-a-pod/GetAPodSection';
import { ConnectPodButton } from './ConnectPodButton';
import { useConnectPod } from './useConnectPod';

export const ConnectPodSection = () => {
  const { setProviderUrl, providerUrl, onLogin } = useConnectPod();

  return (
    <section>
      <h2 className="text-lg font-medium my-8">Connect your Pod</h2>
      <p className="my-4 font-thin">
        Please fill in the URL of your Solid pod provider, so that WebClip can
        find your pod.
      </p>

      <label className="block text-gray-700 text-sm font-bold mb-2">
        <p>Pod Provider URL</p>
        <Input
          list="providers"
          placeholder="Enter or select your Provider"
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
      <div className="flex flex-row items-start gap-4 align-baseline">
        <ConnectPodButton oidcIssuer={providerUrl} onLogin={onLogin} />
        <details className="font-light my-4">
          <summary className="cursor-pointer hover:font-normal hover:underline">
            I do not have a Pod
          </summary>
          <GetAPodSection />
        </details>
      </div>
    </section>
  );
};
