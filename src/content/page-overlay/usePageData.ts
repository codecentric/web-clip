import { useEffect, useState } from 'react';
import { MessageType } from '../../domain/messages';
import { sendMessage } from '../../chrome/sendMessage';

export const usePageData = (url: string) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    sendMessage({
      type: MessageType.IMPORT_PAGE_DATA,
      payload: {
        url,
      },
    }).then(() => {
      setLoading(false);
    });
  }, [url]);
  return {
    loading,
  };
};
