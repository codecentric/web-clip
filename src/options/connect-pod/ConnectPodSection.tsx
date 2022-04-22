import React from 'react';
import { useOptions } from '../useOptions';

export const ConnectPodSection = () => {
  const { loading, providerUrl, setProviderUrl, save, saved } = useOptions();
  if (loading) {
    return <p>Loading...</p>;
  }

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
      <button
        className="my-1 px-4 py-2 bg-blue-400 rounded text-white hover:opacity-90 font-bold"
        onClick={save}
      >
        Save
      </button>
      {saved && (
        <div
          className="flex lg:inline-flex bg-green-100 border border-green-400 text-green-700 px-2 py-1 rounded relative"
          role="alert"
        >
          <span className="flex rounded-full text-white bg-green-500 uppercase px-2 py-1 text-xs font-bold mr-3">
            Success
          </span>
          <span className="block sm:inline">Pod Provider URL saved</span>
        </div>
      )}
    </section>
  );
};
