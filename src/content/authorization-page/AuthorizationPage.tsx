import { Session } from '@inrupt/solid-client-authn-browser';
import React, { useState } from 'react';

interface Props {
  session: Session;
  providerUrl: string;
  extensionId: string;
}

export const AuthorizationPage = ({
  session,
  providerUrl,
  extensionId,
}: Props) => {
  return (
    <div>
      <div className="bg-red-300 p-3 m-4">
        WebClip Authorization Page for {extensionId} and provider {providerUrl}
      </div>
      <pre>{JSON.stringify(session.info, null, 2)}</pre>
    </div>
  );
};
