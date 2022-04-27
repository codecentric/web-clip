import { useEffect, useReducer } from 'react';

import { load as loadOptions, save as saveOptions } from './optionsStorageApi';

import reducer, { ActionType, State } from './reducer';

export const initialState: State = {
  loading: true,
  saved: false,
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

  const save = () =>
    saveOptions(state.value).then(() =>
      dispatch({ type: ActionType.OPTIONS_SAVED })
    );

  return {
    state,
    save,
    dispatch,
  };
};
