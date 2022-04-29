import { useEffect, useReducer } from 'react';

import { load as loadOptions, save as saveOptions } from './optionsStorageApi';

import reducer, { ActionType, State } from './reducer';

export const initialState: State = {
  loading: true,
  saved: false,
  sessionInfo: {
    sessionId: '',
    isLoggedIn: false,
  },
  value: { providerUrl: '' },
};

export const useOptionsPage = () => {
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
      saveOptions(state.value).then(() =>
        dispatch({ type: ActionType.OPTIONS_SAVED })
      );
    }
  }, [state.sessionInfo.isLoggedIn]);

  return {
    state,
    dispatch,
  };
};
