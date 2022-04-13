import { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import React from 'react';
import { LoginButton } from './LoginButton';
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
    <div className="font-sans text-base text-gray-700 z-max fixed top-0 right-0 m-8 shadow rounded w-auto h-auto p-4 bg-white flex flex-col items-center">
      <div className="flex w-full justify-end items-center">
        <button
          className="text-gray-300 text-3xl hover:text-gray-500 relative w-4 h-4 -top-4"
          aria-label="Close"
          onClick={close}
        >
          ️⨯
        </button>
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
