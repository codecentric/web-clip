import { useSolidApi } from '../api/apiContext';
import { useEffect, useState } from 'react';
import { Profile } from '../api/SolidApi';

export const useProfile = () => {
  const solidApi = useSolidApi(); //?
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    solidApi.loadProfile().then((profile) => {
      setLoading(false);
      setProfile(profile);
    });
  }, []);

  return { loading, profile };
};
