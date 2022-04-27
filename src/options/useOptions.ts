import { useEffect, useReducer, useState } from 'react';

import {
  load as loadOptions,
  Options,
  save as saveOptions,
} from './optionsStorageApi';

import reducer, { ActionType, AsyncLoadingState } from './reducer';

const initialState: AsyncLoadingState<Options> = {
  loading: true,
  value: { providerUrl: '' },
};

export const useOptions = () => {
  const [saved, setSaved] = useState<boolean>(false);

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    loadOptions().then((options) => {
      dispatch({
        type: ActionType.OPTIONS_LOADED,
        payload: options,
      });
    });
  }, []);

  const setProviderUrl = (url: string) => {
    dispatch({
      type: ActionType.SET_PROVIDER_URL,
      payload: url,
    });
  };

  const save = () => saveOptions(state.value).then(() => setSaved(true));

  const onLogin = async () => {
    await save();
  };

  return {
    loading: state.loading,
    ...state.value,
    setProviderUrl,
    saved,
    onLogin,
  };
};
