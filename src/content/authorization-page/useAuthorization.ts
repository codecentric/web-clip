import { Session } from '@inrupt/solid-client-authn-browser';

export const useAuthorization = (
  session: Session,
  providerUrl: string,
  extensionId: string
) => {
  return {
    loading: false,
    success: true,
    error: new Error('todo: implement error handling'),
  };
};
