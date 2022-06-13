import { useEffect, useState } from 'react';
import { useStorageApi } from '../../api/ApiContext';

export function useChooseStorage() {
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
  };
}
