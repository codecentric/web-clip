import { useEffect, useReducer } from 'react';

import { load as loadOptions, save as saveOptions } from './optionsStorageApi';
import { ProfileApi } from './api/ProfileApi';

import reducer, { ActionType, State } from './reducer';

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

export const useOptionsPage = (
  extensionUrl: string,
  profileApi: ProfileApi
) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    loadOptions().then((options) => {
      dispatch({
        type: ActionType.OPTIONS_LOADED,
        payload: options,
      });
    });
  }, []);

  useEffect(() => {
    if (state.sessionInfo.isLoggedIn) {
      profileApi.hasGrantedAccessTo(extensionUrl).then((trusted) => {
        if (trusted) {
          dispatch({ type: ActionType.TRUSTED_APP });
        }
      });
    }
  }, [state.sessionInfo.isLoggedIn]);

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
  };
};
