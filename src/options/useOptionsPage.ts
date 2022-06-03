import { useEffect, useReducer } from 'react';
import { SolidSession } from './api/SolidSession';

import { load as loadOptions, save as saveOptions } from './optionsStorageApi';

import reducer, { ActionType, State } from './reducer';
import { useChromeExtension } from './useChromeExtension';
import { useSolidApis } from './useSolidApis';

export const initialState: State = {
  loading: true,
  saved: false,
  unsavedChanges: false,
  sessionInfo: {
    sessionId: '',
    isLoggedIn: false,
  },
  value: { providerUrl: '', trustedApp: false },
};

export const useOptionsPage = (session: SolidSession) => {
  const { profileApi } = useSolidApis(session);
  const [state, dispatch] = useReducer(reducer, initialState);

  const { redirectUrl, extensionUrl } = useChromeExtension();

  useEffect(() => {
    loadOptions().then((options) => {
      dispatch({
        type: ActionType.OPTIONS_LOADED,
        payload: options,
      });
    });
  }, []);

  function save() {
    saveOptions(state.value).then(() =>
      dispatch({ type: ActionType.OPTIONS_SAVED })
    );
  }

  useEffect(() => {
    if (state.unsavedChanges) {
      save();
    }
  }, [state.value.trustedApp, state.value.providerUrl, state.unsavedChanges]);

  return {
    state,
    dispatch,
    profileApi,
    redirectUrl,
    extensionUrl,
  };
};
