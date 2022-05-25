import React from 'react';
import { Session } from '../solid-client-authn-chrome-ext/Session';
import { OptionsPage } from './OptionsPage';
import { useChromeExtension } from './useChromeExtension';
import { useSolidApis } from './useSolidApis';

interface Props {
  session: Session;
}

export const ChromeExtensionOptionsPage = ({ session }: Props) => {
  const { profileApi } = useSolidApis(session);

  const { redirectUrl, extensionUrl } = useChromeExtension();

  return (
    <OptionsPage
      session={session}
      redirectUrl={redirectUrl}
      extensionUrl={extensionUrl}
      profileApi={profileApi}
    />
  );
};
