import { graph } from 'rdflib';
import React from 'react';
import { SolidApiContext } from '../api/apiContext';
import { SessionInfo, SolidApi } from '../api/SolidApi';
import { LoginButton } from './LoginButton';
import { Toolbar } from './Toolbar';

interface PageContentProps {
  sessionInfo: SessionInfo;
}

export const PageContent = ({ sessionInfo }: PageContentProps) => {
  const solidApi = new SolidApi(sessionInfo, graph());
  return (
    <SolidApiContext.Provider value={solidApi}>
      {sessionInfo.isLoggedIn ? <Toolbar /> : <LoginButton />}
    </SolidApiContext.Provider>
  );
};
