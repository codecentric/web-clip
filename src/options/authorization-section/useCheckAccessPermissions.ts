import { useEffect } from 'react';
import { ProfileApi } from '../api/ProfileApi';
import { useOptions } from '../OptionsContext';
import { ActionType } from '../reducer';

export const useCheckAccessPermissions = (
  extensionUrl: string,
  profileApi: ProfileApi
) => {
  const { state, dispatch } = useOptions();

  useEffect(() => {
    if (state.sessionInfo.isLoggedIn) {
      profileApi.hasGrantedAccessTo(extensionUrl).then((trusted) => {
        if (trusted) {
          dispatch({ type: ActionType.TRUSTED_APP });
        }
      });
    }
  }, [state.sessionInfo.isLoggedIn]);
};
