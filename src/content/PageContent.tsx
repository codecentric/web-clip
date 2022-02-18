import { Session } from '@inrupt/solid-client-authn-browser';
import React from 'react';
import { SolidApiContext } from '../api/apiContext';
import { StoreContext } from '../store/context';
import { LoginButton } from './LoginButton';
import { ToolbarContainer } from './ToolbarContainer';
import { useSessionInfo } from './useSessionInfo';
import { useSolid } from './useSolid';

interface PageContentProps {
  legacySession: Session;
  close: () => void;
}

export const PageContent = ({ legacySession, close }: PageContentProps) => {
  const { store, solidApi } = useSolid(legacySession);
  const { sessionInfo } = useSessionInfo(legacySession);
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
      <StoreContext.Provider value={store}>
        <SolidApiContext.Provider value={solidApi}>
          {sessionInfo.isLoggedIn ? <ToolbarContainer /> : <LoginButton />}
        </SolidApiContext.Provider>
      </StoreContext.Provider>
    </div>
  );
};
