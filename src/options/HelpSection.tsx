import React from 'react';

export const HelpSection = () => {
  return (
    <details className="mt-2 p-2 rounded-lg border-2 border-slate-200 bg-slate-50 open:border-blue-200 open:bg-blue-50 w-fit">
      <summary className="list-none text-slate-600 cursor-pointer">
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
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </summary>
      <h2 className="my-2 text-lg font-medium">Need help?</h2>
      <p className="my-2">
        Do not hesitate to contact us, if you struggle with the setup process.
        <a
          className="my-1 block font-bold text-blue-600 hover:underline"
          href="https://github.com/codecentric/web-clip/discussions/categories/q-a"
        >
          {' '}
          Just post to our Q&A section on GitHub.{' '}
        </a>
      </p>
    </details>
  );
};
