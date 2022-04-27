import { useOptions } from '../OptionsContext';
import { ActionType } from '../reducer';

export const useConnectPod = () => {
  const { dispatch, state, save } = useOptions();
  return {
    setProviderUrl: (url: string) =>
      dispatch({ type: ActionType.SET_PROVIDER_URL, payload: url }),
    providerUrl: state.value.providerUrl,
    onLogin: save,
  };
};
