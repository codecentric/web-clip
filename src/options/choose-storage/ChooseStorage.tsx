import React, { ChangeEvent } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useChooseStorage } from './useChooseStorage';

export const ChooseStorage = () => {
  const { loading, manualChanges, containerUrl, setContainerUrl } =
    useChooseStorage();
  return (
    <div>
      <p className="my-4 font-thin">
        {loading
          ? "Let's find a storage location for your clips."
          : containerUrl === null
          ? 'WebClip could not find a storage associated with your Pod, please enter a URL manually.'
          : 'WebClip is going to store data at the following location. Confirm, if you are fine with that, or enter the URL of a different location.'}
      </p>
      <label className="block text-gray-700 text-sm font-bold mb-2">
        <p>Storage Location</p>
        <Input
          value={containerUrl}
          onChange={(event) => setContainerUrl(event.target.value)}
        />
      </label>
      <Button
        loading={loading}
        loadingLabel="Please wait..."
        onClick={() => null}
      >
        {manualChanges ? 'Submit' : 'Confirm'}
      </Button>
    </div>
  );
};
