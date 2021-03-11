import { Session } from '@inrupt/solid-client-authn-browser';
import React from 'react';
import { SolidApiContext } from '../api/apiContext';
import { SolidApi } from '../api/solidApi';
import { LoginButton } from './LoginButton';
import { Toolbar } from './Toolbar';

interface PageContentProps {
  sessionInfo: Session['info'];
}

export const PageContent = ({ sessionInfo }: PageContentProps) => {
  const solidApi = new SolidApi();
  return (
    <SolidApiContext.Provider value={solidApi}>
      {sessionInfo.isLoggedIn ? (
        <Toolbar webId={sessionInfo.webId} />
      ) : (
        <LoginButton />
      )}
    </SolidApiContext.Provider>
  );
};
