import { useEffect, useState } from 'react';
import { useProfileApi } from '../../api/ApiContext';
import { ExtensionUrl } from '../../chrome/urls';
import { useOptions } from '../OptionsContext';
import { ActionType } from '../reducer';

export const useCheckAccessPermissions = (
  extensionUrl: ExtensionUrl,
  redirectUrl: URL
) => {
  const { state, dispatch } = useOptions();
  const profileApi = useProfileApi();

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
    profileApi,
  };
};
