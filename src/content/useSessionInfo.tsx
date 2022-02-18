import { Session } from '@inrupt/solid-client-authn-browser';

export function useSessionInfo(legacySession: Session) {
  return {
    sessionInfo: legacySession.info,
  };
}
