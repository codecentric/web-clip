import { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import React from 'react';
import { LoginButton } from './LoginButton';
import { openOptions } from './openOptions';
import { SetupButton } from './SetupButton';
import { ToolbarContainer } from './ToolbarContainer';
import { useSessionInfo } from './useSessionInfo';

interface PageContentProps {
  sessionInfo: ISessionInfo;
  providerUrl: string;
  close: () => void;
}

export const PageContent = ({
  sessionInfo,
  providerUrl,
  close,
}: PageContentProps) => {
  const currentSessionInfo = useSessionInfo(sessionInfo);
  return (
    <div className="z-max fixed top-0 right-0 m-8 flex h-auto w-auto flex-col items-center rounded bg-white pb-4 pt-3 px-2 font-sans text-base text-gray-700 shadow">
      <div className="flex w-full items-center mb-2 justify-end gap-2">
        <OptionsButton
          onClick={async () => {
            close();
            await openOptions();
          }}
        />
        <CloseButton onClick={close} />
      </div>
      <div className="paperclip" />
      <h1 className="text-3xl mx-4 my-2">WebClip</h1>
      {currentSessionInfo.isLoggedIn ? (
        <ToolbarContainer />
      ) : providerUrl ? (
        <LoginButton providerUrl={providerUrl} />
      ) : (
        <SetupButton close={close} />
      )}
    </div>
  );
};

interface ButtonProps {
  onClick: () => void;
}

const OptionsButton = ({ onClick }: ButtonProps) => (
  <button
    className="text-gray-300 hover:text-gray-500"
    aria-label="Options"
    onClick={onClick}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-7 w-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  </button>
);

const CloseButton = ({ onClick }: ButtonProps) => (
  <button
    className="text-gray-300 hover:text-gray-500"
    aria-label="Close"
    onClick={onClick}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
);
