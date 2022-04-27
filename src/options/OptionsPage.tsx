import React from 'react';
import { Session } from '../solid-client-authn-chrome-ext/Session';
import { AuthenticationContext } from './auth/AuthenticationContext';
import { AuthorizationSection } from './AuthorizationSection';
import { ConnectPodSection } from './connect-pod/ConnectPodSection';
import { GetAPodSection } from './get-a-pod/GetAPodSection';
import { HelpSection } from './HelpSection';
import { OptionsContext } from './OptionsContext';
import { useOptionsPage } from './useOptionsPage';

interface Props {
  session: Session;
  redirectUrl: string;
  extensionUrl: string;
}

export const OptionsPage = ({ session, redirectUrl, extensionUrl }: Props) => {
  const page = useOptionsPage();

  if (page.state.loading) {
    return <p>Loading...</p>;
  }

  return (
    <AuthenticationContext.Provider
      value={{
        session,
        redirectUrl,
      }}
    >
      <OptionsContext.Provider value={page}>
        <main className="container text-lg mx-auto p-8">
          <h1 className="text-xl font-medium my-8">Setup WebClip</h1>
          <GetAPodSection />
          <ConnectPodSection />
          <AuthorizationSection
            extensionUrl={extensionUrl}
          ></AuthorizationSection>
          <HelpSection></HelpSection>
        </main>
      </OptionsContext.Provider>
    </AuthenticationContext.Provider>
  );
};
