import React from 'react';
import { ExtensionUrl } from '../../chrome/urls';
import { CheckingAccessPermissions } from './CheckingAccessPermissions';
import { GrantAccess } from './GrantAccess';
import { useCheckAccessPermissions } from './useCheckAccessPermissions';

interface Props {
  extensionUrl: ExtensionUrl;
  redirectUrl: URL;
}

export const AuthorizationSection = ({ extensionUrl, redirectUrl }: Props) => {
  const { checking, profileApi } = useCheckAccessPermissions(
    extensionUrl,
    redirectUrl
  );

  return (
    <section>
      <h2 className="text-lg font-medium my-8">Authorize WebClip</h2>
      {checking ? (
        <CheckingAccessPermissions extensionUrl={extensionUrl} />
      ) : (
        <GrantAccess
          authorizationPageBaseUrl={profileApi.getProfileDocUrl()}
          extensionUrl={extensionUrl}
        />
      )}
    </section>
  );
};
