import { useEffect, useState } from 'react';
import { useStorageApi } from '../../api/ApiContext';
import { Storage } from '../../domain/Storage';
import { useOptions } from '../OptionsContext';
import { ActionType } from '../reducer';

export function useChooseStorage() {
  const { dispatch } = useOptions();
  const [state, setState] = useState({
    loading: true,
    containerUrl: '',
    manualChanges: false,
  });
  const storageApi = useStorageApi();
  useEffect(() => {
    storageApi.findStorage().then((storage) => {
      setState({
        loading: false,
        manualChanges: storage === null,
        containerUrl: storage
          ? new URL('webclip/', storage.url).toString()
          : null,
      });
    });
  }, [storageApi]);

  const setContainerUrl = (containerUrl: string) =>
    setState((state) => ({
      ...state,
      manualChanges: true,
      containerUrl,
    }));

  return {
    ...state,
    setContainerUrl,
    submit: () =>
      dispatch({
        type: ActionType.SELECTED_STORAGE_CONTAINER,
        payload: state.containerUrl,
      }),
  };
}
