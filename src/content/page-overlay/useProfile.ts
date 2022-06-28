import { useEffect, useState } from 'react';
import { MessageType } from '../../domain/messages';
import { sendMessage } from '../../chrome/sendMessage';
import { Profile } from '../../domain/Profile';

interface AsyncState<T> {
  loading: boolean;
  value?: T;
}

export const useProfile = () => {
  const [{ loading, value }, setState] = useState<AsyncState<Profile>>({
    loading: true,
  });

  useEffect(() => {
    sendMessage({ type: MessageType.LOAD_PROFILE }).then((profile: Profile) =>
      setState({
        loading: false,
        value: profile,
      })
    );
  }, []);

  return {
    loading,
    profile: value,
  };
};
