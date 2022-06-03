import { useEffect, useState } from 'react';
import { ProfileApi } from '../api/ProfileApi';
import { useOptions } from '../OptionsContext';
import { ActionType } from '../reducer';

export const useCheckAccessPermissions = (
  extensionUrl: string,
  profileApi: ProfileApi
) => {
  const { state, dispatch } = useOptions();

  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (state.sessionInfo.isLoggedIn) {
      setChecking(true);
      profileApi.hasGrantedAccessTo(extensionUrl).then((trusted) => {
        if (trusted) {
          dispatch({ type: ActionType.TRUSTED_APP });
        }
        setChecking(false);
      });
    }
  }, [state.sessionInfo.isLoggedIn]);

  return {
    checking,
  };
};
