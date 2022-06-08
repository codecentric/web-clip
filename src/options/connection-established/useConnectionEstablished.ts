import { useAuthentication } from '../auth/AuthenticationContext';
import { useOptions } from '../OptionsContext';
import { ActionType } from '../reducer';

export const useConnectionEstablished = () => {
  const { state, dispatch } = useOptions();
  const { session } = useAuthentication();
  return {
    providerUrl: state.value.providerUrl,
    disconnect: async () => {
      await session.logout();
      dispatch({ type: ActionType.DISCONNECTED_POD });
    },
  };
};
