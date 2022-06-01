import { useOptions } from '../OptionsContext';
import { ActionType } from '../reducer';

export const useConnectionEstablished = () => {
  const { state, dispatch } = useOptions();
  return {
    providerUrl: state.value.providerUrl,
    disconnect: () => {
      dispatch({ type: ActionType.DISCONNECTED_POD });
    },
  };
};
