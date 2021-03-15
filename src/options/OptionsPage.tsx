import React from 'react';
import { useOptions } from './useOptions';

export const OptionsPage = () => {
  const { providerUrl, save } = useOptions();

  return (
    <section>
      <label>
        <p>Pod Provider URL</p>
        <input value={providerUrl} type="url" required />
      </label>
      <button onClick={() => save()}>Save</button>
    </section>
  );
};
