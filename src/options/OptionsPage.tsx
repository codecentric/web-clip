import React from 'react';
import { Session } from '../solid-client-authn-chrome-ext/Session';
import { AuthenticationContext } from './auth/AuthenticationContext';
import { AuthorizationSection } from './authorization-section/AuthorizationSection';
import { ConnectPodSection } from './connect-pod/ConnectPodSection';
import { ConnectionEstablished } from './connection-established/ConnectionEstablished';
import { OptionsContext } from './OptionsContext';
import { useOptionsPage } from './useOptionsPage';

interface Props {
  session: Session;
}

const AllSaved = () => {
  return (
    <span className="flex items-center gap-1 text-xs font-thin text-green-800">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="text-green-700 h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      All settings saved
    </span>
  );
};

export const OptionsPage = ({ session }: Props) => {
  const { state, dispatch, profileApi, redirectUrl, extensionUrl } =
    useOptionsPage(session);

  if (state.loading) {
    return <p>Loading...</p>;
  }

  const trustedApp = state.value.trustedApp;
  const isLoggedIn = state.sessionInfo.isLoggedIn;

  return (
    <AuthenticationContext.Provider
      value={{
        session,
        redirectUrl: redirectUrl.toString(),
      }}
    >
      <OptionsContext.Provider value={{ state, dispatch }}>
        <main className="container text-lg mx-auto p-8">
          <h1 className="my-8 flex items-center gap-2 text-xl font-medium">
            Setup WebClip {state.saved && <AllSaved />}
          </h1>
          {!isLoggedIn && !trustedApp && <ConnectPodSection />}
          {isLoggedIn && !trustedApp && (
            <AuthorizationSection
              extensionUrl={extensionUrl}
              redirectUrl={redirectUrl}
              providerUrl={state.value.providerUrl}
              profileApi={profileApi}
            ></AuthorizationSection>
          )}

          {trustedApp && <ConnectionEstablished />}
        </main>
      </OptionsContext.Provider>
    </AuthenticationContext.Provider>
  );
};
