import React from 'react';
import { Button } from '../components/Button';
import { openOptions } from './openOptions';

interface Props {
  close: () => void;
}

export const SetupButton = ({ close }: Props) => {
  return (
    <Button
      loading={false}
      loadingLabel="Please wait"
      onClick={async () => {
        close();
        await openOptions();
      }}
    >
      Get started
    </Button>
  );
};
