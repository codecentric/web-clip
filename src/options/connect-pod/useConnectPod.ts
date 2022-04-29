import { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import { useOptions } from '../OptionsContext';
import { ActionType } from '../reducer';

export const useConnectPod = () => {
  const { dispatch, state } = useOptions();
  return {
    setProviderUrl: (url: string) =>
      dispatch({ type: ActionType.SET_PROVIDER_URL, payload: url }),
    providerUrl: state.value.providerUrl,
    onLogin: (sessionInfo: ISessionInfo) =>
      dispatch({ type: ActionType.LOGGED_IN, payload: sessionInfo }),
  };
};
