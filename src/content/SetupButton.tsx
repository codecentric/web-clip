import React from 'react';
import { Button } from '../components/Button';
import { MessageType } from '../messages';
import { sendMessage } from './sendMessage';

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
        await sendMessage({ type: MessageType.OPEN_OPTIONS });
      }}
    >
      Get started
    </Button>
  );
};
