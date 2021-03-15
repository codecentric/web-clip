import React from 'react';
import { useSolidApi } from '../api/apiContext';

export const LoginButton = () => {
  const solidApi = useSolidApi();
  return <button onClick={() => solidApi.login()}>Login</button>;
};
