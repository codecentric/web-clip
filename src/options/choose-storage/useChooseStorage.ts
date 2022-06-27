import { useCallback, useEffect, useState } from 'react';
import urljoin from 'url-join';
import { useStorageApi } from '../../api/ApiContext';
import { useOptions } from '../OptionsContext';
import { ActionType } from '../reducer';

interface State {
  loading: boolean;
  submitting: boolean;
  containerUrl: string;
  manualChanges: boolean;
  validationError?: Error;
}

function addMissingSlash(containerUrl: string) {
  return urljoin(containerUrl, '/');
}

export function useChooseStorage() {
  const { dispatch } = useOptions();
  const [state, setState] = useState<State>({
    loading: true,
    submitting: false,
    containerUrl: '',
    manualChanges: false,
  });
  const storageApi = useStorageApi();
  useEffect(() => {
    storageApi.findStorage().then((storage) => {
      setState((state) => ({
        ...state,
        loading: false,
        manualChanges: storage === null,
        containerUrl: storage
          ? new URL('webclip/', storage.url).toString()
          : null,
      }));
    });
  }, [storageApi]);

  const setContainerUrl = useCallback(
    (containerUrl: string) =>
      setState((state) => ({
        ...state,
        manualChanges: true,
        validationError: null,
        containerUrl,
      })),
    []
  );

  const submit = useCallback(async () => {
    const containerUrl = addMissingSlash(state.containerUrl);
    setState((state) => ({
      ...state,
      containerUrl,
      submitting: true,
    }));
    const result = await storageApi.ensureValidContainer(containerUrl);
    setState((state) => ({
      ...state,
      submitting: false,
      validationError:
        result === false
          ? new Error(
              'Please provide the URL of an existing, accessible container'
            )
          : null,
    }));
    if (result === true) {
      dispatch({
        type: ActionType.SELECTED_STORAGE_CONTAINER,
        payload: containerUrl,
      });
    }
  }, [storageApi, state.containerUrl]);

  return {
    ...state,
    setContainerUrl,
    submit,
  };
}
