import { useEffect, useState } from 'react';
import { ProfileApi } from '../api/ProfileApi';
import { useOptions } from '../OptionsContext';
import { ActionType } from '../reducer';

export const useCheckAccessPermissions = (
  extensionUrl: string,
  redirectUrl: string,
  profileApi: ProfileApi
) => {
  const { state, dispatch } = useOptions();

  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (state.sessionInfo.isLoggedIn) {
      setChecking(true);
      profileApi
        .canExtensionAccessPod(extensionUrl, redirectUrl)
        .then((trusted) => {
          setChecking(false);
          if (trusted) {
            dispatch({ type: ActionType.TRUSTED_APP });
          }
        });
    }
  }, [state.sessionInfo.isLoggedIn]);

  return {
    checking,
  };
};
