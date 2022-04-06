import React from 'react';
import { AuthorizationSection } from './AuthorizationSection';
import { HelpSection } from './HelpSection';
import { useOptions } from './useOptions';

interface Props {
  extensionUrl: string;
}

export const OptionsPage = ({ extensionUrl }: Props) => {
  const { loading, providerUrl, setProviderUrl, save, saved } = useOptions();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="container text-lg mx-auto p-8">
      <h1 className="text-xl font-medium my-8">Setup WebClip</h1>
      <section>
        <h2 className="text-lg font-medium my-8">1) Get a Solid Pod</h2>
        <p className="my-4">
          For information on how to create your own pod, please visit{' '}
          <a
            className="text-blue-600 hover:underline"
            href="https://solidproject.org/users/get-a-pod"
          >
            the Solid Project
          </a>{' '}
          or just create a pod on{' '}
          <a
            className="text-blue-600 hover:underline"
            href="https://solidcommunity.net/register"
          >
            solidcommunity.net
          </a>
        </p>
      </section>
      <section>
        <h2 className="text-lg font-medium my-8">2) Your Pod Provider</h2>
        <p className="my-4">
          Please configure the URL for your Solid pod provider, to enable
          webclip to find your pod.
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
      <AuthorizationSection extensionUrl={extensionUrl}></AuthorizationSection>
      <HelpSection></HelpSection>
    </main>
  );
};
