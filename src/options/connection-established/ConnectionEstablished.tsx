import React from 'react';
import { useConnectionEstablished } from './useConnectionEstablished';

export const ConnectionEstablished = () => {
  const { providerUrl, containerUrl, disconnect } = useConnectionEstablished();

  return (
    <div className="flex flex-col gap-2">
      <div className="font-semibold text-green-700 flex gap-2">
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
        Everything is set up correctly.
      </div>

      <div className="flex flex-col gap-2 leading-tight text-gray-700">
        <div className="rounded flex flex-col py-2 px-3 border bg-slate-50 shadow w-fit">
          <span className="text-xs font-light">Your Pod Provider</span>
          <div className="flex flex-row">
            <span>{providerUrl}</span>
            <button
              className="mx-2.5 p-0 text-orange-800 hover:text-red-600 hover:underline"
              onClick={() => disconnect()}
            >
              Disconnect
            </button>
          </div>
        </div>
        {containerUrl && (
          <div className="py-2 px-3">
            <span className="text-xs font-light">Data Location</span>
            <div className="flex flex-row">
              <span>{containerUrl}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
