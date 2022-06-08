import React from 'react';
import { ExtensionUrl } from '../../chrome/urls';

interface Props {
  providerUrl: string;
  extensionUrl: ExtensionUrl;
}

export const GrantAccess = ({ providerUrl, extensionUrl }: Props) => (
  <div className="flex flex-col gap-2">
    <div className="flex gap-2 font-semibold text-blue-500">
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
      You need to grant access.
    </div>
    <div className="flex flex-col gap-2">
      <div className="flex flex-col rounded border bg-slate-50 py-2 px-3 leading-tight text-gray-700 shadow">
        <span className="text-xs fontLight">Extension Origin</span>
        <div className="flex flex-row gap-2">
          <span>{extensionUrl.origin}</span>
          <a
            target="_blank"
            className="mx-2.5 flex gap-1 rounded p-0 text-blue-500 underline hover:text-gray-800 hover:underline"
            href={`${providerUrl}/.web-clip/${chrome.runtime.id}`}
            rel="noreferrer"
          >
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            Grant access
          </a>
        </div>
      </div>
      <p className="text-sm font-thin">
        Instead of using the link above you may add the extension origin as a
        trusted app manually, or use the SolidOS data browser,{' '}
        <a
          className="text-blue-600 hover:underline"
          href="https://github.com/solid/userguide#manage-your-trusted-applications"
        >
          as described in the user guide
        </a>
        . You need to grant at least <code>Read</code>, <code>Write</code> and{' '}
        <code>Append</code> access.
      </p>
    </div>
  </div>
);
