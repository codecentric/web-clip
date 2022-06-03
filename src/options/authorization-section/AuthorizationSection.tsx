import React from 'react';
import { ExtensionUrl } from '../../chrome/urls';
import { ProfileApi } from '../api/ProfileApi';
import { CheckingAccessPermissions } from './CheckingAccessPermissions';
import { GrantAccess } from './GrantAccess';
import { useCheckAccessPermissions } from './useCheckAccessPermissions';

interface Props {
  extensionUrl: ExtensionUrl;
  redirectUrl: URL;
  providerUrl: string;
  profileApi: ProfileApi;
}

export const AuthorizationSection = ({
  extensionUrl,
  redirectUrl,
  providerUrl,
  profileApi,
}: Props) => {
  const { checking } = useCheckAccessPermissions(
    extensionUrl,
    redirectUrl,
    profileApi
  );

  console.log({ extensionUrl, redirectUrl });

  return (
    <section>
      <h2 className="text-lg font-medium my-8">Authorize WebClip</h2>
      {checking ? (
        <CheckingAccessPermissions extensionUrl={extensionUrl} />
      ) : (
        <GrantAccess providerUrl={providerUrl} />
      )}
    </section>
  );
};
