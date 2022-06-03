import { Session } from '@inrupt/solid-client-authn-browser';
import React from 'react';
import { ExtensionUrl } from '../../chrome/urls';
import { ErrorDetails } from './ErrorDetails';
import { useAuthorization } from './useAuthorization';

interface Props {
  session: Session;
  providerUrl: string;
  extensionUrl: ExtensionUrl;
}

export const AuthorizationPage = ({
  session,
  providerUrl,
  extensionUrl,
}: Props) => {
  const { loading, success, error } = useAuthorization(
    session,
    providerUrl,
    extensionUrl
  );

  return (
    <div className="font-sans">
      {loading ? (
        <LoadingMessage />
      ) : success ? (
        <SuccessMessage />
      ) : (
        <ErrorDetails error={error} />
      )}
    </div>
  );
};

const SuccessMessage = () => (
  <div className="flex gap-2 m-4 rounded-md border-4 border-green-400 bg-green-50 p-3">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-green-800"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
    <p>All done! You can now close this window and start using WebClip.</p>
  </div>
);

const LoadingMessage = () => (
  <div className="m-4 flex animate-pulse gap-2 rounded-md border-4 border-blue-400 bg-blue-50 p-3">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-blue-800"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
        clipRule="evenodd"
      />
    </svg>
    Please wait, while WebClip is being authorized.
  </div>
);
