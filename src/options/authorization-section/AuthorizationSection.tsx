import React from 'react';
import { ProfileApi } from '../api/ProfileApi';
import { useCheckAccessPermissions } from './useCheckAccessPermissions';

interface Props {
  extensionUrl: string;
  providerUrl: string;
  profileApi: ProfileApi;
}

export const AuthorizationSection = ({
  extensionUrl,
  providerUrl,
  profileApi,
}: Props) => {
  const { checking } = useCheckAccessPermissions(extensionUrl, profileApi);

  if (checking) {
    return (
      <div className="flex flex-col gap-2 ">
        <div className="flex gap-2 font-semibold text-yellow-500 animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"
            />
          </svg>
          Checking access permissions
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col rounded border bg-slate-50 py-2 px-3 leading-tight text-gray-700 shadow">
            <span className="text-xs font-light">Extension Origin</span>
            <div className="flex flex-row gap-2">
              <span>{extensionUrl}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <section>
      <p className="my-4">
        <>
          <h2 className="text-lg font-medium my-8">3) Authorize Access</h2>
          Please add the following extension URL as a trusted app to your Pod,
          granting at least <code>Read</code>, <code>Write</code> and{' '}
          <code>Append</code> access{' '}
          <a
            className="text-blue-600 hover:underline"
            href="https://github.com/solid/userguide#manage-your-trusted-applications"
          >
            as described in the user guide
          </a>
          .
          <pre className="my-4 bg-gray-50 border-2 border-gray-700 p-3">
            {extensionUrl}
          </pre>
          or do it automatically:{' '}
          <a
            target="_blank"
            className="text-blue-600 hover:underline"
            href={`${providerUrl}/.web-clip/${chrome.runtime.id}`}
            rel="noreferrer"
          >
            Trust WebClip
          </a>
        </>
        )
      </p>
    </section>
  );
};
