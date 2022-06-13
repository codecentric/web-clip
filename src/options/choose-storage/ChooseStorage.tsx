import React from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useChooseStorage } from './useChooseStorage';

export const ChooseStorage = () => {
  const { containerUrl } = useChooseStorage();
  return (
    <div>
      <p className="my-4 font-thin">Where do you want to store your clips?</p>
      <Input value={containerUrl} />
      <Button loading={false} loadingLabel="Wait" onClick={() => null}>
        Continue
      </Button>
    </div>
  );
};
