import { useEffect, useState } from 'react';
import { useStorageApi } from '../../api/ApiContext';

export function useChooseStorage() {
  const [containerUrl, setContainerUrl] = useState('');
  const storageApi = useStorageApi();
  useEffect(() => {
    storageApi.findStorage().then((storage) => {
      setContainerUrl(new URL('webclip/', storage.url).toString());
    });
  }, [storageApi]);
  return {
    loading: true,
    containerUrl,
  };
}
