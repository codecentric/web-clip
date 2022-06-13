import { useEffect, useState } from 'react';
import { useStorageApi } from '../../api/ApiContext';

export function useChooseStorage() {
  const [state, setState] = useState({
    loading: true,
    containerUrl: '',
  });
  const storageApi = useStorageApi();
  useEffect(() => {
    storageApi.findStorage().then((storage) => {
      setState({
        loading: false,
        containerUrl: new URL('webclip/', storage.url).toString(),
      });
    });
  }, [storageApi]);
  return state;
}
