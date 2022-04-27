import { useEffect, useReducer, useState } from 'react';

import {
  load as loadOptions,
  Options,
  save as saveOptions,
} from './optionsStorageApi';

interface AsyncLoadingState<T> {
  loading: boolean;
  value?: T;
}

const initialState: AsyncLoadingState<Options> = {
  loading: true,
  value: { providerUrl: '' },
};

enum ActionType {
  SET_PROVIDER_URL = 'SET_PROVIDER_URL',
  OPTIONS_LOADED = 'OPTIONS_LOADED',
}

type Action = OptionsLoaded | SetProviderUrl;

interface OptionsLoaded {
  type: ActionType.OPTIONS_LOADED;
  payload: Options;
}

interface SetProviderUrl {
  type: ActionType.SET_PROVIDER_URL;
  payload: string;
}

function reducer(
  state: AsyncLoadingState<Options>,
  action: Action
): AsyncLoadingState<Options> {
  switch (action.type) {
    case ActionType.SET_PROVIDER_URL:
      return {
        ...state,
        value: {
          providerUrl: action.payload,
        },
      };
    case ActionType.OPTIONS_LOADED:
      return {
        loading: false,
        value: action.payload,
      };
    default:
      throw new Error();
  }
}

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
