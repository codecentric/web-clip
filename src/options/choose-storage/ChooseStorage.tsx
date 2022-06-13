import React from 'react';
import { useChooseStorage } from './useChooseStorage';

export const ChooseStorage = () => {
  const { containerUrl } = useChooseStorage();
  return (
    <div>
      Where do you want to store your clips?
      <input value={containerUrl} />
    </div>
  );
};
