import React from 'react';
import { SolidApiContext } from '../api/apiContext';
import { SessionInfo } from '../api/SolidApi';
import { StoreContext } from '../store/context';
import { LoginButton } from './LoginButton';
import { ToolbarContainer } from './ToolbarContainer';
import { useSolid } from './useSolid';

interface PageContentProps {
  sessionInfo: SessionInfo;
  close: () => void;
}

export const PageContent = ({ sessionInfo, close }: PageContentProps) => {
  const { store, solidApi } = useSolid(sessionInfo);
  return (
    <div className='overlay'>
      <div className='close-container'>
        <button className='close' aria-label='Close' onClick={close}>️⨯</button>
      </div>
      <div className='paperclip' />
      <h1>WebClip</h1>
      <StoreContext.Provider value={store}>
        <SolidApiContext.Provider value={solidApi}>
          {sessionInfo.isLoggedIn ? <ToolbarContainer /> : <LoginButton />}
        </SolidApiContext.Provider>
      </StoreContext.Provider>
    </div>
  );
};
