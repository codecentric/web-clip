import { useEffect, useReducer, useState } from 'react';
import { SolidSession } from './api/SolidSession';
import { MessageHandler } from './messaging/MessageHandler';

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
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    sessionInfo: session.info,
  });

  const [messageHandler] = useState(new MessageHandler(dispatch));

  const { redirectUrl, extensionUrl } = useChromeExtension(messageHandler);

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
