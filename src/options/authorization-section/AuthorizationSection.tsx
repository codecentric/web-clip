import React from 'react';
import { ProfileApi } from '../api/ProfileApi';
import { CheckingAccessPermissions } from './CheckingAccessPermissions';
import { GrantAccess } from './GrantAccess';
import { useCheckAccessPermissions } from './useCheckAccessPermissions';

interface Props {
  extensionUrl: string;
  providerUrl: string;
  profileApi: ProfileApi;
}

export const AuthorizationSection = ({
  extensionUrl,
  providerUrl,
  profileApi,
}: Props) => {
  const { checking } = useCheckAccessPermissions(extensionUrl, profileApi);

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