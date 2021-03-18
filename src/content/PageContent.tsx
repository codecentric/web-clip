import { graph } from 'rdflib';
import React from 'react';
import { SolidApiContext } from '../api/apiContext';
import { SessionInfo, SolidApi } from '../api/SolidApi';
import { Store } from '../store/Store';
import { LoginButton } from './LoginButton';
import { ToolbarContainer } from './ToolbarContainer';

interface PageContentProps {
  sessionInfo: SessionInfo;
}

export const PageContent = ({ sessionInfo }: PageContentProps) => {
  const store = new Store(graph());
  const solidApi = new SolidApi(sessionInfo, store);
  return (
    <div className="overlay">
      <div className="paperclip" />
      <h1>WebClip</h1>
      <SolidApiContext.Provider value={solidApi}>
        {sessionInfo.isLoggedIn ? <ToolbarContainer /> : <LoginButton />}
      </SolidApiContext.Provider>
    </div>
  );
};
