import React from 'react';
import { Session } from '../solid-client-authn-chrome-ext/Session';
import { AuthenticationContext } from './auth/AuthenticationContext';
import { AuthorizationSection } from './AuthorizationSection';
import { ConnectPodSection } from './connect-pod/ConnectPodSection';
import { GetAPodSection } from './get-a-pod/GetAPodSection';
import { HelpSection } from './HelpSection';
import { OptionsContext } from './OptionsContext';
import { ProfileApi } from './api/ProfileApi';
import { useOptionsPage } from './useOptionsPage';

interface Props {
  session: Session;
  redirectUrl: string;
  extensionUrl: string;
  profileApi: ProfileApi;
}

export const OptionsPage = ({
  session,
  redirectUrl,
  extensionUrl,
  profileApi,
}: Props) => {
  const page = useOptionsPage(extensionUrl, profileApi);

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
          {page.state.saved && (
            <div
              className="flex lg:inline-flex bg-green-100 border border-green-400 text-green-700 px-2 py-1 rounded relative"
              role="alert"
            >
              <span className="flex rounded-full text-white bg-green-500 uppercase px-2 py-1 text-xs font-bold mr-3">
                Success
              </span>
              <span className="block sm:inline">
                Your settings have been saved
              </span>
            </div>
          )}
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
